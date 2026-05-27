import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import AdminLayout from "@/components/Admin/AdminLayout";
import SkeletonLoader from "@/components/UI/SkeletonLoader";
import KpiCard from "@/components/Admin/KpiCard";
import SalesChart from "@/components/Admin/SalesChart";

interface Order {
  orderNumber: number;
  customerId: number;
  shippingAddress: string;
  orderDate: string;
  paymentType: string;
  deliveryType: string;
  totalPrice: number;
  sendEmail: boolean;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalInquiries: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<{ day: string; revenue: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const apiKey = sessionStorage.getItem("admin_api_key");
        if (!apiKey) return;

        const headers = { "x-api-key": apiKey };

        // Cargar datos en paralelo desde PostgreSQL
        const [productsRes, ordersRes, contactsRes] = await Promise.all([
          axios.get("/api/v1/products?limit=100"), 
          axios.get("/api/v1/orders", { headers }), 
          axios.get("/api/v1/contact", { headers }), 
        ]);

        const ordersList: Order[] = ordersRes.data.data || [];
        const productsList = productsRes.data.data || [];
        const contactsList = contactsRes.data.data || [];

        // Calcular volumen de ingresos
        const sumRevenue = ordersList.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

        setMetrics({
          totalProducts: productsList.length,
          totalOrders: ordersList.length,
          totalInquiries: contactsList.length,
          totalRevenue: Math.round(sumRevenue * 100) / 100,
        });

        // Calcular ingresos de los últimos 7 días de forma cronológica real
        const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
        const computedChartData = [];
        
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          
          const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0).getTime();
          const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();
          
          const dayOrders = ordersList.filter(o => {
            const oTime = new Date(o.orderDate).getTime();
            return oTime >= startOfDay && oTime <= endOfDay;
          });
          
          const revenue = dayOrders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
          
          computedChartData.push({
            day: dayNames[d.getDay()],
            revenue: Math.round(revenue * 100) / 100
          });
        }
        
        setChartData(computedChartData);

        // Tomar los últimos 5 pedidos
        setRecentOrders(ordersList.slice(0, 5));
      } catch (err: any) {
        console.error("Error loading dashboard metrics:", err);
        setErrorMsg("No se pudieron cargar las métricas. Compruebe la conexión o clave API.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  return (
    <AdminLayout title="Resumen Administrativo">
      <div className="min-h-screen bg-gray-50 p-1 md:p-4 font-sans select-none rounded-3xl" style={{ backgroundColor: "#f9fafb" }}>
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkeletonLoader extraClass="h-32 rounded-xl" />
              <SkeletonLoader extraClass="h-32 rounded-xl" />
              <SkeletonLoader extraClass="h-32 rounded-xl" />
            </div>
            <SkeletonLoader extraClass="h-96 rounded-xl" />
          </div>
        ) : errorMsg ? (
          <div className="bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-sm font-semibold py-4 px-6 rounded-2xl text-center">
            {errorMsg}
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* CSS Grid de KpiCards (Métricas Rápidas) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Ventas / Volumen Estimado */}
              <KpiCard
                title="Ventas Totales"
                value={`$ ${metrics.totalRevenue}`}
                trend="+15%"
                trendDirection="up"
                icon={
                  <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879-.659c1.546-1.16 3.7-1.16 5.247 0a3.2 3.2 0 001.373.578M12 6a3.23 3.23 0 00-1.849.521c-1.547 1.16-1.547 3.037 0 4.197m4.12 1.073c1.546 1.159 1.546 3.038 0 4.197a3.23 3.23 0 01-2.271.802M12 18a3.23 3.23 0 01-3.07-.802M12 6C6.5 6 6.5 12 12 12m0 0c5.5 0 5.5 6 12 6" />
                  </svg>
                }
              />

              {/* Card 2: Nuevos Pedidos B2B */}
              <KpiCard
                title="Nuevos Pedidos B2B"
                value={metrics.totalOrders}
                trend="+8%"
                trendDirection="up"
                icon={
                  <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                }
              />

              {/* Card 3: Leads de Contacto */}
              <KpiCard
                title="Leads Recibidos"
                value={metrics.totalInquiries}
                trend="+24%"
                trendDirection="up"
                icon={
                  <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                }
              />

            </div>

            {/* Componente SalesChart (Gráfico con Recharts) */}
            <div className="mt-8">
              <SalesChart data={chartData} />
            </div>

            {/* Listado de Pedidos Recientes B2B */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold font-sans text-navy uppercase tracking-wider" style={{ color: "#0B2545" }}>
                  Últimos Pedidos B2B Registrados
                </h3>
                <Link href="/admin/orders">
                  <a className="text-xs font-bold text-blue hover:underline uppercase tracking-wider">
                    Ver Todos los Pedidos
                  </a>
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-400 font-sans text-sm">
                  No hay pedidos registrados en este momento.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans divide-y divide-gray-200">
                    <thead className="bg-lightnavy/50 uppercase text-[10px] font-bold text-gray-400 tracking-wider">
                      <tr>
                        <th className="p-4">Pedido #</th>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Fecha</th>
                        <th className="p-4">Dirección Despacho</th>
                        <th className="p-4">Método de Pago</th>
                        <th className="p-4 text-right">Monto Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-500">
                      {recentOrders.map((order) => (
                        <tr key={order.orderNumber} className="hover:bg-lightnavy/10 transition-colors duration-150">
                          <td className="p-4 font-bold text-navy" style={{ color: "#0B2545" }}>#{order.orderNumber}</td>
                          <td className="p-4 font-semibold text-navy" style={{ color: "#0B2545" }}>
                            {/* Mostrar remitente si está disponible */}
                            {order.paymentType === "WHATSAPP_QUOTE" ? "Cotización B2B" : "Cliente Destiny"}
                          </td>
                          <td className="p-4">{new Date(order.orderDate).toLocaleDateString("es-EC", { dateStyle: "medium" })}</td>
                          <td className="p-4 max-w-xs truncate">{order.shippingAddress}</td>
                          <td className="p-4 select-none">
                            <span 
                              className="text-[10px] font-bold py-1 px-2.5 rounded-full border uppercase"
                              style={
                                order.paymentType === "BANK_TRANSFER"
                                  ? { color: "#8B5CF6", borderColor: "rgba(139, 92, 246, 0.2)", backgroundColor: "rgba(139, 92, 246, 0.1)" }
                                  : order.paymentType === "WHATSAPP_QUOTE"
                                  ? { color: "#10B981", borderColor: "rgba(16, 185, 129, 0.2)", backgroundColor: "rgba(16, 185, 129, 0.1)" }
                                  : order.paymentType === "PAYPHONE_CARD"
                                  ? { color: "#3B82F6", borderColor: "rgba(59, 130, 246, 0.2)", backgroundColor: "rgba(59, 130, 246, 0.1)" }
                                  : { color: "#6B7280", borderColor: "rgba(107, 114, 128, 0.2)", backgroundColor: "rgba(107, 114, 128, 0.1)" }
                              }
                            >
                              {order.paymentType === "BANK_TRANSFER" ? "Transferencia" : order.paymentType === "WHATSAPP_QUOTE" ? "WhatsApp B2B" : order.paymentType === "PAYPHONE_CARD" ? "Tarjeta PayPhone" : "Contra Entrega"}
                            </span>
                          </td>
                          <td className="p-4 text-right font-bold text-navy" style={{ color: "#0B2545" }}>$ {order.totalPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </AdminLayout>
  );
}
