import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Valida la clave API administrativa en los headers de la petición para proteger las mutaciones de datos (POST, PUT, DELETE)
 * y rutas de consulta privada (GET de pedidos y consultas).
 * Retorna true si es válida, o escribe un 401 Unauthorized y retorna false.
 */
export function validateAdminApiKey(req: NextApiRequest, res: NextApiResponse): boolean {
  const apiKey = req.headers["x-api-key"];
  const masterKey = process.env.ADMIN_API_KEY || "destiny_admin_secret_key_2026";

  if (!apiKey || apiKey !== masterKey) {
    res.status(401).json({ success: false, error: "Unauthorized: Invalid or missing API Key in X-API-KEY header." });
    return false;
  }
  return true;
}
