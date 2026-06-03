import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

/**
 * Propiedades del layout maestro del panel de administración.
 */
interface AdminLayoutProps {
  children: React.ReactNode;                                // Componentes y vistas hijas a renderizar
  title: string;                                           // Título descriptivo de la vista actual
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  // Comprobar la existencia de la clave API de administrador en la sesión
  useEffect(() => {
    const savedKey = sessionStorage.getItem("admin_api_key");
    if (!savedKey) {
      router.push("/admin");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogoutClick = () => {
    sessionStorage.removeItem("admin_api_key");
    router.push("/admin");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightnavy select-none" style={{ backgroundColor: "#EEF4F8" }}>
        <p className="font-bold text-navy uppercase tracking-widest text-xs animate-pulse font-sans">
          Verificando Autorización...
        </p>
      </div>
    );
  }

  const currentPath = router.pathname;

  return (
    <>
      <Head>
        <title>{title} - Panel Administrativo Destiny</title>
      </Head>

      <div className="min-h-screen flex flex-col md:flex-row bg-lightnavy/10 font-sans" style={{ backgroundColor: "rgba(238, 244, 248, 0.2)" }}>
        {/* Barra Lateral Izquierda (Sidebar) */}
        <aside className="w-full md:w-64 bg-navy text-white flex flex-col flex-none select-none">
          
          {/* Logotipo y Cabecera del Panel */}
          <div className="p-6 border-b border-white/10 flex items-center space-x-3">
            <div className="w-10 h-10 border border-white/30 bg-white text-navy flex items-center justify-center font-serif text-xl font-bold rounded-lg shadow-sm">
              IJ
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-[0.2em] text-blue uppercase" style={{ color: "#F5B461" }}>
                IJ Distribuidora
              </span>
              <span className="text-sm font-black tracking-wider font-serif uppercase">
                Panel Destiny
              </span>
            </div>
          </div>

          {/* Menú de Enlaces Administrativos */}
          <nav className="flex-1 p-6 space-y-2">
            <Link href="/admin/dashboard" passHref>
              <a className={`flex items-center space-x-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                currentPath === "/admin/dashboard" ? "bg-blue text-white shadow-md" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`} style={currentPath === "/admin/dashboard" ? { backgroundColor: "#134074" } : {}}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                <span>Resumen</span>
              </a>
            </Link>

            <Link href="/admin/products" passHref>
              <a className={`flex items-center space-x-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                currentPath === "/admin/products" ? "bg-blue text-white shadow-md" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`} style={currentPath === "/admin/products" ? { backgroundColor: "#134074" } : {}}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <span>Productos</span>
              </a>
            </Link>

            <Link href="/admin/orders" passHref>
              <a className={`flex items-center space-x-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                currentPath === "/admin/orders" ? "bg-blue text-white shadow-md" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`} style={currentPath === "/admin/orders" ? { backgroundColor: "#134074" } : {}}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span>Pedidos B2B</span>
              </a>
            </Link>

            <Link href="/admin/contacts" passHref>
              <a className={`flex items-center space-x-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                currentPath === "/admin/contacts" ? "bg-blue text-white shadow-md" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`} style={currentPath === "/admin/contacts" ? { backgroundColor: "#134074" } : {}}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25" />
                </svg>
                <span>Consultas / Leads</span>
              </a>
            </Link>

            {/* Separación y Título CMS */}
            <div className="pt-4 pb-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest select-none">
              Gestión de Contenido CMS
            </div>

            <Link href="/admin/categories" passHref>
              <a className={`flex items-center space-x-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                currentPath === "/admin/categories" ? "bg-blue text-white shadow-md" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`} style={currentPath === "/admin/categories" ? { backgroundColor: "#134074" } : {}}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                </svg>
                <span>Categorías</span>
              </a>
            </Link>

            <Link href="/admin/banners" passHref>
              <a className={`flex items-center space-x-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                currentPath === "/admin/banners" ? "bg-blue text-white shadow-md" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`} style={currentPath === "/admin/banners" ? { backgroundColor: "#134074" } : {}}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
                </svg>
                <span>Banners Carrusel</span>
              </a>
            </Link>

            <Link href="/admin/promo-categories" passHref>
              <a className={`flex items-center space-x-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                currentPath === "/admin/promo-categories" ? "bg-blue text-white shadow-md" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`} style={currentPath === "/admin/promo-categories" ? { backgroundColor: "#134074" } : {}}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span>Categorías Inicio</span>
              </a>
            </Link>

            <Link href="/admin/fashion-lines" passHref>
              <a className={`flex items-center space-x-3 p-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                currentPath === "/admin/fashion-lines" ? "bg-blue text-white shadow-md" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`} style={currentPath === "/admin/fashion-lines" ? { backgroundColor: "#134074" } : {}}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h.008v.008H6V7.5z" />
                </svg>
                <span>Líneas de Moda</span>
              </a>
            </Link>
          </nav>

          {/* Enlaces de Utilidad Inferiores */}
          <div className="p-6 border-t border-white/10 space-y-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors duration-200 w-full"
            >
              <span>Ver Sitio Web</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>

            <button
              onClick={handleLogoutClick}
              className="w-full bg-white/10 hover:bg-red/20 hover:text-white p-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 text-gray-300 text-center font-sans focus:outline-none"
            >
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Panel de Contenido de la Página */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
          <header className="mb-8 border-b border-gray-100 pb-4 flex justify-between items-center select-none">
            <h2 className="text-3xl font-black font-serif text-navy tracking-wide uppercase">
              {title}
            </h2>
            <div className="hidden sm:flex items-center space-x-2 bg-blue/10 py-1.5 px-3 rounded-full border border-blue/20" style={{ backgroundColor: "rgba(19, 64, 116, 0.1)", borderColor: "rgba(19, 64, 116, 0.2)" }}>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ backgroundColor: "#9BDEAC" }}></span>
              <span className="text-[9px] font-bold tracking-widest text-blue uppercase">Conexión Supabase Activa</span>
            </div>
          </header>

          {/* Animación fluida de transiciones */}
          <div className="animate__animated animate__fadeIn animate__faster">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
