import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { validateAdminApiKey } from "@/lib/security";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { order_by, offset, limit, category } = req.query;

      // 1. Auto-siembra (Seeding) incremental si algún producto no existe
      try {
        const { productsDb } = await import("../db");
        for (const item of productsDb) {
          const existing = await prisma.product.findUnique({
            where: { id: item.id }
          });
          
          if (!existing) {
            const cat = await prisma.category.upsert({
              where: { name: item.category.name.toLowerCase() },
              update: {},
              create: {
                name: item.category.name.toLowerCase(),
                description: item.category.description
              }
            });

            await prisma.product.create({
              data: {
                id: item.id,
                name: item.name,
                price: item.price,
                detail: item.detail,
                description: item.description,
                image1: item.image1,
                image2: item.image2,
                categoryId: cat.id,
                colors: item.colors,
                createdAt: new Date(item.createdAt)
              }
            });
          }
        }
      } catch (seedError) {
        console.error("Error seeding products database:", seedError);
      }

      // 2. Construcción de filtros
      const where: any = { status: 1 };
      if (category) {
        where.category = {
          name: {
            equals: category as string,
            mode: "insensitive"
          },
          status: 1
        };
      }

      // 3. Construcción de ordenación
      let orderBy: any = { createdAt: "desc" };
      if (order_by === "price") {
        orderBy = { price: "asc" };
      } else if (order_by === "price.desc" || order_by === "price-desc") {
        orderBy = { price: "desc" };
      }

      // 4. Paginación
      const skip = offset ? parseInt(offset as string, 10) : 0;
      const take = limit ? parseInt(limit as string, 10) : 10;

      // 5. Consulta a PostgreSQL
      const products = await prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: true
        }
      });

      res.status(200).json({ data: products });
    } catch (error) {
      console.error("Error fetching products from PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    // Proteger estrictamente la mutación de datos con la API Key en los headers
    if (!validateAdminApiKey(req, res)) return;

    try {
      const { name, price, detail, description, image1, image2, categoryName, categoryDescription, colors } = req.body;

      if (!name || !price || !detail || !categoryName) {
        res.status(400).json({ success: false, error: "Missing required fields (name, price, detail, categoryName)" });
        return;
      }

      // Crear o retornar la categoría correspondiente
      const category = await prisma.category.upsert({
        where: { name: categoryName.toLowerCase() },
        update: {},
        create: {
          name: categoryName.toLowerCase(),
          description: categoryDescription || "Categoría autogenerada"
        }
      });

      // Crear el nuevo producto en PostgreSQL
      const newProduct = await prisma.product.create({
        data: {
          name,
          price: parseFloat(price),
          detail,
          description: description || detail,
          image1: image1 || "/bg-img/logo_scorpion.png",
          image2: image2 || image1 || "/bg-img/logo_scorpion.png",
          categoryId: category.id,
          colors: colors || []
        },
        include: {
          category: true
        }
      });

      res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
      console.error("Error creating product inside PostgreSQL:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
