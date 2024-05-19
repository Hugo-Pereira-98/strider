import { setCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { openDB, createUser, getUsers } from '../../../utils/indexedDB';

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, password, firstName, lastName } = req.body;
  const emailLowerCase = email.toLowerCase();

  try {
    const db = await openDB();
    const users = await getUsers(db);

    const existingUser = users.find((user) => user.email === emailLowerCase);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    await createUser(db, firstName, lastName, emailLowerCase, password);

    const fakeToken = jwt.sign(
      {
        email: emailLowerCase,
        name: `${firstName} ${lastName}`,
      },
      process.env.NEXT_PUBLIC_AUTH0_CLIENT_SECRET!,
      { expiresIn: '1h' }
    );

    const refreshExpiresIn = 30 * 24 * 60 * 60; // 30 days
    const accessExpiresIn = 60 * 60; // 1 hour

    const userIdData = {
      email: emailLowerCase,
      name: `${firstName} ${lastName}`,
      sidebarCollapsed: true,
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

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error handling signup:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default handler;
