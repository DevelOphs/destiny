import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const productId = parseInt(id as string, 10);

  if (isNaN(productId)) {
    res.status(400).json({ success: false, error: "Invalid product ID format" });
    return;
  }

  if (req.method === "GET") {
    try {
      const product = await prisma.product.findFirst({
        where: { id: productId, status: 1 },
        include: { category: true }
      });

      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }

      res.status(200).json({ data: product });
    } catch (error) {
      console.error("Error fetching single product from PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    // Proteger la mutación de datos con API Key en los headers
    if (!validateAdminApiKey(req, res)) return;

    try {
      const { name, price, detail, description, image1, image2, categoryName, categoryDescription } = req.body;

      const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!existingProduct) {
        res.status(404).json({ success: false, error: "Product not found to update" });
        return;
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (price !== undefined) updateData.price = parseFloat(price);
      if (detail !== undefined) updateData.detail = detail;
      if (description !== undefined) updateData.description = description;
      if (image1 !== undefined) updateData.image1 = image1;
      if (image2 !== undefined) updateData.image2 = image2;

      if (categoryName) {
        const category = await prisma.category.upsert({
          where: { name: categoryName.toLowerCase() },
          update: {},
          create: {
            name: categoryName.toLowerCase(),
            description: categoryDescription || "Categoría autogenerada"
          }
        });
        updateData.categoryId = category.id;
      }

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: updateData,
        include: { category: true }
      });

      res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
      console.error("Error updating product inside PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    // Proteger la mutación de datos con API Key en los headers
    if (!validateAdminApiKey(req, res)) return;

    try {
      const existingProduct = await prisma.product.findFirst({
        where: { id: productId, status: 1 }
      });

      if (!existingProduct) {
        res.status(404).json({ success: false, error: "Product not found to delete" });
        return;
      }

      await prisma.product.update({
        where: { id: productId },
        data: { status: 0 }
      });

      res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product from PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
