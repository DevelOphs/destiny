import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Si la petición viene del panel de administración con API Key válida,
      // retornamos todos los banners (activos e inactivos) para su gestión.
      const apiKey = req.headers["x-api-key"];
      const masterKey = process.env.ADMIN_API_KEY || "destiny_admin_secret_key_2026";
      const isAdmin = apiKey === masterKey;

      const whereClause = isAdmin ? {} : { status: 1 };

      const banners = await prisma.banner.findMany({
        where: whereClause,
        orderBy: { order: "asc" }
      });
      res.status(200).json({ data: banners });
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    if (!validateAdminApiKey(req, res)) return;

    try {
      const { title, subtitle, imageUrl, link, order, status } = req.body;

      if (!imageUrl) {
        res.status(400).json({ success: false, error: "La URL de la imagen del banner es obligatoria." });
        return;
      }

      const newBanner = await prisma.banner.create({
        data: {
          title: title || null,
          subtitle: subtitle || null,
          imageUrl,
          link: link || null,
          order: order ? parseInt(order.toString(), 10) : 0,
          status: status !== undefined ? parseInt(status.toString(), 10) : 1
        }
      });

      res.status(201).json({ success: true, data: newBanner });
    } catch (error) {
      console.error("Error creating banner:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
