import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "./auth";

/**
 * Valida que la petición provenga de un Administrador autenticado (JWT con rol ADMIN)
 * o que contenga la clave maestra de API (para compatibilidad de herramientas).
 */
export async function validateAdminApiKey(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  // 1. Intentar validar mediante Token JWT (requiere rol ADMIN)
  const decoded = await verifyToken(req);
  if (decoded && decoded.role === "ADMIN") {
    return true;
  }

  // 2. Fallback: Validar mediante clave API maestra
  const apiKeyHeader = req.headers["x-api-key"] || req.headers["authorization"];
  const masterKey = process.env.ADMIN_API_KEY || "destiny_admin_secret_key_2026";

  let cleanKey = apiKeyHeader;
  if (typeof apiKeyHeader === "string" && apiKeyHeader.startsWith("Bearer ")) {
    cleanKey = apiKeyHeader.substring(7);
  }

  if (cleanKey && cleanKey === masterKey) {
    return true;
  }

  res.status(401).json({ success: false, error: "No autorizado: Sesión administrativa inválida o clave de API incorrecta." });
  return false;
}

/**
 * Valida que la petición provenga de un Administrador o Vendedor autenticado
 * o que contenga la clave maestra de API (por ejemplo, para gestión de pedidos).
 */
export async function validateAdminOrVendedorApiKey(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  // 1. Intentar validar mediante Token JWT (rol ADMIN o VENDEDOR)
  const decoded = await verifyToken(req);
  if (decoded && (decoded.role === "ADMIN" || decoded.role === "VENDEDOR")) {
    return true;
  }

  // 2. Fallback: Validar mediante clave API maestra
  const apiKeyHeader = req.headers["x-api-key"] || req.headers["authorization"];
  const masterKey = process.env.ADMIN_API_KEY || "destiny_admin_secret_key_2026";

  let cleanKey = apiKeyHeader;
  if (typeof apiKeyHeader === "string" && apiKeyHeader.startsWith("Bearer ")) {
    cleanKey = apiKeyHeader.substring(7);
  }

  if (cleanKey && cleanKey === masterKey) {
    return true;
  }

  res.status(401).json({ success: false, error: "No autorizado: Sesión de panel inválida o clave de API incorrecta." });
  return false;
}
