import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const fashionLines = await prisma.fashionLine.findMany({
        where: { status: 1 },
        orderBy: { name: "asc" }
      });
      res.status(200).json({ data: fashionLines });
    } catch (error) {
      console.error("Error fetching fashion lines:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    if (!validateAdminApiKey(req, res)) return;

    try {
      const { name, tagline, imageUrl, link } = req.body;

      if (!name || !imageUrl || !link) {
        res.status(400).json({ success: false, error: "Los campos name, imageUrl y link son obligatorios." });
        return;
      }

      const normalizedName = name.trim();

      // Verificar si ya existe (incluyendo inactivas)
      const existing = await prisma.fashionLine.findUnique({
        where: { name: normalizedName }
      });

      if (existing) {
        if (existing.status === 0) {
          // Reactivar
          const reactivated = await prisma.fashionLine.update({
            where: { id: existing.id },
            data: { status: 1, tagline: tagline || existing.tagline, imageUrl, link }
          });
          res.status(200).json({ success: true, data: reactivated });
          return;
        } else {
          res.status(400).json({ success: false, error: "Ya existe una línea de moda activa con ese nombre." });
          return;
        }
      }

      const newFashionLine = await prisma.fashionLine.create({
        data: {
          name: normalizedName,
          tagline: tagline || null,
          imageUrl,
          link
        }
      });

      res.status(201).json({ success: true, data: newFashionLine });
    } catch (error) {
      console.error("Error creating fashion line:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
