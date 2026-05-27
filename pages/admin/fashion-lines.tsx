import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import AdminLayout from "@/components/Admin/AdminLayout";
import SkeletonLoader from "@/components/UI/SkeletonLoader";
import ImageUploadPicker from "@/components/Admin/ImageUploadPicker";

interface FashionLine {
  id: number;
  name: string;
  tagline: string | null;
  imageUrl: string;
  link: string;
  status: number;
}

export default function AdminFashionLines() {
  const [lines, setLines] = useState<FashionLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados del Formulario (Creación)
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchLines = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey) return;

      const res = await axios.get("/api/v1/fashion-lines", {
        headers: { "x-api-key": apiKey }
      });
      setLines(res.data.data || []);
    } catch (err: any) {
      console.error("Error fetching fashion lines:", err);
      setErrorMsg("Error al obtener la lista de líneas de moda del servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLines();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    if (!name.trim() || !imageUrl.trim() || !link.trim()) {
      setSubmitError("Los campos Nombre, Imagen y Enlace son obligatorios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey) return;

      await axios.post(
        "/api/v1/fashion-lines",
        {
          name: name.trim(),
          tagline: tagline.trim() || null,
          imageUrl: imageUrl.trim(),
          link: link.trim()
        },
        {
          headers: { "x-api-key": apiKey }
        }
      );

      // Limpiar y Recargar
      setName("");
      setTagline("");
      setImageUrl("");
      setLink("");
      setShowAddModal(false);
      fetchLines();
    } catch (err: any) {
      console.error("Error creating fashion line:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError("Ocurrió un error al guardar la línea de moda.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLine = async (id: number, lineName: string) => {
    if (
      !confirm(
        `¿Está seguro de que desea eliminar la línea de moda "${lineName.toUpperCase()}"?\n\nSe desactivará del bloque central (6 categorías) de la página de inicio inmediatamente.`
      )
    )
      return;

    const apiKey = sessionStorage.getItem("admin_api_key");
    if (!apiKey) return;

    try {
      setErrorMsg("");
      await axios.delete(`/api/v1/fashion-lines/${id}`, {
        headers: { "x-api-key": apiKey }
      });
      fetchLines();
    } catch (err: any) {
      console.error("Error deleting fashion line:", err);
      alert("Error al intentar realizar el borrado lógico de la línea de moda.");
    }
  };

  return (
    <AdminLayout title="Gestión de Líneas de Moda / Colecciones">
      <div className="space-y-6">
        
        {/* Barra superior de controles */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex justify-between items-center select-none">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-lightnavy/50 py-2 px-4 rounded-xl border border-gray-100">
            Líneas de Moda Activas: {lines.length}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-navy text-white hover:bg-blue py-3 px-6 rounded-xl font-sans text-xs tracking-wider uppercase font-bold transition-all duration-300 shadow-md active:scale-95"
            style={{ backgroundColor: "#0B2545" }}
          >
            Nueva Línea de Moda
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
            {lines.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl border border-gray-100 shadow-xl text-center text-gray-400 font-sans text-sm select-none">
                No hay líneas de moda personalizadas en base de datos. La página de inicio está usando los mockup visuales (Casual, Noche, Militar, Policial, Femenina, Masculina) por defecto. ¡Añade tu primera línea para personalizar la tienda!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lines.map((line) => (
                  <div 
                    key={line.id} 
                    className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col justify-between"
                  >
                    {/* Visualización de la imagen */}
                    <div className="relative h-64 w-full bg-gray-100 border-b border-gray-100 select-none">
                      <Image
                        src={line.imageUrl}
                        alt={line.name}
                        layout="fill"
                        objectFit="cover"
                        unoptimized
                      />
                    </div>

                    {/* Contenido descriptivo */}
                    <div className="p-6 space-y-3">
                      <div>
                        <h4 className="font-bold text-base text-navy font-serif uppercase tracking-wider" style={{ color: "#0B2545" }}>
                          {line.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                          {line.tagline || "Sin subtítulo"}
                        </p>
                      </div>
                      
                      <div className="pt-2 flex flex-col space-y-1.5 text-[10px] font-mono text-gray-400 select-all">
                        <span className="truncate">Imagen: {line.imageUrl}</span>
                        <span className="truncate">Enlace: {line.link}</span>
                      </div>
                    </div>

                    {/* Acciones de la línea */}
                    <footer className="p-6 pt-0 select-none border-t border-gray-50 flex justify-between items-center">
                      <span className="text-[9px] font-bold py-1 px-2.5 rounded-full border uppercase bg-green bg-opacity-10 text-green border-green border-opacity-25" style={{ color: "#10B981", borderColor: "rgba(16, 185, 129, 0.2)", backgroundColor: "rgba(16, 185, 129, 0.1)" }}>
                        Activo en Home
                      </span>
                      <button
                        onClick={() => handleDeleteLine(line.id, line.name)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 py-1.5 px-3 hover:bg-red-50 rounded-xl transition duration-200"
                        style={{ color: "#F05454" }}
                      >
                        Eliminar Línea
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
                  Agregar Línea de Moda
                </h3>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                  Bloque Central Destiny Home
                </p>
              </div>

              {submitError && (
                <div className="mb-4 bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-xs font-semibold py-3 px-4 rounded-xl text-center">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Nombre (Obligatorio)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Casual, Militar, Noche, Policial"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Subtítulo / Tagline (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Día a Día, Táctico, Elegante, Seguridad"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                  />
                </div>

                <ImageUploadPicker
                  label="Imagen de Fondo"
                  value={imageUrl}
                  onChange={(val) => setImageUrl(val)}
                  tip="Resolución sugerida: 600x800px (Formato retrato / vertical elegante de moda)"
                />

                <div>
                  <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Enlace de Categoría (Obligatorio)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. /product-category/men o /products"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                  />
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
                    {isSubmitting ? "Guardando..." : "Crear Colección"}
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
