import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/Admin/AdminLayout";
import SkeletonLoader from "@/components/UI/SkeletonLoader";

interface ContactLead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  createdAt: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<ContactLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey) return;

      const res = await axios.get("/api/v1/contact", {
        headers: { "x-api-key": apiKey }
      });
      setContacts(res.data.data || []);
    } catch (err) {
      console.error("Error loading contact inquiries:", err);
      setErrorMsg("Error al obtener la bandeja de correspondencia de leads.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDeleteLead = async (id: number) => {
    if (!confirm("¿Está seguro de que desea descartar/archivar de forma definitiva esta consulta?")) return;

    const apiKey = sessionStorage.getItem("admin_api_key");
    if (!apiKey) return;

    try {
      await axios.delete(`/api/v1/contact/${id}`, {
        headers: { "x-api-key": apiKey }
      });
      fetchContacts();
    } catch (err) {
      console.error("Delete contact query failed:", err);
      alert("Error al intentar archivar el mensaje de contacto.");
    }
  };

  // Función inteligente para formatear números de teléfono al prefijo +593 de Ecuador (Regla 12)
  const getWhatsAppLink = (lead: ContactLead) => {
    if (!lead.phone) return "#";

    // Limpiar todos los caracteres no numéricos
    let digits = lead.phone.replace(/\D/g, "");

    // Si comienza con el código internacional (593), lo dejamos tal cual
    // Si comienza con un cero de celular local (09...), reemplazamos el primer cero con 593
    if (digits.startsWith("0")) {
      digits = "593" + digits.slice(1);
    } else if (!digits.startsWith("593")) {
      digits = "593" + digits;
    }

    const message = 
      `Hola *${lead.name}*, nos ponemos en contacto contigo de *Destiny / IJ Distribuidora* en relación a tu consulta con el asunto *"${lead.subject || "Consulta General"}"*.\n\n¿En qué podemos ayudarte hoy?`;
    
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  };

  // Filtrado dinámico client-side
  const filteredContacts = contacts.filter((c) => {
    const term = searchQuery.toLowerCase();
    const sender = c.name.toLowerCase();
    const mail = c.email.toLowerCase();
    const msg = c.message.toLowerCase();
    const subj = (c.subject || "Consulta General").toLowerCase();
    return sender.includes(term) || mail.includes(term) || msg.includes(term) || subj.includes(term);
  });

  return (
    <AdminLayout title="Bandeja de Leads / Consultas">
      <div className="space-y-6">
        
        {/* Barra superior de controles */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 select-none">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Buscar por remitente, asunto o email..."
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
            Pendientes: {filteredContacts.length}
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader extraClass="h-96 rounded-3xl" />
        ) : errorMsg ? (
          <div className="bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-sm font-semibold py-4 px-6 rounded-2xl text-center">
            {errorMsg}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredContacts.length === 0 ? (
              <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl text-center text-gray-400 font-sans text-sm select-none">
                No hay consultas pendientes en la bandeja de entrada.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredContacts.map((c) => (
                  <div 
                    key={c.id} 
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Cabecera del Lead */}
                      <header className="flex justify-between items-start mb-4 select-none">
                        <div>
                          <h3 className="font-bold text-base text-navy font-serif" style={{ color: "#0B2545" }}>{c.name}</h3>
                          <span className="text-[10px] text-gray-400 font-bold block">{c.email}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold bg-lightnavy py-1 px-2.5 rounded-full border border-gray-100">
                          {new Date(c.createdAt).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </header>

                      {/* Asunto y Mensaje */}
                      <div className="space-y-2 mb-6">
                        <div className="text-xs font-bold text-blue uppercase tracking-wider" style={{ color: "#134074" }}>
                          Asunto: {c.subject || "Consulta General"}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed bg-lightnavy/30 p-4 rounded-2xl border border-gray-50/50" style={{ backgroundColor: "rgba(238, 244, 248, 0.25)" }}>
                          {c.message}
                        </p>
                      </div>
                    </div>

                    {/* Botones de acción B2B */}
                    <footer className="flex justify-between items-center select-none pt-4 border-t border-gray-50">
                      <button
                        onClick={() => handleDeleteLead(c.id)}
                        title="Archivar Lead"
                        aria-label={`Archivar lead de ${c.name}`}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition duration-150 outline-none"
                      >
                        <svg className="w-5 h-5 text-red-500 hover:text-red-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "#F05454" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      {c.phone ? (
                        <a
                          href={getWhatsAppLink(c)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green text-white font-sans text-xs tracking-wider uppercase font-bold py-2.5 px-4 rounded-xl flex items-center shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-98"
                          style={{ backgroundColor: "#10B981" }}
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.793 1.452 5.518 0 10.006-4.486 10.01-10.007.002-2.673-1.03-5.188-2.906-7.067C16.567 1.65 14.07 0.617 11.4 0.617 5.882.617 1.395 5.105 1.39 10.627c-.001 1.629.431 3.218 1.252 4.629L1.65 21.03l6.09-1.597-.093-.279z"/>
                          </svg>
                          Iniciar WhatsApp
                        </a>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Sin Teléfono
                        </span>
                      )}
                    </footer>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
