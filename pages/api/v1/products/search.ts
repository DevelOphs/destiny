import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;

  try {
    const where: any = { status: 1 };

    if (q) {
      const query = (q as string).toLowerCase().trim();
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { detail: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { category: true }
    });

    res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error searching products from PostgreSQL:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
