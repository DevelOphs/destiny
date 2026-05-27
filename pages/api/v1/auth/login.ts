import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email } = req.body;

  res.status(200).json({
    data: {
      id: 123,
      email,
      fullname: 'Test User',
      phone: '+123456789',
      shippingAddress: '123 Test Street, Mock City'
    },
    token: 'mock-jwt-token-abcd-1234'
  });
}
