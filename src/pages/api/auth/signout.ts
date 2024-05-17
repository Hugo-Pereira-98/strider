import { NextApiRequest, NextApiResponse } from 'next';
import { deleteCookie } from 'cookies-next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    deleteCookie('strider-access', { req, res, path: '/' });
    deleteCookie('strider-refresh', { req, res, path: '/' });
    deleteCookie('strider-id', { req, res, path: '/' });

    res.status(200).json({ message: 'Successfully signed out' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
