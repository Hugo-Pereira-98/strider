import { AuthenticationClient } from 'auth0';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function refresh(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const refreshTokenDataString = getCookie('posterr-refresh', { req, res });

  const refreshTokenData = refreshTokenDataString
    ? JSON.parse(refreshTokenDataString as string)
    : null;

  if (!refreshTokenData || !refreshTokenData.token) {
    deleteCookie('posterr-access', { req, res, path: '/' });
    deleteCookie('posterr-refresh', { req, res, path: '/' });
    deleteCookie('posterr-id', { req, res, path: '/' });
    return res
      .status(401)
      .json({ error: 'No refresh token provided', redirectTo: '/auth/signin' });
  }

  const auth0 = new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN!,
    clientId: process.env.AUTH0_CLIENT_ID!,
    clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  });

  try {
    const newTokens = await auth0.oauth.refreshToken({
      refresh_token: refreshTokenData.token,
    });

    const decodedAccessToken = jwt.decode(
      newTokens.access_token
    ) as jwt.JwtPayload | null;

    if (!decodedAccessToken || !decodedAccessToken.exp) {
      console.error('Access token is invalid or exp field is missing');
      throw new Error('Access token is invalid or exp field is missing');
    }

    const accessTokenExpires = new Date(decodedAccessToken.exp * 1000);

    setCookie(
      'posterr-access',
      JSON.stringify({
        token: newTokens.access_token,
        expiresAt: decodedAccessToken.exp,
      }),
      {
        req,
        res,
        expires: accessTokenExpires,
        path: '/',
      }
    );

    if (newTokens.refresh_token) {
      const refreshExpiresIn = 30 * 24 * 60 * 60; // 30 days in seconds
      setCookie(
        'posterr-refresh',
        JSON.stringify({
          token: newTokens.refresh_token,
          expiresAt: Math.floor(Date.now() / 1000) + refreshExpiresIn,
        }),
        {
          req,
          res,
          expires: new Date(Date.now() + refreshExpiresIn * 1000),
          httpOnly: true,
          path: '/',
        }
      );

      const posterrIdDataString = getCookie('posterr-id', { req, res });
      if (posterrIdDataString) {
        setCookie('posterr-id', posterrIdDataString, {
          req,
          res,
          expires: new Date(Date.now() + refreshExpiresIn * 1000),
          path: '/',
        });
      }
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    deleteCookie('posterr-access', { req, res, path: '/' });
    deleteCookie('posterr-refresh', { req, res, path: '/' });
    deleteCookie('posterr-id', { req, res, path: '/' });
    res
      .status(500)
      .json({ error: 'Failed to refresh token', redirectTo: '/auth/signin' });
  }
}
