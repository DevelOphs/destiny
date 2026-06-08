import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
    return;
  }

  try {
    // Verificar token del empleado
    const decoded = await verifyToken(req);
    if (!decoded) {
      res.status(401).json({ success: false, error: "No autorizado: Sesión inválida, expirada o cuenta inactiva." });
      return;
    }

    // Buscar la información más actualizada directamente en PostgreSQL
    const employee = await prisma.employee.findUnique({
      where: { id: decoded.id }
    });

    if (!employee || employee.status !== 1) {
      res.status(404).json({ success: false, error: "Empleado no encontrado o inactivo." });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        code: employee.code,
        commissionPercentage: employee.commissionPercentage,
        role: employee.role,
        totalSalesCount: employee.totalSalesCount,
        totalCommissions: employee.totalCommissions,
        createdAt: employee.createdAt
      }
    });
  } catch (error) {
    console.error("Error al obtener perfil del empleado:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor." });
  }
}
