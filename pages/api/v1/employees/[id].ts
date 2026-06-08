import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!await validateAdminApiKey(req, res)) return;

  const { id } = req.query;
  const employeeId = parseInt(id as string, 10);

  if (isNaN(employeeId)) {
    res.status(400).json({ success: false, error: "ID de empleado inválido." });
    return;
  }

  if (req.method === "PUT") {
    try {
      const { name, code, commissionPercentage, status, email, role, password } = req.body;

      const currentEmployee = await prisma.employee.findUnique({
        where: { id: employeeId }
      });

      if (!currentEmployee) {
        res.status(404).json({ success: false, error: "Empleado no encontrado." });
        return;
      }

      const updateData: any = {};
      if (name) {
        updateData.name = name.trim();
      }

      if (code) {
        const formattedCode = code.trim().toUpperCase();
        if (formattedCode !== currentEmployee.code) {
          // Verificar si el nuevo código ya está tomado
          const existing = await prisma.employee.findUnique({
            where: { code: formattedCode }
          });
          if (existing) {
            res.status(400).json({ success: false, error: "Ese código de comisión ya está en uso." });
            return;
          }
        }
        updateData.code = formattedCode;
      }

      if (commissionPercentage !== undefined) {
        updateData.commissionPercentage = parseFloat(commissionPercentage.toString());
      }

      if (status !== undefined) {
        updateData.status = parseInt(status.toString(), 10);
      }

      if (email) {
        const formattedEmail = email.trim().toLowerCase();
        if (formattedEmail !== currentEmployee.email) {
          if (!formattedEmail.includes("@")) {
            res.status(400).json({ success: false, error: "El formato de correo es inválido." });
            return;
          }
          const existingEmail = await prisma.employee.findUnique({
            where: { email: formattedEmail }
          });
          if (existingEmail) {
            res.status(400).json({ success: false, error: "Ese correo electrónico ya está en uso." });
            return;
          }
        }
        updateData.email = formattedEmail;
      }

      if (role) {
        if (role !== "ADMIN" && role !== "VENDEDOR") {
          res.status(400).json({ success: false, error: "Rol inválido. Debe ser ADMIN o VENDEDOR." });
          return;
        }
        updateData.role = role;
      }

      if (password && password.trim() !== "") {
        updateData.passwordHash = await bcrypt.hash(password, 10);
      }

      const updatedEmployee = await prisma.employee.update({
        where: { id: employeeId },
        data: updateData
      });

      res.status(200).json({ success: true, data: updatedEmployee });
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    try {
      // Directiva innegociable: DELETE debe ejecutar estrictamente un borrado lógico (status = 0)
      const existing = await prisma.employee.findUnique({
        where: { id: employeeId }
      });

      if (!existing) {
        res.status(404).json({ success: false, error: "Empleado no encontrado." });
        return;
      }

      const deletedEmployee = await prisma.employee.update({
        where: { id: employeeId },
        data: { status: 0 } // Borrado lógico
      });

      res.status(200).json({ success: true, message: "Empleado eliminado lógicamente.", data: deletedEmployee });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
