import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!await validateAdminApiKey(req, res)) return;

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
      const { name, code, commissionPercentage, email, password, role } = req.body;

      if (!name || !code || !email || !password) {
        res.status(400).json({ success: false, error: "Los campos name, code, email y password son obligatorios." });
        return;
      }

      const formattedCode = code.trim().toUpperCase();
      const formattedEmail = email.trim().toLowerCase();

      if (!formattedEmail.includes("@")) {
        res.status(400).json({ success: false, error: "El formato de correo electrónico no es válido." });
        return;
      }

      const assignedRole = role === "ADMIN" ? "ADMIN" : "VENDEDOR";

      // Verificar unicidad de código
      const existingCode = await prisma.employee.findUnique({
        where: { code: formattedCode }
      });

      if (existingCode) {
        res.status(400).json({ success: false, error: "Ya existe un empleado registrado con ese código de comisión." });
        return;
      }

      // Verificar unicidad de email
      const existingEmail = await prisma.employee.findUnique({
        where: { email: formattedEmail }
      });

      if (existingEmail) {
        res.status(400).json({ success: false, error: "Ya existe un empleado registrado con ese correo." });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newEmployee = await prisma.employee.create({
        data: {
          name: name.trim(),
          email: formattedEmail,
          passwordHash,
          code: formattedCode,
          commissionPercentage: commissionPercentage ? parseFloat(commissionPercentage.toString()) : 5.0,
          role: assignedRole,
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
