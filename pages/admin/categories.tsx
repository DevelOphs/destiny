import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/Admin/AdminLayout";
import SkeletonLoader from "@/components/UI/SkeletonLoader";

interface Category {
  id: number;
  name: string;
  description: string | null;
  status: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Estados del Formulario (Creación)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Estados del Formulario (Edición)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey) return;

      const res = await axios.get("/api/v1/categories", {
        headers: { "x-api-key": apiKey }
      });
      setCategories(res.data.data || []);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setErrorMsg("Error al obtener la lista de categorías del servidor.");
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

    if (!name.trim()) {
      setSubmitError("El nombre es un campo obligatorio.");
      setIsSubmitting(false);
      return;
    }

    try {
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey) return;

      await axios.post(
        "/api/v1/categories",
        {
          name: name.trim(),
          description: description.trim() || null
        },
        {
          headers: { "x-api-key": apiKey }
        }
      );

      // Limpiar y Recargar
      setName("");
      setDescription("");
      setShowAddModal(false);
      fetchCategories();
    } catch (err: any) {
      console.error("Error creating category:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError("Ocurrió un error al intentar crear la categoría.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || "");
    setUpdateError("");
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError("");
    setIsUpdating(true);

    if (!editName.trim()) {
      setUpdateError("El nombre es un campo obligatorio.");
      setIsUpdating(false);
      return;
    }

    try {
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey || !editId) return;

      await axios.put(
        `/api/v1/categories/${editId}`,
        {
          name: editName.trim(),
          description: editDescription.trim() || null
        },
        {
          headers: { "x-api-key": apiKey }
        }
      );

      setShowEditModal(false);
      fetchCategories();
    } catch (err: any) {
      console.error("Error updating category:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setUpdateError(err.response.data.error);
      } else {
        setUpdateError("Ocurrió un error al intentar actualizar la categoría.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCategory = async (id: number, catName: string) => {
    if (
      !confirm(
        `¿Está seguro de que desea eliminar lógicamente la categoría "${catName.toUpperCase()}"?\n\nLos productos existentes bajo esta categoría no se borrarán pero se ocultará la agrupación.`
      )
    )
      return;

    const apiKey = sessionStorage.getItem("admin_api_key");
    if (!apiKey) return;

    try {
      setErrorMsg("");
      await axios.delete(`/api/v1/categories/${id}`, {
        headers: { "x-api-key": apiKey }
      });
      fetchCategories();
    } catch (err: any) {
      console.error("Error deleting category:", err);
      alert("Error al intentar realizar el borrado lógico de la categoría.");
    }
  };

  const filteredCategories = categories.filter((c) => {
    const term = searchQuery.toLowerCase();
    const nameMatch = c.name.toLowerCase().includes(term);
    const descMatch = (c.description || "").toLowerCase().includes(term);
    return nameMatch || descMatch;
  });

  return (
    <AdminLayout title="Gestión de Categorías">
      <div className="space-y-6">
        
        {/* Controles de barra superior */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 select-none">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Buscar categorías..."
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

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-navy text-white hover:bg-blue py-3 px-6 rounded-xl font-sans text-xs tracking-wider uppercase font-bold transition-all duration-300 shadow-md active:scale-95"
            style={{ backgroundColor: "#0B2545" }}
          >
            Nueva Categoría
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
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-sans text-sm select-none">
                No se encontraron categorías activas. Crea una nueva para comenzar.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans divide-y divide-gray-200">
                  <thead className="bg-lightnavy uppercase text-[10px] font-bold text-gray-400 tracking-wider select-none">
                    <tr>
                      <th className="p-5">ID</th>
                      <th className="p-5">Nombre de Categoría</th>
                      <th className="p-5">Descripción</th>
                      <th className="p-5">Estado</th>
                      <th className="p-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-500">
                    {filteredCategories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-lightnavy/20 transition-colors duration-150">
                        <td className="p-5 font-bold text-navy" style={{ color: "#0B2545" }}>#{cat.id}</td>
                        <td className="p-5 font-semibold text-navy uppercase tracking-wider" style={{ color: "#0B2545" }}>
                          {cat.name}
                        </td>
                        <td className="p-5 max-w-sm truncate">{cat.description || "Sin descripción"}</td>
                        <td className="p-5 select-none">
                          <span className="text-[9px] font-bold py-1 px-2.5 rounded-full border uppercase bg-green bg-opacity-10 text-green border-green border-opacity-25" style={{ color: "#10B981", borderColor: "rgba(16, 185, 129, 0.2)", backgroundColor: "rgba(16, 185, 129, 0.1)" }}>
                            Activo
                          </span>
                        </td>
                        <td className="p-5 text-right select-none">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => handleEditClick(cat)}
                              title="Editar Categoría"
                              aria-label={`Editar categoría ${cat.name}`}
                              className="p-1.5 hover:bg-blue-50 rounded-lg transition duration-150 outline-none"
                            >
                              <svg className="w-5 h-5 text-blue hover:text-blue/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "#134074" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              title="Eliminar Categoría"
                              aria-label={`Eliminar categoría ${cat.name}`}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition duration-150 outline-none"
                            >
                              <svg className="w-5 h-5 text-red-500 hover:text-red-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "#F05454" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    Agregar Nueva Categoría
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                    Gestión del Catálogo Destiny
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
                      Nombre de la Categoría
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Softshell, Vestidos, Táctico"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Descripción (Opcional)
                    </label>
                    <textarea
                      placeholder="Breve descripción descriptiva de los productos que agrupa..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm resize-none"
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-full overflow-hidden animate__animated animate__zoomIn animate__faster">
              <header className="p-6 border-b border-gray-100 flex-shrink-0 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-navy font-serif uppercase tracking-wide" style={{ color: "#0B2545" }}>
                    Editar Categoría
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                    Modificar Categoría del Catálogo Destiny
                  </p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-navy transition-colors duration-200 focus:outline-none text-2xl"
                >
                  &times;
                </button>
              </header>

              <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs font-sans">
                  {updateError && (
                    <div className="mb-4 bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-xs font-semibold py-3 px-4 rounded-xl text-center">
                      {updateError}
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Nombre de la Categoría (Obligatorio)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Softshell, Vestidos, Táctico"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Descripción (Opcional)
                    </label>
                    <textarea
                      placeholder="Breve descripción descriptiva de los productos que agrupa..."
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm resize-none"
                    />
                  </div>
                </div>

                <footer className="p-6 border-t border-gray-100 flex-shrink-0 flex justify-end space-x-3 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-navy text-white hover:bg-blue px-6 py-3 rounded-xl text-xs font-serif tracking-wider uppercase font-bold transition duration-300 disabled:opacity-50"
                    style={{ backgroundColor: "#0B2545" }}
                  >
                    {isUpdating ? "Guardando..." : "Guardar Cambios"}
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
