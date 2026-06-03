import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Retornar todas las categorías promocionales ordenadas por ID
      let promoCategories = await prisma.promoCategory.findMany({
        orderBy: { id: "asc" }
      });

      // Si no hay ninguna categoría promocional, autogeneramos las por defecto
      if (promoCategories.length === 0) {
        await prisma.promoCategory.createMany({
          data: [
            { id: 1, title: "Última Confección", imageUrl: "/bg-img/banner_minipage1.jpg", imageUrlTablet: "/bg-img/banner_minipage1-tablet.jpg", link: "/product-category/new-arrivals", status: 1 },
            { id: 2, title: "Línea Corporativa Femenina", imageUrl: "/bg-img/banner_minipage2.jpg", imageUrlTablet: null, link: "/product-category/women", status: 1 },
            { id: 3, title: "Línea Corporativa Masculina", imageUrl: "/bg-img/banner_minipage3.jpg", imageUrlTablet: null, link: "/product-category/men", status: 1 }
          ]
        });
        promoCategories = await prisma.promoCategory.findMany({
          orderBy: { id: "asc" }
        });
      }

      res.status(200).json({ data: promoCategories });
    } catch (error) {
      console.error("Error fetching promo categories:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    if (!validateAdminApiKey(req, res)) return;

    try {
      const { title, imageUrl, imageUrlTablet, link } = req.body;

      if (!title || !imageUrl || !link) {
        res.status(400).json({ success: false, error: "Los campos title, imageUrl y link son obligatorios." });
        return;
      }

      const normalizedTitle = title.trim();

      // Verificar si ya existe una categoría promocional con ese título
      const existing = await prisma.promoCategory.findUnique({
        where: { title: normalizedTitle }
      });

      if (existing) {
        res.status(400).json({ success: false, error: "Ya existe una categoría promocional con ese título." });
        return;
      }

      const newPromoCategory = await prisma.promoCategory.create({
        data: {
          title: normalizedTitle,
          imageUrl: imageUrl.trim(),
          imageUrlTablet: imageUrlTablet ? imageUrlTablet.trim() : null,
          link: link.trim()
        }
      });

      res.status(201).json({ success: true, data: newPromoCategory });
    } catch (error) {
      console.error("Error creating promo category:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
