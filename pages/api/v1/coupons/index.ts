import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Para ver todos los cupones en el admin, requiere API Key
    const apiKey = req.headers["x-api-key"];
    const masterKey = process.env.ADMIN_API_KEY || "destiny_admin_secret_key_2026";
    const isAdmin = apiKey === masterKey;

    const whereClause = isAdmin ? {} : { status: 1 };

    try {
      const coupons = await prisma.coupon.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" }
      });
      res.status(200).json({ success: true, data: coupons });
    } catch (error) {
      console.error("Error fetching coupons:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    if (!validateAdminApiKey(req, res)) return;

    try {
      const { code, discountType, discountValue, usageLimit } = req.body;

      if (!code || !discountType || discountValue === undefined) {
        res.status(400).json({ success: false, error: "Los campos code, discountType y discountValue son obligatorios." });
        return;
      }

      if (discountType !== "PERCENTAGE" && discountType !== "FIXED") {
        res.status(400).json({ success: false, error: "El tipo de descuento debe ser PERCENTAGE o FIXED." });
        return;
      }

      const formattedCode = code.trim().toUpperCase();

      // Verificar si el código ya existe
      const existing = await prisma.coupon.findUnique({
        where: { code: formattedCode }
      });

      if (existing) {
        res.status(400).json({ success: false, error: "Ya existe un cupón registrado con ese código." });
        return;
      }

      const newCoupon = await prisma.coupon.create({
        data: {
          code: formattedCode,
          discountType,
          discountValue: parseFloat(discountValue.toString()),
          usageLimit: usageLimit ? parseInt(usageLimit.toString(), 10) : null,
          usedCount: 0,
          status: 1
        }
      });

      res.status(201).json({ success: true, data: newCoupon });
    } catch (error) {
      console.error("Error creating coupon:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
