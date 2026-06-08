import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/Admin/AdminLayout";
import SkeletonLoader from "@/components/UI/SkeletonLoader";

// Interfaces de Tipado Estrictas según las directrices relacionales
interface OrderProductSnapshot {
  id: number;
  name: string;
  priceAtPurchase: number;
  quantity: number;
  selectedColor?: string;
}

interface Order {
  orderNumber: number;
  customerId: number;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingAddress: string;
  orderDate: string;
  paymentType: "CASH_ON_DELIVERY" | "BANK_TRANSFER" | "WHATSAPP_QUOTE" | "PAYPHONE_CARD";
  deliveryType: "STORE_PICKUP" | "QUITO" | "PROVINCIAS";
  totalPrice: number;
  deliveryDate: string;
  products: any; // Campo JSON persistido
  sendEmail: boolean;
  couponCode?: string | null;
  employeeCode?: string | null;
  employeeCommission?: number | null;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Estados de control para el modal de visualización de detalles
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtener pedidos persistidos de la base de datos relacional
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey) return;

      const res = await axios.get("/api/v1/orders", {
        headers: { "x-api-key": apiKey }
      });
      
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Error loading orders from PostgreSQL:", err);
      setErrorMsg("Error al obtener los pedidos y cotizaciones B2B.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = async (orderNumber: number) => {
    if (!confirm("¿Está seguro de que desea eliminar/anular este pedido de forma definitiva de la base de datos?")) return;

    const apiKey = sessionStorage.getItem("admin_api_key");
    if (!apiKey) return;

    try {
      await axios.delete(`/api/v1/orders/${orderNumber}`, {
        headers: { "x-api-key": apiKey }
      });
      fetchOrders();
      setIsModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error("Delete order failed:", err);
      alert("Error al intentar anular el pedido administrativo.");
    }
  };

  // Filtrado dinámico client-side
  const filteredOrders = orders.filter((o) => {
    const term = searchQuery.toLowerCase();
    const orderNumStr = o.orderNumber.toString();
    const clientName = (o.customerName || "Cliente Destiny").toLowerCase();
    const payment = o.paymentType.toLowerCase();
    return orderNumStr.includes(term) || clientName.includes(term) || payment.includes(term);
  });

  // Mapear etiquetas y estilos de pago dinámicos con seguridad inline para Tailwind v2
  const getPaymentBadge = (method: Order["paymentType"]) => {
    switch (method) {
      case "WHATSAPP_QUOTE":
        return (
          <span 
            className="text-[10px] font-bold py-1 px-3 rounded-full border" 
            style={{ 
              color: "#10B981", 
              borderColor: "rgba(16, 185, 129, 0.2)", 
              backgroundColor: "rgba(16, 185, 129, 0.1)" 
            }}
          >
            WhatsApp B2B
          </span>
        );
      case "PAYPHONE_CARD":
        return (
          <span 
            className="text-[10px] font-bold py-1 px-3 rounded-full border" 
            style={{ 
              color: "#3B82F6", 
              borderColor: "rgba(59, 130, 246, 0.2)", 
              backgroundColor: "rgba(59, 130, 246, 0.1)" 
            }}
          >
            Tarjeta PayPhone
          </span>
        );
      case "BANK_TRANSFER":
        return (
          <span 
            className="text-[10px] font-bold py-1 px-3 rounded-full border" 
            style={{ 
              color: "#8B5CF6", 
              borderColor: "rgba(139, 92, 246, 0.2)", 
              backgroundColor: "rgba(139, 92, 246, 0.1)" 
            }}
          >
            Transferencia Bancaria
          </span>
        );
      default:
        return (
          <span 
            className="text-[10px] font-bold py-1 px-3 rounded-full border" 
            style={{ 
              color: "#6B7280", 
              borderColor: "rgba(107, 114, 128, 0.2)", 
              backgroundColor: "rgba(107, 114, 128, 0.1)" 
            }}
          >
            Contra Entrega
          </span>
        );
    }
  };

  // Mapear etiquetas de despacho
  const getDeliveryLabel = (type: Order["deliveryType"]) => {
    switch (type) {
      case "QUITO":
        return "Envío Quito ($2.00)";
      case "PROVINCIAS":
        return "Envío Provincias ($7.00)";
      default:
        return "Retiro en Bodega (Quito)";
    }
  };

  return (
    <AdminLayout title="Historial de Pedidos B2B">
      <div className="space-y-6">
        
        {/* Barra superior de controles */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 select-none">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Buscar por Nº Pedido o Cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 focus:border-blue p-3 outline-none text-sm rounded-xl pl-10"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z" />
              </svg>
            </span>
          </div>

          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-lightnavy/50 py-2 px-4 rounded-xl border border-gray-100">
            Total Registros: {filteredOrders.length}
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader extraClass="h-96 rounded-3xl" />
        ) : errorMsg ? (
          <div className="bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-sm font-semibold py-4 px-6 rounded-2xl text-center">
            {errorMsg}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-10 text-gray-400 font-sans text-sm">
                No se registraron cotizaciones o pedidos con los criterios ingresados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-sans divide-y divide-gray-200">
                  <thead className="bg-lightnavy/50 uppercase text-[10px] font-bold text-gray-400 tracking-wider">
                    <tr>
                      <th className="p-4">Nº Pedido</th>
                      <th className="p-4">Cliente / Razón Social</th>
                      <th className="p-4">Fecha de Compra</th>
                      <th className="p-4">Método de Pago</th>
                      <th className="p-4 text-right">Monto Total</th>
                      <th className="p-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-500">
                    {filteredOrders.map((o) => (
                      <tr key={o.orderNumber} className="hover:bg-lightnavy/10 transition-colors duration-150">
                      <td className="p-4 text-xs font-bold text-navy" style={{ color: "#0B2545" }}>#{o.orderNumber}</td>
                        <td className="p-4">
                          <div className="font-bold text-navy" style={{ color: "#0B2545" }}>
                            {o.customerName || "Cliente Destiny"}
                          </div>
                          <div className="text-xs text-gray-400">{o.customerEmail || "N/A"}</div>
                        </td>
                        <td className="p-4 text-xs">
                          {new Date(o.orderDate).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric"
                          })}
                        </td>
                        <td className="p-4">{getPaymentBadge(o.paymentType)}</td>
                        <td className="p-4 text-right font-bold text-navy" style={{ color: "#0B2545" }}>
                          $ {o.totalPrice.toFixed(2)}
                        </td>
                        <td className="p-4 text-center select-none">
                          <button
                            onClick={() => handleOpenDetails(o)}
                            title="Ver Detalles del Pedido"
                            aria-label={`Ver detalles del pedido ${o.orderNumber}`}
                            className="p-1.5 hover:bg-blue-50 rounded-lg transition duration-150 outline-none"
                          >
                            <svg className="w-5 h-5 text-blue hover:text-blue/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "#134074" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Premium de Detalles del Pedido (Basado en el Snapshot de Productos) */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-gray-500 bg-opacity-50 p-4 font-sans select-none overflow-y-auto py-8" style={{ zIndex: 999999 }}>
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 animate__animated animate__zoomIn animate__faster flex flex-col max-h-[85vh] md:max-h-[90vh]">
            <header className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3 flex-shrink-0">
              <h3 className="text-xl font-bold font-serif text-navy uppercase tracking-wider" style={{ color: "#0B2545" }}>
                Detalles del Pedido B2B #{selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-navy text-2xl outline-none"
              >
                &times;
              </button>
            </header>

            <div className="space-y-6 overflow-y-auto flex-1 pr-1 pb-4 min-h-0">
              
              {/* Bloque Ficha de Cliente y Despacho */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-lightnavy/30 p-5 rounded-2xl border border-gray-100" style={{ backgroundColor: "rgba(238, 244, 248, 0.3)" }}>
                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Ficha de Cliente</h4>
                  <div className="text-xs space-y-1.5 text-gray-600">
                    <div><span className="font-bold text-navy">Nombre:</span> {selectedOrder.customerName || "Cliente Destiny"}</div>
                    <div><span className="font-bold text-navy">Correo:</span> {selectedOrder.customerEmail || "N/A"}</div>
                    <div><span className="font-bold text-navy">Teléfono:</span> {selectedOrder.customerPhone || "N/A"}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Datos de Despacho</h4>
                  <div className="text-xs space-y-1.5 text-gray-600">
                    <div><span className="font-bold text-navy">Método:</span> {getDeliveryLabel(selectedOrder.deliveryType)}</div>
                    <div><span className="font-bold text-navy">Dirección:</span> {selectedOrder.shippingAddress}</div>
                    <div>
                      <span className="font-bold text-navy">Notificación:</span>{" "}
                      {selectedOrder.sendEmail ? "Solicitó comprobante digital por email" : "No solicitó comprobante digital"}
                    </div>
                    {selectedOrder.couponCode && (
                      <div>
                        <span className="font-bold text-navy">Cupón Aplicado:</span>{" "}
                        <span className="font-mono bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 rounded-md font-bold uppercase text-[10px] ml-1">
                          {selectedOrder.couponCode}
                        </span>
                      </div>
                    )}
                    {selectedOrder.employeeCode && (
                      <div className="flex items-center flex-wrap">
                        <span className="font-bold text-navy mr-1">Vendedor Referido:</span>{" "}
                        <span className="font-mono bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-md font-bold uppercase text-[10px]">
                          {selectedOrder.employeeCode}
                        </span>
                        {selectedOrder.employeeCommission !== undefined && selectedOrder.employeeCommission !== null && (
                          <span className="ml-2 font-semibold text-gray-500">
                            (Comisión: ${selectedOrder.employeeCommission.toFixed(2)} USD)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bloque Snapshot de Productos (Lectura Exclusiva Inmutable del JSON) */}
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Productos en la Compra (Snapshot Inmutable)
                </h4>
                
                <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs divide-y divide-gray-100">
                    <thead className="bg-lightnavy/50 font-bold text-gray-400 uppercase">
                      <tr>
                        <th className="p-3">Detalle Prenda / Código</th>
                        <th className="p-3 text-center">Cantidad</th>
                        <th className="p-3 text-right">P. Unitario</th>
                        <th className="p-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                      {Array.isArray(selectedOrder.products) ? (
                        (selectedOrder.products as OrderProductSnapshot[]).map((p, idx) => (
                          <tr key={idx} className="hover:bg-lightnavy/10 transition-colors">
                            <td className="p-3">
                              <div className="font-semibold text-navy text-xs" style={{ color: "#0B2545" }}>
                                {p.name || `Prenda ID #${p.id}`}
                              </div>
                              {p.selectedColor && (
                                <div className="flex items-center space-x-1.5 mt-1 select-none">
                                  <span className="text-[10px] text-gray-400">Color:</span>
                                  <span 
                                    className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                                    style={{ backgroundColor: p.selectedColor }}
                                    title={p.selectedColor}
                                  />
                                  <span className="text-[9px] font-mono text-gray-400">{p.selectedColor}</span>
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-center font-bold">{p.quantity} un.</td>
                            <td className="p-3 text-right">$ {(p.priceAtPurchase || 0).toFixed(2)}</td>
                            <td className="p-3 text-right font-bold text-navy" style={{ color: "#0B2545" }}>
                              $ {((p.priceAtPurchase || 0) * p.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-3 text-center text-gray-400">
                            Error al leer la fotografía del desglose de productos.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sumatoria Final */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 select-none">
                <div className="text-xs font-bold text-gray-400 uppercase">Resumen Monetario</div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-xs text-gray-400 font-bold uppercase">Total Cobrado:</span>
                  <span className="text-2xl font-black font-serif text-navy" style={{ color: "#0B2545" }}>
                    $ {selectedOrder.totalPrice.toFixed(2)} USD
                  </span>
                </div>
              </div>
            </div>

            <footer className="pt-6 border-t border-gray-100 flex justify-between select-none flex-shrink-0">
              <button
                onClick={() => handleDeleteOrder(selectedOrder.orderNumber)}
                className="bg-white hover:bg-red-50 text-red border border-red/20 py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-200"
                style={{ color: "#F05454" }}
              >
                Anular / Borrar Pedido
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-navy hover:bg-blue text-white py-3 px-6 rounded-xl text-xs font-serif tracking-wider uppercase font-bold transition duration-300"
                style={{ backgroundColor: "#0B2545" }}
              >
                Cerrar Detalles
              </button>
            </footer>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
