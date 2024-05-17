import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const refreshTokenDataString = getCookie('strider-refresh', { req, res });
  const refreshTokenData = refreshTokenDataString
    ? JSON.parse(refreshTokenDataString as string)
    : null;

  if (
    refreshTokenData &&
    refreshTokenData.expiresAt > Math.floor(Date.now() / 1000)
  ) {
    res.status(200).json({ session: refreshTokenData });
  } else {
    res.status(200).json({ session: null });
  }
}
