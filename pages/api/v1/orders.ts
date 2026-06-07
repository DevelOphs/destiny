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
        paymentType,
        deliveryType,
        products,
        sendEmail,
        couponCode,
        employeeCode,
      } = req.body;

      if (!products || !Array.isArray(products) || products.length === 0) {
        res.status(400).json({ success: false, error: "El pedido debe incluir al menos un producto." });
        return;
      }

      // 1. Obtener la lista de productos de la base de datos para cálculo Zero-Trust
      const productIds = products.map((p: any) => p.id);
      const dbProducts = await prisma.product.findMany({
        where: { id: { in: productIds } }
      });

      // 2. Sumar subtotales y construir snapshot estructurado
      let subtotal = 0;
      const productsJson: any[] = [];

      for (const item of products) {
        const dbProd = dbProducts.find((p) => p.id === item.id);
        if (!dbProd) {
          res.status(400).json({ success: false, error: `El producto con ID ${item.id} no existe en la base de datos.` });
          return;
        }
        subtotal += dbProd.price * item.quantity;
        productsJson.push({
          id: dbProd.id,
          name: dbProd.name,
          priceAtPurchase: dbProd.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor || null
        });
      }

      // 3. Recargo por despacho
      let deliFee = 0;
      if (deliveryType === "QUITO") {
        deliFee = 2.0;
      } else if (deliveryType === "PROVINCIAS") {
        deliFee = 7.0;
      }

      // 4. Validar cupón de descuento
      let discountAmount = 0;
      let couponToUpdate = null;

      if (couponCode) {
        const formattedCouponCode = couponCode.trim().toUpperCase();
        const coupon = await prisma.coupon.findUnique({
          where: { code: formattedCouponCode }
        });

        if (coupon && coupon.status === 1) {
          if (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit) {
            if (coupon.discountType === "PERCENTAGE") {
              discountAmount = subtotal * (coupon.discountValue / 100);
            } else if (coupon.discountType === "FIXED") {
              discountAmount = coupon.discountValue;
            }

            // Evitar que el descuento supere el subtotal
            if (discountAmount > subtotal) {
              discountAmount = subtotal;
            }
            couponToUpdate = coupon;
          } else {
            res.status(400).json({ success: false, error: "El cupón ha superado su límite de usos." });
            return;
          }
        } else if (couponCode.trim() !== "") {
          res.status(400).json({ success: false, error: "El cupón no es válido o está inactivo." });
          return;
        }
      }

      // 5. Validar empleado y comisión
      let calculatedCommission = 0;
      let employeeToUpdate = null;

      if (employeeCode) {
        const formattedEmployeeCode = employeeCode.trim().toUpperCase();
        const employee = await prisma.employee.findUnique({
          where: { code: formattedEmployeeCode }
        });

        if (employee && employee.status === 1) {
          // Comisión calculada sobre el subtotal neto de venta (subtotal - descuento)
          const netSubtotal = Math.max(0, subtotal - discountAmount);
          calculatedCommission = netSubtotal * (employee.commissionPercentage / 100);
          employeeToUpdate = employee;
        } else if (employeeCode.trim() !== "") {
          res.status(400).json({ success: false, error: "El código de empleado no es válido o está inactivo." });
          return;
        }
      }

      // 6. Total definitivo recalculado en backend (Zero-Trust)
      const finalTotalPrice = parseFloat((Math.max(0, subtotal - discountAmount) + deliFee).toFixed(2));
      const orderNumber = Math.floor(Math.random() * 900000) + 100000;

      // 7. Ejecutar de forma transaccional atómica
      const newOrder = await prisma.$transaction(async (tx) => {
        // A. Crear la orden
        const order = await tx.order.create({
          data: {
            orderNumber,
            customerId: customerId ? parseInt(customerId.toString(), 10) : 1,
            customerName: customerName || "Cliente Destiny",
            customerEmail: customerEmail || "cliente@destiny.com",
            customerPhone: customerPhone || "+593",
            shippingAddress: shippingAddress || "Dirección de despacho registrada",
            orderDate: new Date(),
            paymentType: paymentType || "CASH_ON_DELIVERY",
            deliveryType: deliveryType || "STORE_PICKUP",
            totalPrice: finalTotalPrice,
            deliveryDate: new Date(new Date().setDate(new Date().getDate() + 5)),
            products: productsJson,
            sendEmail: !!sendEmail,
            couponCode: couponToUpdate ? couponToUpdate.code : null,
            employeeCode: employeeToUpdate ? employeeToUpdate.code : null,
            employeeCommission: employeeToUpdate ? parseFloat(calculatedCommission.toFixed(2)) : null
          }
        });

        // B. Incrementar contador de cupón
        if (couponToUpdate) {
          const freshCoupon = await tx.coupon.findUnique({
            where: { id: couponToUpdate.id }
          });
          if (!freshCoupon || freshCoupon.status !== 1 || (freshCoupon.usageLimit !== null && freshCoupon.usedCount >= freshCoupon.usageLimit)) {
            throw new Error("El cupón ya no es válido o ha alcanzado su límite de usos.");
          }
          await tx.coupon.update({
            where: { id: couponToUpdate.id },
            data: { usedCount: { increment: 1 } }
          });
        }

        // C. Incrementar contador y comisiones de empleado
        if (employeeToUpdate) {
          await tx.employee.update({
            where: { id: employeeToUpdate.id },
            data: {
              totalSalesCount: { increment: 1 },
              totalCommissions: { increment: parseFloat(calculatedCommission.toFixed(2)) }
            }
          });
        }

        return order;
      });

      res.status(200).json({ success: true, data: newOrder });
    } catch (error: any) {
      console.error("Error creating order inside transaction:", error);
      res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
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
