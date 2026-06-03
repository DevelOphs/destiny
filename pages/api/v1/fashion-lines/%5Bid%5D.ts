import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const fashionLineId = parseInt(id as string, 10);

  if (isNaN(fashionLineId)) {
    res.status(400).json({ success: false, error: "Formato de ID de línea de moda inválido." });
    return;
  }

  if (req.method === "PUT") {
    if (!validateAdminApiKey(req, res)) return;

    try {
      const { name, tagline, imageUrl, link, status } = req.body;

      const existing = await prisma.fashionLine.findUnique({
        where: { id: fashionLineId }
      });

      if (!existing) {
        res.status(404).json({ success: false, error: "Línea de moda no encontrada." });
        return;
      }

      const updateData: any = {};
      if (name !== undefined) {
        const normalizedName = name.trim();
        if (normalizedName !== existing.name) {
          const conflict = await prisma.fashionLine.findUnique({
            where: { name: normalizedName }
          });
          if (conflict && conflict.status === 1) {
            res.status(400).json({ success: false, error: "Ya existe otra línea de moda activa con ese nombre." });
            return;
          }
        }
        updateData.name = normalizedName;
      }
      if (tagline !== undefined) updateData.tagline = tagline || null;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (link !== undefined) updateData.link = link;
      if (status !== undefined) updateData.status = parseInt(status.toString(), 10);

      const updated = await prisma.fashionLine.update({
        where: { id: fashionLineId },
        data: updateData
      });

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("Error updating fashion line:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    if (!validateAdminApiKey(req, res)) return;

    try {
      const existing = await prisma.fashionLine.findUnique({
        where: { id: fashionLineId }
      });

      if (!existing) {
        res.status(404).json({ success: false, error: "Línea de moda no encontrada." });
        return;
      }

      // Hard delete: eliminar físicamente la línea de moda de la base de datos
      await prisma.fashionLine.delete({
        where: { id: fashionLineId }
      });

      res.status(200).json({ success: true, message: "Línea de moda eliminada con éxito." });
    } catch (error) {
      console.error("Error deleting fashion line:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
