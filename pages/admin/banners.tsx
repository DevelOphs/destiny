import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import AdminLayout from "@/components/Admin/AdminLayout";
import SkeletonLoader from "@/components/UI/SkeletonLoader";
import ImageUploadPicker from "@/components/Admin/ImageUploadPicker";

interface Banner {
  id: number;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  link: string | null;
  order: number;
  status: number;
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados del Formulario (Creación)
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [order, setOrder] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey) return;

      const res = await axios.get("/api/v1/banners", {
        headers: { "x-api-key": apiKey }
      });
      setBanners(res.data.data || []);
    } catch (err: any) {
      console.error("Error fetching banners:", err);
      setErrorMsg("Error al obtener la lista de banners del servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    if (!imageUrl.trim()) {
      setSubmitError("La URL de la imagen es obligatoria.");
      setIsSubmitting(false);
      return;
    }

    try {
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey) return;

      await axios.post(
        "/api/v1/banners",
        {
          title: title.trim() || null,
          subtitle: subtitle.trim() || null,
          imageUrl: imageUrl.trim(),
          link: link.trim() || null,
          order: parseInt(order, 10) || 0
        },
        {
          headers: { "x-api-key": apiKey }
        }
      );

      // Limpiar y Recargar
      setTitle("");
      setSubtitle("");
      setImageUrl("");
      setLink("");
      setOrder("0");
      setShowAddModal(false);
      fetchBanners();
    } catch (err: any) {
      console.error("Error creating banner:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError("Ocurrió un error al intentar guardar el banner.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    const apiKey = sessionStorage.getItem("admin_api_key");
    if (!apiKey) return;

    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      setErrorMsg("");
      await axios.put(
        `/api/v1/banners/${id}`,
        { status: newStatus },
        {
          headers: { "x-api-key": apiKey }
        }
      );
      fetchBanners();
    } catch (err: any) {
      console.error("Error toggling banner status:", err);
      alert("Error al cambiar el estado de visibilidad del banner.");
    }
  };

  const handleDeleteBanner = async (id: number, text: string | null) => {
    if (
      !confirm(
        `¿Está seguro de que desea eliminar PERMANENTEMENTE este banner?\n\n"${text || "Sin Título"}" se borrará definitivamente de la base de datos.`
      )
    )
      return;

    const apiKey = sessionStorage.getItem("admin_api_key");
    if (!apiKey) return;

    try {
      setErrorMsg("");
      await axios.delete(`/api/v1/banners/${id}`, {
        headers: { "x-api-key": apiKey }
      });
      fetchBanners();
    } catch (err: any) {
      console.error("Error deleting banner:", err);
      alert("Error al intentar eliminar permanentemente el banner.");
    }
  };

  return (
    <AdminLayout title="Gestión del Carrusel de Banners">
      <div className="space-y-6">
        
        {/* Barra superior de controles */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex justify-between items-center select-none">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-lightnavy/50 py-2 px-4 rounded-xl border border-gray-100">
            Banners Activos: {banners.length}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-navy text-white hover:bg-blue py-3 px-6 rounded-xl font-sans text-xs tracking-wider uppercase font-bold transition-all duration-300 shadow-md active:scale-95"
            style={{ backgroundColor: "#0B2545" }}
          >
            Nuevo Banner
          </button>
        </div>

        {/* Listado principal */}
        {isLoading ? (
          <SkeletonLoader extraClass="h-96 rounded-3xl" />
        ) : errorMsg ? (
          <div className="bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-sm font-semibold py-4 px-6 rounded-2xl text-center">
            {errorMsg}
          </div>
        ) : (
          <div className="space-y-6">
            {banners.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl border border-gray-100 shadow-xl text-center text-gray-400 font-sans text-sm select-none">
                No hay banners personalizados en base de datos. La página de inicio está usando los mockup visuales por defecto. ¡Añade tu primer banner para personalizar la tienda!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner) => (
                  <div 
                    key={banner.id} 
                    className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col justify-between"
                  >
                    {/* Visualización de la imagen */}
                    <div className="relative h-48 w-full bg-gray-100 border-b border-gray-100 select-none">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title || "Banner"}
                        layout="fill"
                        objectFit="cover"
                        unoptimized
                      />
                      <div className="absolute top-4 left-4 bg-navy text-white text-[10px] font-bold py-1.5 px-3 rounded-full uppercase tracking-wider" style={{ backgroundColor: "#0B2545" }}>
                        Prioridad: {banner.order}
                      </div>
                    </div>

                    {/* Contenido descriptivo */}
                    <div className="p-6 space-y-3">
                      <div>
                        <h4 className="font-bold text-base text-navy font-serif" style={{ color: "#0B2545" }}>
                          {banner.title || "Sin título"}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {banner.subtitle || "Sin subtítulo"}
                        </p>
                      </div>
                      
                      <div className="pt-2 flex flex-col space-y-1.5 text-[10px] font-mono text-gray-400 select-all">
                        <span className="truncate">URL: {banner.imageUrl}</span>
                        <span className="truncate">Enlace: {banner.link || "Sin redirección"}</span>
                      </div>
                    </div>

                    {/* Acciones del banner */}
                    <footer className="p-6 pt-0 select-none border-t border-gray-50 flex justify-between items-center gap-4">
                      <div className="flex items-center space-x-2">
                        {/* Toggle Switch */}
                        <div className="relative inline-block w-8 mr-1 align-middle select-none transition duration-200 ease-in">
                          <input
                            type="checkbox"
                            name={`toggle-${banner.id}`}
                            id={`toggle-${banner.id}`}
                            checked={banner.status === 1}
                            onChange={() => handleToggleStatus(banner.id, banner.status)}
                            className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border border-gray-300 appearance-none cursor-pointer focus:outline-none"
                            style={{
                              transform: banner.status === 1 ? 'translateX(100%)' : 'translateX(0)',
                              borderColor: banner.status === 1 ? '#0B2545' : '#D1D5DB',
                              transition: 'transform 0.25s ease, border-color 0.25s ease'
                            }}
                          />
                          <label
                            htmlFor={`toggle-${banner.id}`}
                            className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-250 ${banner.status === 1 ? 'bg-navy' : 'bg-gray-300'}`}
                            style={{ backgroundColor: banner.status === 1 ? '#0B2545' : '#D1D5DB' }}
                          ></label>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 font-sans uppercase">
                          {banner.status === 1 ? "Visible" : "Oculto"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteBanner(banner.id, banner.title)}
                        className="text-[11px] font-bold text-red-500 hover:text-red-700 py-1 px-2 hover:bg-red-50 rounded-xl transition duration-200 whitespace-nowrap"
                        style={{ color: "#F05454" }}
                      >
                        Eliminar
                      </button>
                    </footer>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal de Creación */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm animate__animated animate__fadeIn animate__faster select-none">
            <div className="bg-white w-full max-w-md p-8 rounded-3xl border border-gray-100 shadow-2xl mx-4 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-navy transition-colors duration-200 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-navy font-serif uppercase tracking-wide" style={{ color: "#0B2545" }}>
                  Agregar Nuevo Banner
                </h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                  Carrusel Editorial Destiny
                </p>
              </div>

              {submitError && (
                <div className="mb-4 bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-xs font-semibold py-3 px-4 rounded-xl text-center">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-4 font-sans text-xs">
                <ImageUploadPicker
                  label="Imagen del Banner"
                  value={imageUrl}
                  onChange={(val) => setImageUrl(val)}
                  tip="Resolución sugerida: 1920x800px (Formato apaisado / carrusel panorámico de alta definición)"
                />

                <div>
                  <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Título del Banner (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Colección Militar Táctico"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Subtítulo o Tagline (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Rendimiento y Resistencia"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Enlace de Redirección (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. /product-category/bags"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Prioridad de Orden
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Los números más bajos se mostrarán primero.
                  </span>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-3.5 px-4 rounded-xl uppercase tracking-wider transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-navy hover:bg-blue text-white font-bold py-3.5 px-4 rounded-xl uppercase tracking-wider transition-all duration-300 shadow-md active:scale-98"
                    style={{ backgroundColor: "#0B2545" }}
                  >
                    {isSubmitting ? "Guardando..." : "Crear Banner"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
