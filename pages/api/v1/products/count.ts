import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category } = req.query;

  try {
    const where: any = { status: 1 };

    if (category) {
      where.category = {
        name: {
          equals: category as string,
          mode: "insensitive"
        },
        status: 1
      };
    }

    const count = await prisma.product.count({ where });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error in products count API:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
