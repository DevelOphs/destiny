import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const {
        customerId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        totalPrice,
        paymentType,
        deliveryType,
        products,
        sendEmail,
      } = req.body;

      // Generar un número de orden único de 6 dígitos
      const orderNumber = Math.floor(Math.random() * 900000) + 100000;

      // Crear la orden de forma persistente en PostgreSQL
      const newOrder = await prisma.order.create({
        data: {
          orderNumber,
          customerId: customerId ? parseInt(customerId as string, 10) : 1,
          customerName: customerName || "Cliente Destiny",
          customerEmail: customerEmail || "cliente@destiny.com",
          customerPhone: customerPhone || "+593",
          shippingAddress: shippingAddress || "Dirección de despacho registrada",
          orderDate: new Date(),
          paymentType: paymentType || "CASH_ON_DELIVERY",
          deliveryType: deliveryType || "STORE_PICKUP",
          totalPrice: parseFloat(totalPrice) || 0,
          deliveryDate: new Date(new Date().setDate(new Date().getDate() + 5)),
          products: products || [],
          sendEmail: !!sendEmail,
        },
      });

      res.status(200).json({ success: true, data: newOrder });
    } catch (error) {
      console.error("Error creating order inside PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    // Proteger estrictamente la lectura de pedidos corporativos con API Key
    if (!validateAdminApiKey(req, res)) return;

    try {
      const orders = await prisma.order.findMany({
        orderBy: { orderDate: "desc" },
      });
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error("Error fetching orders from PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
