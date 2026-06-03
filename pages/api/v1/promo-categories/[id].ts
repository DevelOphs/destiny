import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const promoCategoryId = parseInt(id as string, 10);

  if (isNaN(promoCategoryId)) {
    res.status(400).json({ success: false, error: "Formato de ID de categoría promocional inválido." });
    return;
  }

  if (req.method === "PUT") {
    if (!validateAdminApiKey(req, res)) return;

    try {
      const { title, imageUrl, imageUrlTablet, link, status } = req.body;

      const existing = await prisma.promoCategory.findUnique({
        where: { id: promoCategoryId }
      });

      if (!existing) {
        res.status(404).json({ success: false, error: "Categoría promocional no encontrada." });
        return;
      }

      const updateData: any = {};
      if (title !== undefined) {
        const normalizedTitle = title.trim();
        if (normalizedTitle !== existing.title) {
          const conflict = await prisma.promoCategory.findUnique({
            where: { title: normalizedTitle }
          });
          if (conflict) {
            res.status(400).json({ success: false, error: "Ya existe otra categoría promocional con ese título." });
            return;
          }
        }
        updateData.title = normalizedTitle;
      }
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
      if (imageUrlTablet !== undefined) updateData.imageUrlTablet = imageUrlTablet ? imageUrlTablet.trim() : null;
      if (link !== undefined) updateData.link = link.trim();
      if (status !== undefined) updateData.status = parseInt(status.toString(), 10);

      const updated = await prisma.promoCategory.update({
        where: { id: promoCategoryId },
        data: updateData
      });

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("Error updating promo category:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    if (!validateAdminApiKey(req, res)) return;

    try {
      const existing = await prisma.promoCategory.findUnique({
        where: { id: promoCategoryId }
      });

      if (!existing) {
        res.status(404).json({ success: false, error: "Categoría promocional no encontrada." });
        return;
      }

      // Borrado físico de la categoría promocional
      await prisma.promoCategory.delete({
        where: { id: promoCategoryId }
      });

      res.status(200).json({ success: true, message: "Categoría promocional eliminada con éxito." });
    } catch (error) {
      console.error("Error deleting promo category:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
