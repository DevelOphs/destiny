import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Obtener todas las categorías activas (status: 1)
      const categories = await prisma.category.findMany({
        where: { status: 1 },
        orderBy: { name: "asc" }
      });

      res.status(200).json({ data: categories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    if (!await validateAdminApiKey(req, res)) return;

    try {
      const { name, description } = req.body;

      if (!name) {
        res.status(400).json({ success: false, error: "El nombre de la categoría es requerido." });
        return;
      }

      const normalizedName = name.toLowerCase().trim();

      // Verificar si ya existe (incluyendo inactivas)
      const existing = await prisma.category.findUnique({
        where: { name: normalizedName }
      });

      if (existing) {
        if (existing.status === 0) {
          // Reactivar categoría eliminada lógicamente
          const reactivated = await prisma.category.update({
            where: { id: existing.id },
            data: { status: 1, description: description || existing.description }
          });
          res.status(200).json({ success: true, data: reactivated });
          return;
        } else {
          res.status(400).json({ success: false, error: "Ya existe una categoría activa con ese nombre." });
          return;
        }
      }

      const newCategory = await prisma.category.create({
        data: {
          name: normalizedName,
          description: description || ""
        }
      });

      res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
