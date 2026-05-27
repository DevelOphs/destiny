import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Proteger estrictamente todas las acciones individuales de consulta de contacto con API Key
  if (!validateAdminApiKey(req, res)) return;

  const { id } = req.query;
  const contactId = parseInt(id as string, 10);

  if (isNaN(contactId)) {
    res.status(400).json({ success: false, error: "Invalid contact ID format" });
    return;
  }

  if (req.method === "DELETE") {
    try {
      const existingContact = await prisma.contact.findUnique({
        where: { id: contactId },
      });

      if (!existingContact) {
        res.status(404).json({ success: false, error: "Contact inquiry not found to delete" });
        return;
      }

      await prisma.contact.delete({
        where: { id: contactId },
      });

      res.status(200).json({ success: true, message: "Contact inquiry deleted successfully" });
    } catch (error) {
      console.error("Error deleting contact inquiry from PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
