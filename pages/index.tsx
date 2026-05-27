import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import axios from "axios";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Card from "../components/Card/Card";
import { apiProductsType, itemType } from "../context/cart/cart-types";
import LinkButton from "../components/Buttons/LinkButton";
import OverlayContainer from "../components/OverlayContainer/OverlayContainer";

type Props = {
  products: itemType[];
  banners: any[];
  fashionLines: any[];
};

const Home: React.FC<Props> = ({ products, banners = [], fashionLines = [] }) => {
  const t = useTranslations("Index");
  const [currentItems, setCurrentItems] = useState(products);
  const [isFetching, setIsFetching] = useState(false);

  // Selector de iconos SVG dinámicos para las líneas de moda
  const getFashionLineIcon = (name: string) => {
    const normalized = name.toLowerCase();
    if (normalized.includes("casual")) {
      return (
        <svg className="w-8 h-8 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5l-3.5 2L7 11v6a1.5 1.5 0 001.5 1.5h7a1.5 1.5 0 001.5-1.5v-6l-1.5-4.5-3.5-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.5A3 3 0 0012 9.5a3 3 0 003-3" />
        </svg>
      );
    }
    if (normalized.includes("noche") || normalized.includes("elegante")) {
      return (
        <svg className="w-8 h-8 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a2 2 0 012 2c0 .85-.6 1.5-1.3 1.8L21 16.5A1.5 1.5 0 0119.5 18H4.5A1.5 1.5 0 013 16.5L11.3 6.8c-.7-.3-1.3-.95-1.3-1.8a2 2 0 012-2z" />
        </svg>
      );
    }
    if (normalized.includes("militar") || normalized.includes("tactico")) {
      return (
        <svg className="w-8 h-8 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      );
    }
    if (normalized.includes("polici") || normalized.includes("seguridad")) {
      return (
        <svg className="w-8 h-8 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M12 3.75L3.75 6v6.75a9 9 0 009 9 9 9 0 009-9V6L12 3.75z" />
        </svg>
      );
    }
    if (normalized.includes("femenina") || normalized.includes("dama") || normalized.includes("mujer")) {
      return (
        <svg className="w-8 h-8 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8 text-white opacity-90 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    );
  };

  // Convertir banners de DB a formato de slides
  const slides = banners.map((banner) => ({
    src: banner.imageUrl,
    alt: banner.title || banner.subtitle || "Colección Destiny B2B"
  }));

  // Estado del slide activo en el hero carrusel
  const [activeSlide, setActiveSlide] = useState(0);

  // Intervalo de autoplay para avanzar automáticamente cada 4.5 segundos
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setActiveSlide((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (!isFetching) return;
    const fetchData = async () => {
      const res = await axios.get(
        `/api/v1/products?order_by=createdAt.desc&offset=${currentItems.length}&limit=10`
      );
      const fetchedProducts = res.data.data.map((product: apiProductsType) => ({
        ...product,
        img1: product.image1,
        img2: product.image2,
      }));
      setCurrentItems((products) => [...products, ...fetchedProducts]);
      setIsFetching(false);
    };
    fetchData();
  }, [isFetching, currentItems.length]);

  return (
    <>
      {/* ===== Header Section ===== */}
      <Header />

      <main id="main-content" className="w-full bg-white">
        {/* ===== 1. Premium Editorial Hero Section ===== */}
        <section id="inicio" className="w-full bg-lightnavy py-12 md:py-20 border-b border-gray100 overflow-hidden font-sans relative group">
          <div className="app-max-width app-x-padding grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Side: Brand presentation */}
            <div className="lg:col-span-5 flex flex-col justify-center text-left space-y-6 z-10 relative">

              {/* Centered Square Emblem "IJ" (from mockup) */}
              <div className="w-16 h-16 border-2 border-navy flex items-center justify-center font-serif text-3xl font-bold text-navy select-none bg-white shadow-sm rounded-sm">
                IJ
              </div>

              <div className="flex flex-col space-y-2">
                <span className="text-xs font-bold text-blue uppercase" style={{ letterSpacing: '0.25em' }}>
                  IJ Distribuidora
                </span>
                <h1 className="text-5xl md:text-6xl font-black tracking-widest text-navy font-serif leading-none">
                  DESTINY
                </h1>
                <h2 className="text-xl md:text-2xl font-normal text-gray500 font-serif uppercase" style={{ letterSpacing: '0.15em' }}>
                  Moda que te define
                </h2>
              </div>
              <p className="text-base text-gray400 max-w-md leading-relaxed font-normal">
                Confección, importación y comercialización de productos de alta calidad para empresas corporativas, instituciones del Estado y el día a día.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 select-none">
                <LinkButton
                  href="/product-category/new-arrivals"
                  extraClass="!bg-navy !text-white hover:!bg-blue transition-colors duration-300 text-center py-3.5 px-6 font-semibold text-xs tracking-wider uppercase rounded-sm"
                  inverted={false}
                >
                  Ver Colección Destiny
                </LinkButton>
                <LinkButton
                  href="/about-us"
                  extraClass="!bg-white !text-navy border border-navy hover:!bg-navy hover:!text-white transition-all duration-300 text-center py-3.5 px-6 font-semibold text-xs tracking-wider uppercase rounded-sm"
                  inverted={false}
                >
                  Sobre IJ Distribuidora
                </LinkButton>
              </div>
            </div>

            {/* Right Side: Editorial dual-model mockup image - Carrusel deslizable premium */}
            {/* Sin recuadros blancos, bordes o sombras. Totalmente transparente para PNGs fluidos y transparentes */}
            <div className="lg:col-span-7 relative flex justify-center lg:justify-end z-0 lg:-ml-16 w-full select-none">
              <div className="relative w-full hero-carousel-height overflow-visible">

                {/* Renderizar todas las imágenes apiladas con crossfade y efecto zoom lento */}
                {slides.map((slide, index) => (
                  <div
                    key={slide.src}
                    className={`absolute inset-0 w-full h-full transform transition-all duration-1000 ease-in-out ${index === activeSlide
                        ? "opacity-100 scale-102 pointer-events-auto"
                        : "opacity-0 scale-100 pointer-events-none"
                      }`}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      layout="fill"
                      objectFit="contain" // Totalmente visibles, sin recortes!
                      priority={index === 0}
                      unoptimized
                    />
                  </div>
                ))}

                {slides.length > 1 && (
                  <>
                    {/* Flecha Izquierda (Manual) */}
                    <button
                      type="button"
                      onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy bg-opacity-80 hover:bg-blue text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md z-20 focus:outline-none"
                      aria-label="Diapositiva Anterior"
                      style={{ backgroundColor: '#0B2545' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>

                    {/* Flecha Derecha (Manual) */}
                    <button
                      type="button"
                      onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy bg-opacity-80 hover:bg-blue text-white flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-md z-20 focus:outline-none"
                      aria-label="Siguiente Diapositiva"
                      style={{ backgroundColor: '#0B2545' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>

                    {/* Puntos Indicadores del Carrusel (Dots) */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-20 bg-navy bg-opacity-30 py-1.5 px-3 rounded-full select-none" style={{ backgroundColor: 'rgba(11, 37, 69, 0.3)' }}>
                      {slides.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setActiveSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300`}
                          style={{
                            backgroundColor: index === activeSlide ? '#0B2545' : 'rgba(11, 37, 69, 0.4)',
                            width: index === activeSlide ? '20px' : '8px'
                          }}
                          aria-label={`Ir a diapositiva ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. Original Category Section (New Arrivals, Women, Men with animations) ===== */}
        <section className="w-full h-auto py-12 bg-white border-b border-gray100 font-sans">
          <div className="app-max-width app-x-padding h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
            <div className="w-full sm:col-span-2 lg:col-span-2">
              <OverlayContainer
                imgSrc="/bg-img/banner_minipage1.jpg"
                imgSrc2="/bg-img/banner_minipage1-tablet.jpg"
                imgAlt="Nuevos Ingresos"
              >
                <LinkButton
                  href="/product-category/new-arrivals"
                  extraClass="absolute bottom-10-per sm:right-10-per z-20 !text-navy font-bold uppercase tracking-wider text-xs"
                >
                  {t("new_arrivals")}
                </LinkButton>
              </OverlayContainer>
            </div>
            <div className="w-full">
              <OverlayContainer
                imgSrc="/bg-img/banner_minipage2.jpg"
                imgAlt="Colección Dama"
              >
                <LinkButton
                  href="/product-category/women"
                  extraClass="absolute bottom-10-per z-20 !text-navy font-bold uppercase tracking-wider text-xs"
                >
                  {t("women_collection")}
                </LinkButton>
              </OverlayContainer>
            </div>
            <div className="w-full">
              <OverlayContainer
                imgSrc="/bg-img/banner_minipage3.jpg"
                imgAlt="Colección Caballero"
              >
                <LinkButton
                  href="/product-category/men"
                  extraClass="absolute bottom-10-per z-20 !text-navy font-bold uppercase tracking-wider text-xs"
                >
                  {t("men_collection")}
                </LinkButton>
              </OverlayContainer>
            </div>
          </div>
        </section>

        {/* ===== 3. The 6-Category Grid (Líneas de Moda) ===== */}
        <section id="seccion-destiny" className="w-full py-16 bg-white border-b border-gray100 font-sans">
          <div className="app-max-width app-x-padding">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-serif text-navy tracking-wider uppercase">
                DESTINY – LÍNEA DE MODA
              </h2>
              <p className="text-gray400 mt-2 text-sm">
                Diseños pensados para cada momento de tu vida.
              </p>
            </div>

            {/* Grid container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
              {fashionLines.map((line) => (
                <div key={line.id} className="relative group h-96 overflow-hidden shadow-lg rounded-sm border border-gray100">
                  <Image
                    src={line.imageUrl}
                    alt={line.name}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-navy bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-end p-5 text-center">
                    <div className="flex justify-center mb-3 text-white">
                      {getFashionLineIcon(line.name)}
                    </div>
                    <h3 className="text-base font-bold text-white font-serif uppercase tracking-wider">{line.name}</h3>
                    {line.tagline && (
                      <p className="text-gray200 mt-0.5 uppercase tracking-widest font-semibold" style={{ fontSize: '10px' }}>
                        {line.tagline}
                      </p>
                    )}
                    <Link href={line.link}>
                      <a className="mt-4 inline-block font-bold tracking-widest text-white border border-white py-2 px-4 hover:bg-white hover:text-navy transition-colors duration-300 uppercase rounded-sm" style={{ fontSize: '10px' }}>
                        VER MÁS
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 4. B2B Institutional Trust Banner ("IJ Distribuidora") ===== */}
        <section id="seccion-sobre-nosotros" className="w-full bg-lightnavy border-b border-gray100 font-sans">
          <div className="app-max-width grid grid-cols-1 lg:grid-cols-12 gap-0">

            {/* Left Side: Solid Dark blue banner statement */}
            <div className="lg:col-span-4 bg-navy text-white p-8 md:p-12 flex flex-col justify-center items-start space-y-6">
              <h3 className="text-2xl font-bold tracking-wider font-serif uppercase">
                IJ DISTRIBUIDORA
              </h3>
              <p className="text-sm text-gray300 leading-relaxed font-light">
                Somos una empresa ecuatoriana dedicada a la importación, confección y comercialización de productos textiles de alta calidad para corporaciones, negocios y el Estado.
              </p>
              <Link href="/coming-soon">
                <a className="bg-white text-navy font-bold py-3.5 px-6 hover:bg-blue hover:text-white transition-all duration-300 text-xs tracking-wider uppercase rounded-sm">
                  CONOCE MÁS
                </a>
              </Link>
            </div>

            {/* Right Side: 3 Columns of trust pillars */}
            <div className="lg:col-span-8 bg-white p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-t lg:border-t-0 border-gray100">

              {/* Pillar 1: Importación */}
              <div className="flex flex-col items-start space-y-3">
                <div className="p-3 bg-lightnavy rounded-full text-blue">
                  <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9M3 9.75h18M3 14.25h18" />
                  </svg>
                </div>
                <h4 className="font-bold text-base text-navy tracking-wide font-serif uppercase">IMPORTACIÓN</h4>
                <p className="text-xs text-gray400 leading-relaxed font-normal">
                  Productos textiles seleccionados bajo estrictos estándares internacionales de calidad y resistencia.
                </p>
              </div>

              {/* Pillar 2: Confección */}
              <div className="flex flex-col items-start space-y-3">
                <div className="p-3 bg-lightnavy rounded-full text-blue">
                  <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6.75V18M9 6.75V18m6-11.25a3 3 0 00-6 0m6 0a3 3 0 01-6 0m6 11.25a3 3 0 00-6 0m6 0a3 3 0 01-6 0" />
                  </svg>
                </div>
                <h4 className="font-bold text-base text-navy tracking-wide font-serif uppercase">CONFECCIÓN</h4>
                <p className="text-xs text-gray400 leading-relaxed font-normal">
                  Diseño de uniformes y confección a medida con telas técnicas adaptadas al sector comercial e institucional.
                </p>
              </div>

              {/* Pillar 3: Comercialización */}
              <div className="flex flex-col items-start space-y-3">
                <div className="p-3 bg-lightnavy rounded-full text-blue">
                  <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-base text-navy tracking-wide font-serif uppercase">DISTRIBUCIÓN</h4>
                <p className="text-xs text-gray400 leading-relaxed font-normal">
                  Comercialización directa al por mayor y distribución eficiente a nivel nacional con soluciones B2B.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ===== 5. Productos Destacados Section ===== */}
        <section id="seccion-catalogo" className="app-max-width app-x-padding my-16 flex flex-col font-sans">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold font-serif text-navy tracking-wider uppercase">
              PRODUCTOS DESTACADOS
            </h2>
            <p className="text-gray400 mt-2 text-sm">
              Explora lo más nuevo y lo más vendido de Destiny.
            </p>
          </div>

          {/* Dynamic 5-column catalog grid with flip reverso on hover */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 mb-10">
            {currentItems.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>

          <div className="flex justify-center select-none">
            <LinkButton
              href="/products"
              extraClass="!bg-navy !text-white hover:!bg-blue transition-colors duration-300 font-semibold tracking-wider px-8 py-3.5 rounded-sm uppercase text-xs"
              inverted={false}
            >
              Ver Todos Los Productos
            </LinkButton>
          </div>
        </section>

      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let products: itemType[] = [];
  let banners: any[] = [];
  let fashionLines: any[] = [];

  try {
    const prisma = (await import("@/lib/prisma")).default;

    // 1. Obtener productos activos (status: 1)
    const dbProducts = await prisma.product.findMany({
      where: { status: 1 },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { category: true }
    });

    products = dbProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      img1: p.image1,
      img2: p.image2,
    }));

    // 2. Obtener banners activos (status: 1)
    const dbBanners = await prisma.banner.findMany({
      where: { status: 1 },
      orderBy: { order: "asc" }
    });

    if (dbBanners.length === 0) {
      banners = [
        { id: 1, title: "Colección Editorial Destiny", subtitle: "Moda que te define", imageUrl: "/bg-img/destiny_hero_banner.png", link: "/product-category/new-arrivals", order: 1 },
        { id: 2, title: "Colección Militar Táctico", subtitle: "Rendimiento y Resistencia", imageUrl: "/bg-img/tactical_model.png", link: "/product-category/bags", order: 2 },
        { id: 3, title: "Equipamiento de Seguridad y Policial", subtitle: "Protección Profesional", imageUrl: "/bg-img/police_model.png", link: "/product-category/men", order: 3 },
        { id: 4, title: "Colección Formal y Blazer Ejecutivo", subtitle: "Elegancia Corporativa", imageUrl: "/bg-img/elegant_model.png", link: "/product-category/men", order: 4 },
        { id: 5, title: "Chaqueta Cortaviento Dama Softshell", subtitle: "Estilo & Versatilidad", imageUrl: "/bg-img/female_model.png", link: "/product-category/women", order: 5 },
        { id: 6, title: "Hoodie Buzo Casual Beige", subtitle: "Confort Diario", imageUrl: "/bg-img/casual_model.png", link: "/product-category/men", order: 6 }
      ];
    } else {
      banners = dbBanners.map((b: any) => ({
        id: b.id,
        title: b.title,
        subtitle: b.subtitle,
        imageUrl: b.imageUrl,
        link: b.link,
        order: b.order
      }));
    }

    // 3. Obtener líneas de moda activas (status: 1)
    const dbFashionLines = await prisma.fashionLine.findMany({
      where: { status: 1 },
      orderBy: { name: "asc" }
    });

    if (dbFashionLines.length === 0) {
      fashionLines = [
        { id: 1, name: "Casual", tagline: "Día a Día", imageUrl: "/bg-img/casual_model.png", link: "/product-category/men" },
        { id: 2, name: "Noche", tagline: "Elegante", imageUrl: "/bg-img/elegant_model.png", link: "/product-category/men" },
        { id: 3, name: "Militar", tagline: "Táctico", imageUrl: "/bg-img/tactical_model.png", link: "/product-category/bags" },
        { id: 4, name: "Policial", tagline: "Seguridad", imageUrl: "/bg-img/police_model.png", link: "/product-category/bags" },
        { id: 5, name: "Femenina", tagline: "Moda Dama", imageUrl: "/bg-img/female_model.png", link: "/product-category/women" },
        { id: 6, name: "Masculina", tagline: "Moda Caballero", imageUrl: "/bg-img/male_model.png", link: "/product-category/men" }
      ];
    } else {
      fashionLines = dbFashionLines.map((f: any) => ({
        id: f.id,
        name: f.name,
        tagline: f.tagline,
        imageUrl: f.imageUrl,
        link: f.link
      }));
    }
  } catch (error) {
    console.error("Error fetching products in index.tsx", error);
    products = [];
    banners = [
      { id: 1, title: "Colección Editorial Destiny", subtitle: "Moda que te define", imageUrl: "/bg-img/destiny_hero_banner.png", link: "/product-category/new-arrivals", order: 1 },
      { id: 2, title: "Colección Militar Táctico", subtitle: "Rendimiento y Resistencia", imageUrl: "/bg-img/tactical_model.png", link: "/product-category/bags", order: 2 },
      { id: 3, title: "Equipamiento de Seguridad y Policial", subtitle: "Protección Profesional", imageUrl: "/bg-img/police_model.png", link: "/product-category/men", order: 3 }
    ];
    fashionLines = [
      { id: 1, name: "Casual", tagline: "Día a Día", imageUrl: "/bg-img/casual_model.png", link: "/product-category/men" },
      { id: 2, name: "Noche", tagline: "Elegante", imageUrl: "/bg-img/elegant_model.png", link: "/product-category/men" },
      { id: 3, name: "Militar", tagline: "Táctico", imageUrl: "/bg-img/tactical_model.png", link: "/product-category/bags" }
    ];
  }

  return {
    props: {
      messages: {
        ...require(`../messages/common/${locale || "es"}.json`),
      },
      products,
      banners,
      fashionLines,
    },
    revalidate: 60, // Incremental Static Regeneration (ISR) cada 60 segundos
  };
};
