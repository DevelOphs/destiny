import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, fullname, shippingAddress, phone } = req.body;

  res.status(200).json({
    id: 123,
    email,
    fullname,
    shippingAddress,
    phone,
    token: 'mock-jwt-token-abcd-1234'
  });
}
