import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { name, email, phone, subject, message } = req.body;

      if (!name || !email || !message) {
        res.status(400).json({ success: false, error: "Missing required fields" });
        return;
      }

      // Crear la consulta de forma persistente en PostgreSQL
      const newContact = await prisma.contact.create({
        data: {
          name,
          email,
          phone: phone || "",
          subject: subject || "Consulta General",
          message,
          createdAt: new Date(),
        },
      });

      res.status(200).json({ success: true, message: "Contact recorded successfully", data: newContact });
    } catch (error) {
      console.error("Error saving contact inside PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    // Proteger estrictamente la lectura de consultas administrativas con API Key
    if (!await validateAdminApiKey(req, res)) return;

    try {
      const contacts = await prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json({ success: true, data: contacts });
    } catch (error) {
      console.error("Error fetching contact queries from PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
