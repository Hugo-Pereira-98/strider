import { setCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, userName, userId } = req.body;
  const emailLowerCase = email.toLowerCase();

  try {
    const fakeToken = jwt.sign(
      {
        email: emailLowerCase,
        userName: userName,
        dateJoined: new Date(),
        userId,
      },
      process.env.NEXT_PUBLIC_AUTH0_CLIENT_SECRET!,
      { expiresIn: '1h' }
    );

    const refreshExpiresIn = 30 * 24 * 60 * 60;
    const accessExpiresIn = 60 * 60;

    const userIdData = {
      email: emailLowerCase,
      userName: userName,
      dateJoined: new Date(),
      sidebarCollapsed: true,
      userId,
    };
    setCookie('posterr-id', JSON.stringify(userIdData), {
      req,
      res,
      expires: new Date(Date.now() + refreshExpiresIn * 1000),
      path: '/',
    });

    const refreshTokenData = {
      token: fakeToken,
      expiresAt: Math.floor(Date.now() / 1000) + refreshExpiresIn,
    };
    setCookie('posterr-refresh', JSON.stringify(refreshTokenData), {
      req,
      res,
      expires: new Date(Date.now() + refreshExpiresIn * 1000),
      httpOnly: true,
      path: '/',
    });

    const accessTokenData = {
      token: fakeToken,
      expiresAt: Math.floor(Date.now() / 1000) + accessExpiresIn,
    };
    setCookie('posterr-access', JSON.stringify(accessTokenData), {
      req,
      res,
      expires: new Date(Date.now() + accessExpiresIn * 1000),
      path: '/',
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error handling signin:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
