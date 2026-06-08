import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/Admin/AdminLayout";
import SkeletonLoader from "@/components/UI/SkeletonLoader";

interface Coupon {
  id: number;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  usageLimit: number | null;
  usedCount: number;
  status: number;
  createdAt: string;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Estados del Formulario (Creación)
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Estados del Formulario (Edición)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editDiscountType, setEditDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [editDiscountValue, setEditDiscountValue] = useState("");
  const [editUsageLimit, setEditUsageLimit] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const res = await axios.get("/api/v1/coupons", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(res.data.data || []);
    } catch (err: any) {
      console.error("Error fetching coupons:", err);
      setErrorMsg("Error al obtener la lista de cupones del servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    if (!code.trim() || !discountValue.trim()) {
      setSubmitError("Los campos Código y Valor de Descuento son obligatorios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      await axios.post(
        "/api/v1/coupons",
        {
          code: code.trim().toUpperCase(),
          discountType,
          discountValue: parseFloat(discountValue),
          usageLimit: usageLimit.trim() ? parseInt(usageLimit, 10) : null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Limpiar y Recargar
      setCode("");
      setDiscountType("PERCENTAGE");
      setDiscountValue("");
      setUsageLimit("");
      setShowAddModal(false);
      fetchCoupons();
    } catch (err: any) {
      console.error("Error creating coupon:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError("Ocurrió un error al intentar crear el cupón.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (coupon: Coupon) => {
    setEditId(coupon.id);
    setEditCode(coupon.code);
    setEditDiscountType(coupon.discountType);
    setEditDiscountValue(coupon.discountValue.toString());
    setEditUsageLimit(coupon.usageLimit !== null ? coupon.usageLimit.toString() : "");
    setUpdateError("");
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError("");
    setIsUpdating(true);

    if (!editCode.trim() || !editDiscountValue.trim()) {
      setUpdateError("Los campos Código y Valor de Descuento son obligatorios.");
      setIsUpdating(false);
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      if (!token || !editId) return;

      await axios.put(
        `/api/v1/coupons/${editId}`,
        {
          code: editCode.trim().toUpperCase(),
          discountType: editDiscountType,
          discountValue: parseFloat(editDiscountValue),
          usageLimit: editUsageLimit.trim() ? parseInt(editUsageLimit, 10) : null
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowEditModal(false);
      fetchCoupons();
    } catch (err: any) {
      console.error("Error updating coupon:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setUpdateError(err.response.data.error);
      } else {
        setUpdateError("Ocurrió un error al intentar actualizar el cupón.");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      setErrorMsg("");
      await axios.put(
        `/api/v1/coupons/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchCoupons();
    } catch (err: any) {
      console.error("Error toggling coupon status:", err);
      alert("Error al cambiar el estado del cupón.");
    }
  };

  const handleDeleteCoupon = async (id: number, couponCode: string) => {
    if (
      !confirm(
        `¿Está seguro de que desea desactivar/eliminar el cupón "${couponCode.toUpperCase()}"?\n\nEsta acción ejecutará un borrado lógico en la base de datos.`
      )
    )
      return;

    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      setErrorMsg("");
      await axios.delete(`/api/v1/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons();
    } catch (err: any) {
      console.error("Error deleting coupon:", err);
      alert("Error al intentar desactivar el cupón.");
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    const term = searchQuery.toLowerCase();
    return c.code.toLowerCase().includes(term);
  });

  return (
    <AdminLayout title="Gestión de Cupones de Descuento">
      <div className="space-y-6">
        
        {/* Barra superior de controles */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 select-none">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Buscar por código..."
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
            Nuevo Cupón
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
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate__animated animate__fadeIn animate__faster">
            {filteredCoupons.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-sans text-sm select-none">
                No se encontraron cupones de descuento configurados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans divide-y divide-gray-200">
                  <thead className="bg-lightnavy uppercase text-[10px] font-bold text-gray-400 tracking-wider select-none">
                    <tr>
                      <th className="p-5">Código</th>
                      <th className="p-5">Tipo</th>
                      <th className="p-5">Valor</th>
                      <th className="p-5">Límite de Usos</th>
                      <th className="p-5">Usado</th>
                      <th className="p-5">Estado</th>
                      <th className="p-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-500">
                    {filteredCoupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-lightnavy/20 transition-colors duration-150">
                        <td className="p-5 font-bold text-navy uppercase tracking-wider" style={{ color: "#0B2545" }}>
                          {coupon.code}
                        </td>
                        <td className="p-5 font-semibold">
                          {coupon.discountType === "PERCENTAGE" ? "Porcentaje (%)" : "Valor Fijo ($)"}
                        </td>
                        <td className="p-5 font-bold text-navy">
                          {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `$ ${coupon.discountValue.toFixed(2)}`}
                        </td>
                        <td className="p-5 font-semibold">
                          {coupon.usageLimit !== null ? coupon.usageLimit : "Ilimitado"}
                        </td>
                        <td className="p-5 font-bold text-navy">
                          {coupon.usedCount}
                        </td>
                        <td className="p-5 select-none">
                          <div className="flex items-center space-x-2">
                            {/* Toggle Switch */}
                            <div className="relative inline-block w-8 mr-1 align-middle select-none transition duration-200 ease-in">
                              <input
                                type="checkbox"
                                name={`toggle-${coupon.id}`}
                                id={`toggle-${coupon.id}`}
                                checked={coupon.status === 1}
                                onChange={() => handleToggleStatus(coupon.id, coupon.status)}
                                className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border border-gray-300 appearance-none cursor-pointer focus:outline-none"
                                style={{
                                  transform: coupon.status === 1 ? 'translateX(100%)' : 'translateX(0)',
                                  borderColor: coupon.status === 1 ? '#0B2545' : '#D1D5DB',
                                  transition: 'transform 0.25s ease, border-color 0.25s ease'
                                }}
                              />
                              <label
                                htmlFor={`toggle-${coupon.id}`}
                                className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-250 ${coupon.status === 1 ? 'bg-navy' : 'bg-gray-300'}`}
                                style={{ backgroundColor: coupon.status === 1 ? '#0B2545' : '#D1D5DB' }}
                              ></label>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 font-sans uppercase">
                              {coupon.status === 1 ? "Activo" : "Inactivo"}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 select-none text-right">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => handleEditClick(coupon)}
                              title="Editar Cupón"
                              className="p-1.5 hover:bg-blue-50 rounded-lg transition duration-150 outline-none"
                            >
                              <svg className="w-5 h-5 text-blue hover:text-blue/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "#134074" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                              title="Eliminar Cupón"
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-full overflow-hidden animate__animated animate__zoomIn animate__faster">
              <header className="p-6 border-b border-gray-100 flex-shrink-0 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-navy font-serif uppercase tracking-wide" style={{ color: "#0B2545" }}>
                    Crear Nuevo Cupón
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                    Campañas de Descuento
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
                      Código del Cupón (Obligatorio)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. DESCUENTO10"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Tipo de Descuento
                      </label>
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value as "PERCENTAGE" | "FIXED")}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm bg-white"
                      >
                        <option value="PERCENTAGE">Porcentaje (%)</option>
                        <option value="FIXED">Valor Fijo ($ USD)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Valor del Descuento
                      </label>
                      <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="Ej. 10 para 10% o 10.00"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Límite de Usos (Opcional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Dejar en blanco para usos ilimitados"
                      value={usageLimit}
                      onChange={(e) => setUsageLimit(e.target.value)}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block font-semibold">
                      Evita abusos limitando el total de veces que este cupón puede ser canjeado por clientes.
                    </span>
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
                    {isSubmitting ? "Creando..." : "Crear Cupón"}
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
                    Editar Cupón
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                    Modificar Campaña de Descuento
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
                      Código del Cupón (Obligatorio)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. DESCUENTO10"
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Tipo de Descuento
                      </label>
                      <select
                        value={editDiscountType}
                        onChange={(e) => setEditDiscountType(e.target.value as "PERCENTAGE" | "FIXED")}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm bg-white"
                      >
                        <option value="PERCENTAGE">Porcentaje (%)</option>
                        <option value="FIXED">Valor Fijo ($ USD)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Valor del Descuento
                      </label>
                      <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="Ej. 10 para 10% o 10.00"
                        value={editDiscountValue}
                        onChange={(e) => setEditDiscountValue(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Límite de Usos (Opcional)
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Dejar en blanco para usos ilimitados"
                      value={editUsageLimit}
                      onChange={(e) => setEditUsageLimit(e.target.value)}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block font-semibold">
                      Evita abusos limitando el total de veces que este cupón puede ser canjeado por clientes.
                    </span>
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
