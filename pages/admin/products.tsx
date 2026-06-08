import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/Admin/AdminLayout";
import SkeletonLoader from "@/components/UI/SkeletonLoader";
import ImageUploadPicker from "@/components/Admin/ImageUploadPicker";

interface Product {
  id: number;
  name: string;
  price: number;
  detail: string;
  description: string;
  image1: string;
  image2: string;
  category: {
    id: number;
    name: string;
    description: string;
  };
  colors: string[];
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados de control para el modal del formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Estados de los campos del formulario de producto
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [detail, setDetail] = useState("");
  const [description, setDescription] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [categoryName, setCategoryName] = useState("men");
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/v1/products?limit=100");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("Error loading products from Supabase:", err);
      setErrorMsg("Error al obtener los productos del catálogo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName("");
    setPrice("");
    setDetail("");
    setDescription("");
    setImage1("");
    setImage2("");
    setCategoryName("men");
    setColors([]);
    setColorInput("");
    setEditingId(null);
    setIsEditMode(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setName(p.name);
    setPrice(p.price.toString());
    setDetail(p.detail);
    setDescription(p.description);
    setImage1(p.image1);
    setImage2(p.image2);
    setCategoryName(p.category.name);
    setColors(p.colors || []);
    setColorInput("");
    setEditingId(p.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const apiKey = sessionStorage.getItem("admin_api_key");
    if (!apiKey) {
      setIsSubmitting(false);
      return;
    }

    const headers = { "x-api-key": apiKey };
    const payload = {
      name,
      price: parseFloat(price),
      detail,
      description: description || detail,
      image1: image1 || "/bg-img/logo_scorpion.png",
      image2: image2 || image1 || "/bg-img/logo_scorpion.png",
      categoryName,
      colors,
    };

    try {
      if (isEditMode && editingId) {
        await axios.put(`/api/v1/products/${editingId}`, payload, { headers });
      } else {
        await axios.post("/api/v1/products", payload, { headers });
      }
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Save product failed:", err);
      alert("Error al guardar el producto. Verifique los permisos o cabeceras.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (productId: number) => {
    if (!confirm("¿Está seguro de que desea eliminar este producto de forma definitiva?")) return;

    const apiKey = sessionStorage.getItem("admin_api_key");
    if (!apiKey) return;

    const headers = { "x-api-key": apiKey };

    try {
      await axios.delete(`/api/v1/products/${productId}`, { headers });
      fetchProducts();
    } catch (err) {
      console.error("Delete product failed:", err);
      alert("Error al eliminar el producto del catálogo.");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Gestión del Catálogo">
      <div className="space-y-6">
        
        {/* Barra superior de controles */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 select-none">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Buscar por prenda o categoría..."
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
            onClick={handleOpenAddModal}
            className="bg-navy text-white hover:bg-blue px-6 py-3 rounded-xl font-serif text-sm tracking-wider uppercase font-bold transition duration-300 active:scale-98"
            style={{ backgroundColor: "#0B2545" }}
          >
            Añadir Nueva Prenda
          </button>
        </div>

        {isLoading ? (
          <SkeletonLoader extraClass="h-96 rounded-3xl" />
        ) : errorMsg ? (
          <div className="bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-sm font-semibold py-4 px-6 rounded-2xl text-center">
            {errorMsg}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10 text-gray-400 font-sans text-sm">
                No se encontraron productos que coincidan con la búsqueda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-sans divide-y divide-gray-200">
                  <thead className="bg-lightnavy/50 uppercase text-[10px] font-bold text-gray-400 tracking-wider">
                    <tr>
                      <th className="p-4">Imagen</th>
                      <th className="p-4">ID</th>
                      <th className="p-4">Prenda / Nombre</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4 text-right">Precio</th>
                      <th className="p-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-500">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-lightnavy/10 transition-colors duration-150">
                        <td className="p-4 select-none">
                          <img
                            src={p.image1}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-100"
                          />
                        </td>
                        <td className="p-4 text-xs font-bold text-gray-400">#{p.id}</td>
                        <td className="p-4">
                          <div className="font-bold text-navy" style={{ color: "#0B2545" }}>{p.name}</div>
                          <div className="text-xs text-gray-400 max-w-xs truncate">{p.detail}</div>
                          {p.colors && p.colors.length > 0 && (
                            <div className="flex gap-1.5 mt-1.5 select-none">
                              {p.colors.map((c) => (
                                <span 
                                  key={c}
                                  className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                                  style={{ backgroundColor: c }}
                                  title={c}
                                />
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold py-0.5 px-2.5 rounded-full bg-blue/10 text-blue border border-blue/20 uppercase" style={{ color: "#134074", borderColor: "rgba(19, 64, 116, 0.2)", backgroundColor: "rgba(19, 64, 116, 0.1)" }}>
                            {p.category.name}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-navy" style={{ color: "#0B2545" }}>$ {p.price}</td>
                        <td className="p-4 text-center select-none">
                          <div className="flex items-center justify-center space-x-3">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              title="Editar Prenda"
                              aria-label={`Editar prenda ${p.name}`}
                              className="p-1.5 hover:bg-blue-50 rounded-lg transition duration-150 outline-none"
                            >
                              <svg className="w-5 h-5 text-blue hover:text-blue/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "#134074" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(p.id)}
                              title="Eliminar Prenda"
                              aria-label={`Eliminar prenda ${p.name}`}
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
      </div>

      {/* Modal Añadir / Editar Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 md:p-6" style={{ zIndex: 999999 }}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-full overflow-hidden">
            <header className="p-6 border-b border-gray-100 flex-shrink-0 flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif text-navy uppercase tracking-wider" style={{ color: "#0B2545" }}>
                {isEditMode ? "Editar Prenda" : "Añadir Nueva Prenda"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-navy text-2xl outline-none"
              >
                &times;
              </button>
            </header>

            <form onSubmit={handleFormSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre Comercial de la Prenda</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:border-blue"
                    placeholder="Ej. Saco Softshell Cortaviento"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Precio Unitario ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:border-blue"
                      placeholder="Ej. 65.00"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Categoría General</label>
                    <select
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:border-blue bg-white"
                    >
                      <option value="men">Caballeros (men)</option>
                      <option value="women">Damas (women)</option>
                      <option value="bags">Táctico & Seguridad (bags)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Detalle Corto (Subtítulo)</label>
                  <input
                    type="text"
                    required
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:border-blue"
                    placeholder="Ej. Costuras reforzadas e impermeabilidad certificada..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Descripción Detallada (Ficha Técnica)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:border-blue"
                    rows={2}
                    placeholder="Detalles adicionales, materiales, telas, usos comerciales, etc."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Colores Disponibles (Códigos HEX)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      className="flex-1 border border-gray-300 p-2.5 rounded-xl text-sm outline-none focus:border-blue"
                      placeholder="Ej. #4B5320 o #000000"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const hex = colorInput.trim();
                        if (!hex) return;
                        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                        if (!hexRegex.test(hex)) {
                          alert("Formato de color inválido. Debe comenzar con '#' y tener 3 o 6 caracteres hexadecimales (Ej: #4B5320).");
                          return;
                        }
                        if (colors.includes(hex)) {
                          alert("Este color ya ha sido agregado.");
                          return;
                        }
                        setColors([...colors, hex]);
                        setColorInput("");
                      }}
                      className="bg-navy text-white hover:bg-blue px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition"
                      style={{ backgroundColor: "#0B2545" }}
                    >
                      Añadir
                    </button>
                  </div>
                  {colors.length > 0 ? (
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-100 rounded-2xl select-none">
                      {colors.map((c, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center space-x-1.5 bg-white border border-gray-200 py-1 px-2.5 rounded-full shadow-sm"
                        >
                          <span 
                            className="w-3 h-3 rounded-full border border-gray-200" 
                            style={{ backgroundColor: c }}
                          />
                          <span className="text-[10px] font-mono text-gray-500 uppercase">{c}</span>
                          <button
                            type="button"
                            onClick={() => setColors(colors.filter((val) => val !== c))}
                            className="text-red-500 hover:text-red-700 text-xs font-bold pl-1.5 focus:outline-none"
                            title="Quitar color"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 italic">No se han definido colores para este producto (se mostrará por defecto sin variantes de color).</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageUploadPicker
                    label="Imagen 1 (Frente)"
                    value={image1}
                    onChange={(val) => setImage1(val)}
                    tip="Resolución sugerida: 800x1000px (Relación 4:5 vertical ideal para catálogo ecommerce)"
                  />
                  <ImageUploadPicker
                    label="Imagen 2 (Reverso)"
                    value={image2}
                    onChange={(val) => setImage2(val)}
                    tip="Resolución sugerida: 800x1000px (Ficha técnica o vista posterior de la prenda)"
                  />
                </div>
              </div>

              <footer className="p-6 border-t border-gray-100 flex-shrink-0 flex justify-end space-x-3 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition text-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-navy text-white hover:bg-blue px-6 py-3 rounded-xl text-xs font-serif tracking-wider uppercase font-bold transition duration-300 disabled:opacity-50"
                  style={{ backgroundColor: "#0B2545" }}
                >
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
