import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
    return;
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: "El correo electrónico y la contraseña son requeridos." });
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Buscar el empleado por email
    const employee = await prisma.employee.findUnique({
      where: { email: trimmedEmail }
    });

    if (!employee || employee.status !== 1) {
      res.status(401).json({ success: false, error: "Credenciales inválidas o cuenta inactiva." });
      return;
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, employee.passwordHash);
    if (!passwordMatch) {
      res.status(401).json({ success: false, error: "Credenciales inválidas." });
      return;
    }

    // Generar el Token JWT
    const jwtSecret = process.env.JWT_SECRET || "destiny_jwt_secret_key_2026";
    const token = jwt.sign(
      {
        id: employee.id,
        email: employee.email,
        name: employee.name,
        role: employee.role,
        code: employee.code
      },
      jwtSecret,
      { expiresIn: "1d" } // Válido por 1 día
    );

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso.",
      token,
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        code: employee.code
      }
    });
  } catch (error) {
    console.error("Login API error:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor." });
  }
}
