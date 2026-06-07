import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }

  const { code } = req.query;

  if (!code || typeof code !== "string") {
    res.status(400).json({ success: false, error: "El código de cupón es obligatorio." });
    return;
  }

  const formattedCode = code.trim().toUpperCase();

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: formattedCode }
    });

    if (!coupon) {
      res.status(200).json({ success: true, valid: false, error: "El cupón ingresado no existe." });
      return;
    }

    if (coupon.status !== 1) {
      res.status(200).json({ success: true, valid: false, error: "El cupón ingresado está inactivo." });
      return;
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      res.status(200).json({ success: true, valid: false, error: "El cupón ha alcanzado su límite máximo de usos." });
      return;
    }

    res.status(200).json({
      success: true,
      valid: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      }
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
