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

      let banners = await prisma.banner.findMany({
        where: whereClause,
        orderBy: { order: "asc" }
      });

      // Si no hay ningún banner en la base de datos, autogeneramos los por defecto
      if (banners.length === 0) {
        await prisma.banner.createMany({
          data: [
            { id: 1, title: "Colección Editorial Destiny", subtitle: "Moda que te define", imageUrl: "/bg-img/destiny_hero_banner.png", link: "/product-category/new-arrivals", order: 1, status: 1 },
            { id: 2, title: "Colección Militar Táctico", subtitle: "Rendimiento y Resistencia", imageUrl: "/bg-img/tactical_model.png", link: "/product-category/bags", order: 2, status: 1 },
            { id: 3, title: "Equipamiento de Seguridad y Policial", subtitle: "Protección Profesional", imageUrl: "/bg-img/police_model.png", link: "/product-category/men", order: 3, status: 1 },
            { id: 4, title: "Colección Formal y Blazer Ejecutivo", subtitle: "Elegancia Corporativa", imageUrl: "/bg-img/elegant_model.png", link: "/product-category/men", order: 4, status: 1 },
            { id: 5, title: "Chaqueta Cortaviento Dama Softshell", subtitle: "Estilo & Versatilidad", imageUrl: "/bg-img/female_model.png", link: "/product-category/women", order: 5, status: 1 },
            { id: 6, title: "Hoodie Buzo Casual Beige", subtitle: "Confort Diario", imageUrl: "/bg-img/casual_model.png", link: "/product-category/men", order: 6, status: 1 }
          ]
        });
        banners = await prisma.banner.findMany({
          where: whereClause,
          orderBy: { order: "asc" }
        });
      }

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
