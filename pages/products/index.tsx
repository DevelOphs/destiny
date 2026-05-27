import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import axios from "axios";
import { useTranslations } from "next-intl";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Card/Card";
import { apiProductsType, itemType } from "../../context/cart/cart-types";
import LinkButton from "../../components/Buttons/LinkButton";

type ExtendedItemType = itemType & {
  categoryName?: string;
};

type Props = {
  products: ExtendedItemType[];
};

const ProductsCatalog: React.FC<Props> = ({ products }) => {
  const t = useTranslations("Category");
  
  // Filter States
  const [filteredProducts, setFilteredProducts] = useState<ExtendedItemType[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [sortBy, setSortBy] = useState<string>("latest");

  // Dynamic filter execution on client browser
  useEffect(() => {
    let result = [...products];

    // 1. Filter by Category
    if (selectedCategory !== "all") {
      result = result.filter((item) => item.categoryName === selectedCategory);
    }

    // 2. Filter by Max Price
    result = result.filter((item) => item.price <= maxPrice);

    // 3. Sort products
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Default: Sort by newest id desc
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(result);
  }, [selectedCategory, maxPrice, sortBy, products]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setMaxPrice(300);
    setSortBy("latest");
  };

  return (
    <div className="bg-white font-sans text-gray500">
      {/* ===== Header Navigation ===== */}
      <Header title="Catálogo de Productos - Destiny" />

      <main id="main-content">
        
        {/* ===== Title Banner ===== */}
        <div className="bg-lightnavy border-t border-b border-gray100 py-10">
          <div className="app-max-width app-x-padding">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-navy tracking-wider uppercase text-center md:text-left">
              Catálogo General
            </h1>
            <p className="text-gray400 text-sm mt-1 text-center md:text-left">
              Explora nuestra colección textil de alta confección y equipos de seguridad táctica.
            </p>
          </div>
        </div>

        {/* ===== Two-Column Catalog Area ===== */}
        <div className="app-max-width app-x-padding py-12 flex flex-col lg:flex-row gap-10">
          
          {/* 1. Left Sidebar Filter (Altamente estilizada) */}
          <aside className="w-full lg:w-3/12 flex-none bg-white p-6 border border-gray200 shadow-sm rounded-sm self-start">
            <div className="flex justify-between items-center border-b border-gray200 pb-3 mb-6">
              <h3 className="text-base font-bold font-serif text-navy tracking-wide uppercase">
                {t("filter_by")}
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-blue hover:text-navy transition-colors duration-200 uppercase tracking-widest"
              >
                Limpiar Todo
              </button>
            </div>

            {/* Category selection */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Línea de Confección</h4>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left py-2 px-3 text-sm rounded-sm transition-all duration-200 ${
                    selectedCategory === "all"
                      ? "bg-navy text-white font-bold"
                      : "bg-lightnavy text-navy font-semibold hover:bg-gray100"
                  }`}
                >
                  Todas las Líneas
                </button>
                <button
                  onClick={() => setSelectedCategory("men")}
                  className={`w-full text-left py-2 px-3 text-sm rounded-sm transition-all duration-200 ${
                    selectedCategory === "men"
                      ? "bg-navy text-white font-bold"
                      : "bg-lightnavy text-navy font-semibold hover:bg-gray100"
                  }`}
                >
                  Línea Masculina
                </button>
                <button
                  onClick={() => setSelectedCategory("women")}
                  className={`w-full text-left py-2 px-3 text-sm rounded-sm transition-all duration-200 ${
                    selectedCategory === "women"
                      ? "bg-navy text-white font-bold"
                      : "bg-lightnavy text-navy font-semibold hover:bg-gray100"
                  }`}
                >
                  Línea Femenina
                </button>
                <button
                  onClick={() => setSelectedCategory("bags")}
                  className={`w-full text-left py-2 px-3 text-sm rounded-sm transition-all duration-200 ${
                    selectedCategory === "bags"
                      ? "bg-navy text-white font-bold"
                      : "bg-lightnavy text-navy font-semibold hover:bg-gray100"
                  }`}
                >
                  Táctico & Seguridad
                </button>
              </div>
            </div>

            {/* Price slider */}
            <div className="mb-8 border-t border-gray100 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Precio Máximo</h4>
                <span className="text-sm font-bold text-navy font-serif">${maxPrice} USD</span>
              </div>
              <input
                type="range"
                min="10"
                max="300"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray200 rounded-lg appearance-none cursor-pointer focus:outline-none accent-navy"
              />
              <div className="flex justify-between text-[10px] text-gray400 mt-2 font-semibold">
                <span>$10 USD</span>
                <span>$300 USD</span>
              </div>
            </div>

            {/* Sort order */}
            <div className="border-t border-gray100 pt-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ordenar por</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray300 focus:border-blue outline-none text-sm bg-white cursor-pointer"
              >
                <option value="latest">Más Reciente</option>
                <option value="price-low">Precio: menor a mayor</option>
                <option value="price-high">Precio: mayor a menor</option>
              </select>
            </div>
          </aside>

          {/* 2. Right Side: Product Results grid */}
          <div className="w-full lg:w-9/12">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray100 text-sm">
              <span className="text-gray400 font-medium">
                Mostrando {filteredProducts.length} de {products.length} productos
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                {filteredProducts.map((item) => (
                  <Card key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-lightnavy border border-gray200 rounded-sm">
                <svg className="w-12 h-12 mx-auto text-gray400 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18H15a2.25 2.25 0 002.25-2.25V8.25A2.25 2.25 0 0015 6H4.5A2.25 2.25 0 002.25 8.25v7.5A2.25 2.25 0 004.5 18z" />
                </svg>
                <h3 className="text-lg font-bold font-serif text-navy">Sin Coincidencias</h3>
                <p className="text-sm text-gray400 mt-2 px-6">
                  Intente ajustar el rango de precios o cambiar de categoría para encontrar sus productos.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 bg-navy text-white py-2 px-6 hover:bg-blue transition-colors duration-200 text-xs font-semibold uppercase tracking-wider rounded-sm"
                >
                  Restaurar Filtros
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let products: ExtendedItemType[] = [];
  try {
    const prisma = (await import("@/lib/prisma")).default;

    // Obtener todos los productos activos (status: 1)
    const dbProducts = await prisma.product.findMany({
      where: { status: 1 },
      orderBy: { createdAt: "desc" },
      include: { category: true }
    });

    products = dbProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      img1: p.image1,
      img2: p.image2,
      categoryName: p.category?.name || "men",
    }));
  } catch (error) {
    console.error("Error fetching products in catalog", error);
  }

  return {
    props: {
      messages: (await import(`../../messages/common/${locale || "es"}.json`)).default,
      products,
    },
    revalidate: 60, // Habilitar Incremental Static Regeneration (ISR)
  };
};

export default ProductsCatalog;
