import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export interface DecodedToken {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "VENDEDOR";
  code: string;
}

export function getAuthToken(req: NextApiRequest): string | null {
  // 1. Check Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // 2. Fallback to x-api-key header for backward compatibility
  const apiKeyHeader = req.headers["x-api-key"];
  if (typeof apiKeyHeader === "string" && apiKeyHeader.trim() !== "") {
    return apiKeyHeader.trim();
  }

  return null;
}

export function decodeJwtPayload(token: string): DecodedToken | null {
  try {
    const secret = process.env.JWT_SECRET || "destiny_jwt_secret_key_2026";
    return jwt.verify(token, secret) as DecodedToken;
  } catch (error) {
    return null;
  }
}

/**
 * Zero-Trust verification: decodes the token and checks the database
 * to ensure the user still exists and status is active (1).
 */
export async function verifyToken(req: NextApiRequest): Promise<DecodedToken | null> {
  const token = getAuthToken(req);
  if (!token) return null;

  const decoded = decodeJwtPayload(token);
  if (!decoded) return null;

  try {
    const dbEmployee = await prisma.employee.findUnique({
      where: { id: decoded.id }
    });

    if (!dbEmployee || dbEmployee.status !== 1) {
      return null;
    }

    return {
      id: dbEmployee.id,
      email: dbEmployee.email,
      name: dbEmployee.name,
      role: dbEmployee.role as "ADMIN" | "VENDEDOR",
      code: dbEmployee.code
    };
  } catch (error) {
    console.error("Zero-Trust DB verification error:", error);
    return null;
  }
}

/**
 * Enforces role checking. Returns the decoded token payload on success,
 * or writes an appropriate HTTP response and returns null on failure.
 */
export async function requireRole(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedRoles: ("ADMIN" | "VENDEDOR")[]
): Promise<DecodedToken | null> {
  const decoded = await verifyToken(req);
  if (!decoded) {
    res.status(401).json({ success: false, error: "No autorizado: Sesión inválida, expirada o cuenta desactivada." });
    return null;
  }

  if (!allowedRoles.includes(decoded.role)) {
    res.status(403).json({ success: false, error: "Acceso denegado: Permisos insuficientes." });
    return null;
  }

  return decoded;
}

/**
 * Helper to require exclusively the "ADMIN" role.
 */
export async function verifyAdminToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<DecodedToken | null> {
  return requireRole(req, res, ["ADMIN"]);
}
