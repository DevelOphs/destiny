import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/Admin/AdminLayout";
import SkeletonLoader from "@/components/UI/SkeletonLoader";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  code: string;
  commissionPercentage: number;
  role: string;
  totalSalesCount: number;
  totalCommissions: number;
  createdAt: string;
}

export default function AdminProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const res = await axios.get("/api/v1/employees/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data.data);
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      setErrorMsg("No se pudo cargar la información de perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AdminLayout title="Mi Perfil B2B">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {isLoading ? (
          <SkeletonLoader extraClass="h-96 rounded-3xl" />
        ) : errorMsg ? (
          <div className="bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-sm font-semibold py-4 px-6 rounded-2xl text-center">
            {errorMsg}
          </div>
        ) : profile ? (
          <div className="space-y-6 animate__animated animate__fadeIn animate__faster">
            {/* Tarjeta de Encabezado de Perfil */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl flex flex-col md:flex-row items-center md:justify-between gap-6 select-none">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 bg-navy text-white flex items-center justify-center font-serif text-2xl font-bold rounded-2xl shadow-md uppercase" style={{ backgroundColor: "#0B2545" }}>
                  {profile.name.substring(0, 2)}
                </div>
                <div className="flex flex-col text-center md:text-left">
                  <h3 className="text-xl font-bold text-navy font-serif uppercase tracking-wide" style={{ color: "#0B2545" }}>
                    {profile.name}
                  </h3>
                  <span className="text-xs text-gray-400 mt-0.5 lowercase tracking-wider">{profile.email}</span>
                  <div className="flex items-center justify-center md:justify-start space-x-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full" style={profile.role === "ADMIN" ? { backgroundColor: "#F5B461" } : { backgroundColor: "#10B981" }}></span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{profile.role}</span>
                  </div>
                </div>
              </div>

              <div className="bg-lightnavy/35 border border-blue/15 px-6 py-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-inner" style={{ backgroundColor: "rgba(19, 64, 116, 0.05)" }}>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Código de Comisión</span>
                <span className="text-xl font-black text-navy uppercase tracking-wider mt-1" style={{ color: "#134074" }}>
                  {profile.code}
                </span>
                <span className="text-[9px] text-gray-500 font-semibold mt-0.5">{profile.commissionPercentage}% de comisión asignada</span>
              </div>
            </div>

            {/* Panel de Estadísticas en Cuadros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
              
              {/* Ventas totales */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex items-center space-x-5">
                <div className="w-12 h-12 bg-blue/10 text-blue flex items-center justify-center rounded-2xl border border-blue/15" style={{ backgroundColor: "rgba(19, 64, 116, 0.1)" }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: "#134074" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ventas Concretadas</span>
                  <span className="text-2xl font-black text-navy mt-1" style={{ color: "#0B2545" }}>
                    {profile.totalSalesCount}
                  </span>
                  <span className="text-[9px] text-gray-400 mt-0.5">Pedidos referidos con tu código</span>
                </div>
              </div>

              {/* Comisiones acumuladas */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex items-center space-x-5">
                <div className="w-12 h-12 bg-green-50 text-green-500 flex items-center justify-center rounded-2xl border border-green-100" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: "#10B981" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Comisión Acumulada</span>
                  <span className="text-2xl font-black text-green-500 mt-1" style={{ color: "#10B981" }}>
                    $ {profile.totalCommissions.toFixed(2)} USD
                  </span>
                  <span className="text-[9px] text-gray-400 mt-0.5">Comisión neta cobrada</span>
                </div>
              </div>

            </div>

            {/* Cuadro de Información Informativo */}
            <div className="bg-blue/5 border border-blue/10 p-6 rounded-3xl text-xs text-navy flex items-start space-x-3 select-none" style={{ backgroundColor: "rgba(19, 64, 116, 0.03)", borderColor: "rgba(19, 64, 116, 0.1)" }}>
              <svg className="w-5 h-5 flex-shrink-0 text-blue mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: "#134074" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="space-y-1.5 font-sans">
                <h4 className="font-bold text-navy uppercase tracking-wider text-[10px]" style={{ color: "#0B2545" }}>
                  ¿Cómo funciona tu código?
                </h4>
                <p className="text-gray-500 leading-relaxed text-[11px]">
                  Comparte tu código promocional <strong className="text-navy font-bold">{profile.code}</strong> con los clientes B2B. Cuando los clientes apliquen tu código al realizar un pedido en la tienda, se asignará la comisión de venta de forma automática.
                </p>
                <p className="text-gray-500 leading-relaxed text-[11px]">
                  Las comisiones se calculan sobre el subtotal neto del pedido, descontando los cupones que hayan sido aplicados y excluyendo el costo de envío.
                </p>
              </div>
            </div>

          </div>
        ) : null}

      </div>
    </AdminLayout>
  );
}
