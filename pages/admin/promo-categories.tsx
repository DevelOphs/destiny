import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import AdminLayout from "@/components/Admin/AdminLayout";
import SkeletonLoader from "@/components/UI/SkeletonLoader";
import ImageUploadPicker from "@/components/Admin/ImageUploadPicker";

interface PromoCategory {
  id: number;
  title: string;
  imageUrl: string;
  imageUrlTablet: string | null;
  link: string;
  status: number;
}

export default function AdminPromoCategories() {
  const [categories, setCategories] = useState<PromoCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Estados del Formulario (Creación)
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrlTablet, setImageUrlTablet] = useState("");
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Estados del Formulario (Edición)
  const [editingCategory, setEditingCategory] = useState<PromoCategory | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImageUrlTablet, setEditImageUrlTablet] = useState("");
  const [editLink, setEditLink] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey) return;

      const res = await axios.get("/api/v1/promo-categories", {
        headers: { "x-api-key": apiKey }
      });
      setCategories(res.data.data || []);
    } catch (err: any) {
      console.error("Error fetching promo categories:", err);
      setErrorMsg("Error al obtener las categorías promocionales del servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    if (!title.trim() || !imageUrl.trim() || !link.trim()) {
      setSubmitError("Los campos Título, Imagen y Enlace de Redirección son obligatorios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey) return;

      await axios.post(
        "/api/v1/promo-categories",
        {
          title: title.trim(),
          imageUrl: imageUrl.trim(),
          imageUrlTablet: imageUrlTablet.trim() || null,
          link: link.trim()
        },
        {
          headers: { "x-api-key": apiKey }
        }
      );

      // Limpiar y Recargar
      setTitle("");
      setImageUrl("");
      setImageUrlTablet("");
      setLink("");
      setShowAddModal(false);
      fetchCategories();
    } catch (err: any) {
      console.error("Error creating promo category:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError("Ocurrió un error al guardar la categoría promocional.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (category: PromoCategory) => {
    setEditingCategory(category);
    setEditTitle(category.title);
    setEditImageUrl(category.imageUrl);
    setEditImageUrlTablet(category.imageUrlTablet || "");
    setEditLink(category.link);
    setSubmitError("");
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setSubmitError("");
    setIsSubmitting(true);

    if (!editTitle.trim() || !editImageUrl.trim() || !editLink.trim()) {
      setSubmitError("Los campos Título, Imagen y Enlace de Redirección son obligatorios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey) return;

      await axios.put(
        `/api/v1/promo-categories/${editingCategory.id}`,
        {
          title: editTitle.trim(),
          imageUrl: editImageUrl.trim(),
          imageUrlTablet: editImageUrlTablet.trim() || null,
          link: editLink.trim()
        },
        {
          headers: { "x-api-key": apiKey }
        }
      );

      setShowEditModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err: any) {
      console.error("Error updating promo category:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError("Ocurrió un error al actualizar la categoría promocional.");
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
        `/api/v1/promo-categories/${id}`,
        { status: newStatus },
        {
          headers: { "x-api-key": apiKey }
        }
      );
      fetchCategories();
    } catch (err: any) {
      console.error("Error toggling promo category status:", err);
      alert("Error al cambiar el estado de visibilidad.");
    }
  };

  const handleDeleteCategory = async (id: number, catTitle: string) => {
    if (
      !confirm(
        `¿Está seguro de que desea eliminar la categoría promocional "${catTitle.toUpperCase()}"?\n\nEsta acción eliminará el registro de la base de datos de manera permanente.`
      )
    )
      return;

    const apiKey = sessionStorage.getItem("admin_api_key");
    if (!apiKey) return;

    try {
      setErrorMsg("");
      await axios.delete(`/api/v1/promo-categories/${id}`, {
        headers: { "x-api-key": apiKey }
      });
      fetchCategories();
    } catch (err: any) {
      console.error("Error deleting promo category:", err);
      alert("Error al intentar eliminar la categoría promocional.");
    }
  };

  return (
    <AdminLayout title="Categorías de Inicio / Promocionales">
      <div className="space-y-6">
        
        {/* Barra superior de controles */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex justify-between items-center select-none">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-lightnavy/50 py-2 px-4 rounded-xl border border-gray-100">
            Categorías Totales: {categories.length}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-navy text-white hover:bg-blue py-3 px-6 rounded-xl font-sans text-xs tracking-wider uppercase font-bold transition-all duration-300 shadow-md active:scale-95"
            style={{ backgroundColor: "#0B2545" }}
          >
            Nueva Categoría Promocional
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
            {categories.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl border border-gray-100 shadow-xl text-center text-gray-400 font-sans text-sm select-none">
                No hay categorías promocionales personalizadas en base de datos. La página de inicio está usando los valores estáticos por defecto (Última Confección, Línea Femenina, Línea Masculina). ¡Agrega la primera categoría para personalizar tu página de inicio!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div 
                    key={cat.id} 
                    className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col justify-between"
                  >
                    {/* Visualización de la imagen */}
                    <div className="relative h-64 w-full bg-gray-100 border-b border-gray-100 select-none">
                      <Image
                        src={cat.imageUrl}
                        alt={cat.title}
                        layout="fill"
                        objectFit="cover"
                        unoptimized
                      />
                    </div>

                    {/* Contenido descriptivo */}
                    <div className="p-6 space-y-3">
                      <div>
                        <h4 className="font-bold text-base text-navy font-serif uppercase tracking-wider" style={{ color: "#0B2545" }}>
                          {cat.title}
                        </h4>
                      </div>
                      
                      <div className="pt-2 flex flex-col space-y-1.5 text-[10px] font-mono text-gray-400 select-all">
                        <span className="truncate">Imagen Desktop: {cat.imageUrl}</span>
                        {cat.imageUrlTablet && (
                          <span className="truncate">Imagen Tablet: {cat.imageUrlTablet}</span>
                        )}
                        <span className="truncate">Enlace: {cat.link}</span>
                      </div>
                    </div>

                    {/* Acciones de la categoría */}
                    <footer className="p-6 pt-0 select-none border-t border-gray-50 flex flex-col space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {/* Toggle Switch */}
                          <div className="relative inline-block w-8 mr-1 align-middle select-none transition duration-200 ease-in">
                            <input
                              type="checkbox"
                              name={`toggle-${cat.id}`}
                              id={`toggle-${cat.id}`}
                              checked={cat.status === 1}
                              onChange={() => handleToggleStatus(cat.id, cat.status)}
                              className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border border-gray-300 appearance-none cursor-pointer focus:outline-none"
                              style={{
                                transform: cat.status === 1 ? 'translateX(100%)' : 'translateX(0)',
                                borderColor: cat.status === 1 ? '#0B2545' : '#D1D5DB',
                                transition: 'transform 0.25s ease, border-color 0.25s ease'
                              }}
                            />
                            <label
                              htmlFor={`toggle-${cat.id}`}
                              className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-250 ${cat.status === 1 ? 'bg-navy' : 'bg-gray-300'}`}
                              style={{ backgroundColor: cat.status === 1 ? '#0B2545' : '#D1D5DB' }}
                            ></label>
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 font-sans uppercase">
                            {cat.status === 1 ? "Visible" : "Oculto"}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-gray-400">ID: {cat.id}</span>
                      </div>

                      <div className="flex justify-end space-x-3 border-t border-gray-50 pt-3">
                        <button
                          onClick={() => handleEditClick(cat)}
                          title="Editar Categoría Promocional"
                          aria-label={`Editar categoría promocional ${cat.title}`}
                          className="p-1.5 hover:bg-blue-50 rounded-lg transition duration-150 outline-none"
                        >
                          <svg className="w-5 h-5 text-blue hover:text-blue/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "#134074" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.title)}
                          title="Eliminar Categoría Promocional"
                          aria-label={`Eliminar categoría promocional ${cat.title}`}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition duration-150 outline-none"
                        >
                          <svg className="w-5 h-5 text-red-500 hover:text-red-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "#F05454" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </footer>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal de Creación */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 md:p-6" style={{ zIndex: 999999 }}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-full overflow-hidden">
              <header className="p-6 border-b border-gray-100 flex-shrink-0 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-navy font-serif uppercase tracking-wide" style={{ color: "#0B2545" }}>
                    Agregar Categoría Promocional
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                    Bloque Superior Destiny Home
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-navy transition-colors duration-200 focus:outline-none text-2xl"
                >
                  &times;
                </button>
              </header>

              <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs font-sans">
                  {submitError && (
                    <div className="mb-4 bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-xs font-semibold py-3 px-4 rounded-xl text-center">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Título (Obligatorio)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Última Confección, Línea Femenina"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                    />
                  </div>

                  <ImageUploadPicker
                    label="Imagen Desktop (Obligatorio)"
                    value={imageUrl}
                    onChange={(val) => setImageUrl(val)}
                    tip="Resolución sugerida: 600x800px para tarjetas estándar, 1200x800px para la tarjeta doble."
                  />

                  <ImageUploadPicker
                    label="Imagen Tablet (Opcional)"
                    value={imageUrlTablet}
                    onChange={(val) => setImageUrlTablet(val)}
                    tip="Resolución sugerida: 1024x600px. Versión alternativa para dispositivos medianos."
                  />

                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Enlace de Redirección (Obligatorio)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. /product-category/new-arrivals o /product-category/women"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                    />
                  </div>
                </div>

                <footer className="p-6 border-t border-gray-100 flex-shrink-0 flex justify-end space-x-3 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-navy text-white hover:bg-blue px-6 py-3 rounded-xl text-xs font-serif tracking-wider uppercase font-bold transition duration-300 disabled:opacity-50"
                    style={{ backgroundColor: "#0B2545" }}
                  >
                    {isSubmitting ? "Guardando..." : "Crear Categoría"}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Edición */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 md:p-6" style={{ zIndex: 999999 }}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-full overflow-hidden">
              <header className="p-6 border-b border-gray-100 flex-shrink-0 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-navy font-serif uppercase tracking-wide" style={{ color: "#0B2545" }}>
                    Editar Categoría Promocional
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                    ID: {editingCategory?.id}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingCategory(null);
                  }}
                  className="text-gray-400 hover:text-navy transition-colors duration-200 focus:outline-none text-2xl"
                >
                  &times;
                </button>
              </header>

              <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs font-sans">
                  {submitError && (
                    <div className="mb-4 bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-xs font-semibold py-3 px-4 rounded-xl text-center">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Título (Obligatorio)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Última Confección"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                    />
                  </div>

                  <ImageUploadPicker
                    label="Imagen Desktop (Obligatorio)"
                    value={editImageUrl}
                    onChange={(val) => setEditImageUrl(val)}
                    tip="Resolución sugerida: 600x800px para tarjetas estándar, 1200x800px para la tarjeta doble."
                  />

                  <ImageUploadPicker
                    label="Imagen Tablet (Opcional)"
                    value={editImageUrlTablet}
                    onChange={(val) => setEditImageUrlTablet(val)}
                    tip="Resolución sugerida: 1024x600px. Versión alternativa para dispositivos medianos."
                  />

                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Enlace de Redirección (Obligatorio)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. /product-category/new-arrivals"
                      value={editLink}
                      onChange={(e) => setEditLink(e.target.value)}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                    />
                  </div>
                </div>

                <footer className="p-6 border-t border-gray-100 flex-shrink-0 flex justify-end space-x-3 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingCategory(null);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-navy text-white hover:bg-blue px-6 py-3 rounded-xl text-xs font-serif tracking-wider uppercase font-bold transition duration-300 disabled:opacity-50"
                    style={{ backgroundColor: "#0B2545" }}
                  >
                    {isSubmitting ? "Guardando..." : "Actualizar Categoría"}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
