import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const bannerId = parseInt(id as string, 10);

  if (isNaN(bannerId)) {
    res.status(400).json({ success: false, error: "Formato de ID de banner inválido." });
    return;
  }

  if (req.method === "PUT") {
    if (!await validateAdminApiKey(req, res)) return;

    try {
      const { title, subtitle, imageUrl, link, order, status } = req.body;

      const existing = await prisma.banner.findUnique({
        where: { id: bannerId }
      });

      if (!existing) {
        res.status(404).json({ success: false, error: "Banner no encontrado." });
        return;
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title || null;
      if (subtitle !== undefined) updateData.subtitle = subtitle || null;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (link !== undefined) updateData.link = link || null;
      if (order !== undefined) updateData.order = parseInt(order.toString(), 10);
      if (status !== undefined) updateData.status = parseInt(status.toString(), 10);

      const updated = await prisma.banner.update({
        where: { id: bannerId },
        data: updateData
      });

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("Error updating banner:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    if (!await validateAdminApiKey(req, res)) return;

    try {
      const existing = await prisma.banner.findUnique({
        where: { id: bannerId }
      });

      if (!existing) {
        res.status(404).json({ success: false, error: "Banner no encontrado." });
        return;
      }

      // Hard delete: eliminar físicamente el banner de la base de datos
      await prisma.banner.delete({
        where: { id: bannerId }
      });

      res.status(200).json({ success: true, message: "Banner eliminado permanentemente con éxito." });
    } catch (error) {
      console.error("Error deleting banner:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
