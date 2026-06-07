import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!validateAdminApiKey(req, res)) return;

  const { id } = req.query;
  const couponId = parseInt(id as string, 10);

  if (isNaN(couponId)) {
    res.status(400).json({ success: false, error: "ID de cupón inválido." });
    return;
  }

  if (req.method === "PUT") {
    try {
      const { code, discountType, discountValue, usageLimit, status } = req.body;

      const currentCoupon = await prisma.coupon.findUnique({
        where: { id: couponId }
      });

      if (!currentCoupon) {
        res.status(404).json({ success: false, error: "Cupón no encontrado." });
        return;
      }

      const updateData: any = {};
      if (code) {
        const formattedCode = code.trim().toUpperCase();
        if (formattedCode !== currentCoupon.code) {
          // Verificar si el nuevo código ya está tomado
          const existing = await prisma.coupon.findUnique({
            where: { code: formattedCode }
          });
          if (existing) {
            res.status(400).json({ success: false, error: "Ese código de cupón ya está en uso." });
            return;
          }
        }
        updateData.code = formattedCode;
      }

      if (discountType) {
        if (discountType !== "PERCENTAGE" && discountType !== "FIXED") {
          res.status(400).json({ success: false, error: "El tipo de descuento debe ser PERCENTAGE o FIXED." });
          return;
        }
        updateData.discountType = discountType;
      }

      if (discountValue !== undefined) {
        updateData.discountValue = parseFloat(discountValue.toString());
      }

      if (usageLimit !== undefined) {
        updateData.usageLimit = usageLimit !== null ? parseInt(usageLimit.toString(), 10) : null;
      }

      if (status !== undefined) {
        updateData.status = parseInt(status.toString(), 10);
      }

      const updatedCoupon = await prisma.coupon.update({
        where: { id: couponId },
        data: updateData
      });

      res.status(200).json({ success: true, data: updatedCoupon });
    } catch (error) {
      console.error("Error updating coupon:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Directiva innegociable: DELETE debe ejecutar estrictamente un borrado lógico (status = 0)
      const existing = await prisma.coupon.findUnique({
        where: { id: couponId }
      });

      if (!existing) {
        res.status(404).json({ success: false, error: "Cupón no encontrado." });
        return;
      }

      const deletedCoupon = await prisma.coupon.update({
        where: { id: couponId },
        data: { status: 0 } // Borrado lógico
      });

      res.status(200).json({ success: true, message: "Cupón eliminado lógicamente.", data: deletedCoupon });
    } catch (error) {
      console.error("Error deleting coupon:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
