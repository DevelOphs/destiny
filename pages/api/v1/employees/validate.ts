import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }

  const { code } = req.query;

  if (!code || typeof code !== "string") {
    res.status(400).json({ success: false, error: "El código de comisión es obligatorio." });
    return;
  }

  const formattedCode = code.trim().toUpperCase();

  try {
    const employee = await prisma.employee.findUnique({
      where: { code: formattedCode }
    });

    if (!employee) {
      res.status(200).json({ success: true, valid: false, error: "El código de empleado ingresado no existe." });
      return;
    }

    if (employee.status !== 1) {
      res.status(200).json({ success: true, valid: false, error: "El código de empleado ingresado está inactivo." });
      return;
    }

    res.status(200).json({
      success: true,
      valid: true,
      data: {
        name: employee.name,
        code: employee.code
      }
    });
  } catch (error) {
    console.error("Error validating employee code:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
