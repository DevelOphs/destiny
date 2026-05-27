import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const categoryId = parseInt(id as string, 10);

  if (isNaN(categoryId)) {
    res.status(400).json({ success: false, error: "Formato de ID de categoría inválido." });
    return;
  }

  if (req.method === "PUT") {
    if (!validateAdminApiKey(req, res)) return;

    try {
      const { name, description } = req.body;

      const existingCategory = await prisma.category.findFirst({
        where: { id: categoryId, status: 1 }
      });

      if (!existingCategory) {
        res.status(404).json({ success: false, error: "Categoría no encontrada o inactiva." });
        return;
      }

      const updateData: any = {};
      if (name !== undefined) {
        const normalizedName = name.toLowerCase().trim();
        // Verificar conflicto de nombre único
        if (normalizedName !== existingCategory.name) {
          const nameConflict = await prisma.category.findUnique({
            where: { name: normalizedName }
          });
          if (nameConflict && nameConflict.status === 1) {
            res.status(400).json({ success: false, error: "Ya existe otra categoría activa con ese nombre." });
            return;
          }
        }
        updateData.name = normalizedName;
      }
      if (description !== undefined) updateData.description = description;

      const updated = await prisma.category.update({
        where: { id: categoryId },
        data: updateData
      });

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    if (!validateAdminApiKey(req, res)) return;

    try {
      const existingCategory = await prisma.category.findFirst({
        where: { id: categoryId, status: 1 }
      });

      if (!existingCategory) {
        res.status(404).json({ success: false, error: "Categoría no encontrada o ya eliminada." });
        return;
      }

      // Soft delete: cambiar status a 0
      await prisma.category.update({
        where: { id: categoryId },
        data: { status: 0 }
      });

      res.status(200).json({ success: true, message: "Categoría eliminada lógicamente con éxito." });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
