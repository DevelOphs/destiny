import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminOrVendedorApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Proteger operaciones individuales de pedidos con validación de rol admin o vendedor
  if (!await validateAdminOrVendedorApiKey(req, res)) return;

  const { id } = req.query;
  const orderNum = parseInt(id as string, 10);

  if (isNaN(orderNum)) {
    res.status(400).json({ success: false, error: "Invalid order number format" });
    return;
  }

  if (req.method === "GET") {
    try {
      const order = await prisma.order.findUnique({
        where: { orderNumber: orderNum },
      });

      if (!order) {
        res.status(404).json({ success: false, error: "Order not found" });
        return;
      }

      res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error("Error fetching single order from PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { shippingAddress, totalPrice, paymentType, deliveryType, sendEmail } = req.body;

      const existingOrder = await prisma.order.findUnique({
        where: { orderNumber: orderNum },
      });

      if (!existingOrder) {
        res.status(404).json({ success: false, error: "Order not found to update" });
        return;
      }

      const updateData: any = {};
      if (shippingAddress !== undefined) updateData.shippingAddress = shippingAddress;
      if (totalPrice !== undefined) updateData.totalPrice = parseFloat(totalPrice);
      if (paymentType !== undefined) updateData.paymentType = paymentType;
      if (deliveryType !== undefined) updateData.deliveryType = deliveryType;
      if (sendEmail !== undefined) updateData.sendEmail = !!sendEmail;

      const updatedOrder = await prisma.order.update({
        where: { orderNumber: orderNum },
        data: updateData,
      });

      res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
      console.error("Error updating order inside PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      const existingOrder = await prisma.order.findUnique({
        where: { orderNumber: orderNum },
      });

      if (!existingOrder) {
        res.status(404).json({ success: false, error: "Order not found to delete" });
        return;
      }

      await prisma.order.delete({
        where: { orderNumber: orderNum },
      });

      res.status(200).json({ success: true, message: "Order deleted/cancelled successfully" });
    } catch (error) {
      console.error("Error deleting order from PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
