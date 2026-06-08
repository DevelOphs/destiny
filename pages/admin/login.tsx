import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";

interface DecodedToken {
  role: "ADMIN" | "VENDEDOR";
  exp: number;
}

function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirigir al panel si la sesión ya existe localmente y es válida
  useEffect(() => {
    const existingToken = localStorage.getItem("admin_token");
    if (existingToken) {
      const decoded = decodeToken(existingToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        if (decoded.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/admin/orders");
        }
      } else {
        localStorage.removeItem("admin_token");
        sessionStorage.removeItem("admin_api_key");
      }
    }
  }, [router]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Por favor, complete todos los campos.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/v1/auth/login", {
        email: email.trim(),
        password: password.trim()
      });

      if (response.data.success) {
        const token = response.data.token;
        const decoded = decodeToken(token);

        if (!decoded) {
          setErrorMsg("Error al descifrar los permisos del token.");
          setIsLoading(false);
          return;
        }

        // Guardar token
        localStorage.setItem("admin_token", token);
        sessionStorage.setItem("admin_api_key", token);

        // Redirección condicionada por Rol
        if (decoded.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/admin/orders");
        }
      } else {
        setErrorMsg("Acceso denegado: Credenciales incorrectas.");
      }
    } catch (err: any) {
      console.error("Login attempt failed:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMsg(err.response.data.error);
      } else {
        setErrorMsg("Error al conectar con el servidor de autenticación. Verifique su conexión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans bg-gradient-to-tr from-lightnavy via-white to-lightnavy/30" style={{ backgroundColor: "rgba(238, 244, 248, 0.4)" }}>
      <Head>
        <title>Ingreso Administrativo - Destiny</title>
      </Head>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-2xl mx-4 transition-all duration-300 hover:shadow-navy/5">
        
        {/* Isotipo Circular Centrado */}
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="w-16 h-16 border-2 border-navy bg-navy text-white flex items-center justify-center font-serif text-3xl font-bold rounded-2xl shadow-md mb-4 transform hover:rotate-12 transition-transform duration-300">
            IJ
          </div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-blue uppercase" style={{ color: "#F5B461" }}>
            IJ Distribuidora
          </span>
          <h1 className="text-2xl font-black tracking-wider text-navy font-serif mt-1 uppercase" style={{ color: "#0B2545" }}>
            Panel Destiny
          </h1>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-semibold">
            Control de Acceso Administrativo (RBAC)
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold py-3.5 px-4 rounded-xl text-center animate-pulse">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="usuario@destiny.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy p-4 outline-none transition-all duration-200 rounded-xl text-sm"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy p-4 outline-none transition-all duration-200 rounded-xl text-sm"
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
            className="w-full text-white py-4 rounded-xl font-serif text-sm tracking-wider uppercase transition-all duration-300 font-bold shadow-md hover:bg-opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "#0B2545" }}
          >
            {isLoading ? "Validando Acceso..." : "Ingresar al Panel"}
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
