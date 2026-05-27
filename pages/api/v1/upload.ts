import type { NextApiRequest, NextApiResponse } from "next";
import { validateAdminApiKey } from "@/lib/security";
import fs from "fs";
import path from "path";

// Desactivar el parseador de body por defecto de Next.js si se mandaran streams gigantes,
// pero como usaremos JSON estándar con Base64, el bodyParser estándar de Next.js
// soporta hasta 1MB por defecto. Para soportar imágenes de alta resolución (hasta 10MB),
// expandiremos el límite del body parser en la configuración de la ruta.
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }

  // Validar credenciales de administrador de forma estricta (Regla 13)
  if (!validateAdminApiKey(req, res)) return;

  try {
    const { base64Data, filename } = req.body;

    if (!base64Data || !filename) {
      res.status(400).json({ success: false, error: "Datos incompletos. Se requiere base64Data y filename." });
      return;
    }

    // 1. Validar formato/extensión a partir del encabezado Base64
    const matches = base64Data.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ success: false, error: "Formato de imagen inválido. Asegúrese de subir un archivo de imagen." });
      return;
    }

    const imageExtension = matches[1].toLowerCase();
    const rawData = matches[2];

    const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
    if (!allowedExtensions.includes(imageExtension)) {
      res.status(400).json({ success: false, error: `Formato no permitido: .${imageExtension}. Use únicamente PNG, JPG, JPEG o WEBP.` });
      return;
    }

    // 2. Definir la ruta de almacenamiento local (public/uploads)
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Crear la carpeta dinámicamente si no existe
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generar un nombre único para evitar colisiones
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.]/g, "_");
    const uniqueFilename = `${Date.now()}_${cleanFilename}`;
    const filePath = path.join(uploadsDir, uniqueFilename);

    // 3. Decodificar la imagen y escribirla en disco
    const buffer = Buffer.from(rawData, "base64");
    fs.writeFileSync(filePath, new Uint8Array(buffer));

    // Retornar la URL relativa pública para el navegador
    const relativeUrl = `/uploads/${uniqueFilename}`;

    res.status(200).json({
      success: true,
      url: relativeUrl,
      message: "Imagen subida y guardada localmente con éxito."
    });
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor al procesar la imagen." });
  }
}
