import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";

export default function AdminLogin() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirigir al dashboard si la sesión ya existe localmente
  useEffect(() => {
    const existingKey = sessionStorage.getItem("admin_api_key");
    if (existingKey) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    if (!apiKey.trim()) {
      setErrorMsg("Por favor, ingrese la clave de administración.");
      setIsLoading(false);
      return;
    }

    try {
      // Validar la clave en vivo consultando las órdenes protegidas
      const response = await axios.get("/api/v1/orders", {
        headers: {
          "x-api-key": apiKey.trim(),
        },
      });

      if (response.data.success) {
        // Almacenar clave en sesión y redirigir
        sessionStorage.setItem("admin_api_key", apiKey.trim());
        router.push("/admin/dashboard");
      } else {
        setErrorMsg("Acceso denegado: Clave administrativa no autorizada.");
      }
    } catch (err: any) {
      console.error("Login verification failed:", err);
      if (err.response && err.response.status === 401) {
        setErrorMsg("Clave de administración incorrecta. Inténtelo de nuevo.");
      } else if (err.response && err.response.status === 500) {
        setErrorMsg("Error de Base de Datos (500): La variable 'DATABASE_URL' no está configurada o Supabase está desconectada. Por favor, verifique el archivo .env.local.");
      } else {
        setErrorMsg("Ocurrió un error al verificar la clave. Por favor, asegúrese de que el servidor y la base de datos de PostgreSQL estén activos.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-lightnavy min-h-screen flex items-center justify-center font-sans" style={{ backgroundColor: "rgba(238, 244, 248, 0.5)" }}>
      <Head>
        <title>Portal de Seguridad - Destiny / IJ</title>
      </Head>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-2xl mx-4">
        {/* Isotipo Circular Centrado */}
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="w-16 h-16 border-2 border-navy bg-white text-navy flex items-center justify-center font-serif text-3xl font-bold rounded-2xl shadow-sm mb-4">
            IJ
          </div>
          <span className="text-xs font-bold tracking-[0.2em] text-blue uppercase">
            IJ Distribuidora
          </span>
          <h1 className="text-2xl font-black tracking-wider text-navy font-serif mt-1 uppercase">
            Portal Destiny
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
            Control de Seguridad Administrativo
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-xs font-semibold py-3.5 px-4 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Clave de Acceso (Master Key)
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type="password"
                placeholder="••••••••••••••••"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full border border-gray-300 focus:border-blue p-4 outline-none transition-all duration-200 rounded-xl text-sm"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-navy text-white hover:bg-blue p-4 rounded-xl font-serif text-sm tracking-wider uppercase transition-all duration-300 font-bold ${
              isLoading ? "opacity-60 cursor-not-allowed" : "active:scale-[0.98]"
            }`}
          >
            {isLoading ? "Verificando Credenciales..." : "Ingresar al Panel"}
          </button>
        </form>

        <div className="text-center mt-8 select-none">
          <Link href="/" passHref>
            <a className="text-xs font-bold text-gray-400 hover:text-navy uppercase tracking-widest transition-colors duration-200">
              Volver a la Tienda
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
