import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!validateAdminApiKey(req, res)) return;

  if (req.method === "GET") {
    try {
      const employees = await prisma.employee.findMany({
        orderBy: { createdAt: "desc" }
      });
      res.status(200).json({ success: true, data: employees });
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, code, commissionPercentage } = req.body;

      if (!name || !code) {
        res.status(400).json({ success: false, error: "Los campos name y code son obligatorios." });
        return;
      }

      const formattedCode = code.trim().toUpperCase();

      // Verificar unicidad de código
      const existing = await prisma.employee.findUnique({
        where: { code: formattedCode }
      });

      if (existing) {
        res.status(400).json({ success: false, error: "Ya existe un empleado registrado con ese código." });
        return;
      }

      const newEmployee = await prisma.employee.create({
        data: {
          name: name.trim(),
          code: formattedCode,
          commissionPercentage: commissionPercentage ? parseFloat(commissionPercentage.toString()) : 5.0,
          totalSalesCount: 0,
          totalCommissions: 0.0,
          status: 1
        }
      });

      res.status(201).json({ success: true, data: newEmployee });
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
