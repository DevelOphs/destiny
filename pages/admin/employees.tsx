import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/Admin/AdminLayout";
import SkeletonLoader from "@/components/UI/SkeletonLoader";

interface Employee {
  id: number;
  name: string;
  email: string;
  code: string;
  commissionPercentage: number;
  role: string;
  totalSalesCount: number;
  totalCommissions: number;
  status: number;
  createdAt: string;
}

export default function AdminEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Estados del Formulario (Creación)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("VENDEDOR");
  const [code, setCode] = useState("");
  const [commissionPercentage, setCommissionPercentage] = useState("5.0");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Estados del Formulario (Edición)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("VENDEDOR");
  const [editCode, setEditCode] = useState("");
  const [editCommissionPercentage, setEditCommissionPercentage] = useState("5.0");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      const res = await axios.get("/api/v1/employees", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data.data || []);
    } catch (err: any) {
      console.error("Error fetching employees:", err);
      setErrorMsg("Error al obtener la lista de empleados del servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    if (!name.trim() || !email.trim() || !password.trim() || !code.trim() || !commissionPercentage.trim()) {
      setSubmitError("Todos los campos son obligatorios.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      await axios.post(
        "/api/v1/employees",
        {
          name: name.trim(),
          email: email.trim(),
          password: password,
          role: role,
          code: code.trim().toUpperCase(),
          commissionPercentage: parseFloat(commissionPercentage)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Limpiar y Recargar
      setName("");
      setEmail("");
      setPassword("");
      setRole("VENDEDOR");
      setCode("");
      setCommissionPercentage("5.0");
      setShowAddModal(false);
      fetchEmployees();
    } catch (err: any) {
      console.error("Error creating employee:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setSubmitError(err.response.data.error);
      } else {
        setSubmitError("Ocurrió un error al intentar registrar al empleado.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (emp: Employee) => {
    setEditId(emp.id);
    setEditName(emp.name);
    setEditEmail(emp.email);
    setEditPassword(""); // Contraseña en blanco por defecto al editar
    setEditRole(emp.role);
    setEditCode(emp.code);
    setEditCommissionPercentage(emp.commissionPercentage.toString());
    setUpdateError("");
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError("");
    setIsUpdating(true);

    if (!editName.trim() || !editEmail.trim() || !editCode.trim() || !editCommissionPercentage.trim()) {
      setUpdateError("Los campos Nombre, Email, Código y Comisión son obligatorios.");
      setIsUpdating(false);
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      if (!token || !editId) return;

      const payload: any = {
        name: editName.trim(),
        email: editEmail.trim(),
        role: editRole,
        code: editCode.trim().toUpperCase(),
        commissionPercentage: parseFloat(editCommissionPercentage)
      };

      if (editPassword.trim() !== "") {
        payload.password = editPassword;
      }

      await axios.put(
        `/api/v1/employees/${editId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowEditModal(false);
      fetchEmployees();
    } catch (err: any) {
      console.error("Error updating employee:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setUpdateError(err.response.data.error);
      } else {
        setUpdateError("Ocurrió un error al intentar actualizar al empleado.");
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
        `/api/v1/employees/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchEmployees();
    } catch (err: any) {
      console.error("Error toggling employee status:", err);
      alert("Error al cambiar el estado del empleado.");
    }
  };

  const handleDeleteEmployee = async (id: number, employeeName: string) => {
    if (
      !confirm(
        `¿Está seguro de que desea desactivar al empleado "${employeeName.toUpperCase()}"?\n\nEsta acción ejecutará un borrado lógico en la base de datos.`
      )
    )
      return;

    const token = localStorage.getItem("admin_token");
    if (!token) return;

    try {
      setErrorMsg("");
      await axios.delete(`/api/v1/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees();
    } catch (err: any) {
      console.error("Error deleting employee:", err);
      alert("Error al intentar desactivar al empleado.");
    }
  };

  const filteredEmployees = employees.filter((e) => {
    const term = searchQuery.toLowerCase();
    return (
      e.name.toLowerCase().includes(term) ||
      e.email.toLowerCase().includes(term) ||
      e.code.toLowerCase().includes(term)
    );
  });

  return (
    <AdminLayout title="Comisiones de Empleados B2B">
      <div className="space-y-6">
        
        {/* Barra superior de controles */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 select-none">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Buscar por nombre, email o código..."
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
            Nuevo Empleado
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
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-sans text-sm select-none">
                No se encontraron empleados registrados.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans divide-y divide-gray-200">
                  <thead className="bg-lightnavy uppercase text-[10px] font-bold text-gray-400 tracking-wider select-none">
                    <tr>
                      <th className="p-5">Nombre</th>
                      <th className="p-5">Email</th>
                      <th className="p-5">Rol</th>
                      <th className="p-5">Código de Comisión</th>
                      <th className="p-5">Comisión (%)</th>
                      <th className="p-5">Ventas Referidas</th>
                      <th className="p-5">Total Acumulado</th>
                      <th className="p-5">Estado</th>
                      <th className="p-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-500">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-lightnavy/20 transition-colors duration-150">
                        <td className="p-5 font-bold text-navy" style={{ color: "#0B2545" }}>
                          {emp.name}
                        </td>
                        <td className="p-5 font-semibold text-gray-500">
                          {emp.email}
                        </td>
                        <td className="p-5 select-none">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${emp.role === "ADMIN" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"}`}>
                            {emp.role === "ADMIN" ? "ADMIN" : "VENDEDOR"}
                          </span>
                        </td>
                        <td className="p-5 font-semibold text-navy uppercase tracking-wider">
                          {emp.code}
                        </td>
                        <td className="p-5 font-semibold">
                          {emp.commissionPercentage}%
                        </td>
                        <td className="p-5 font-bold text-navy">
                          {emp.totalSalesCount}
                        </td>
                        <td className="p-5 font-bold text-navy" style={{ color: "#10B981" }}>
                          $ {emp.totalCommissions.toFixed(2)} USD
                        </td>
                        <td className="p-5 select-none">
                          <div className="flex items-center space-x-2">
                            {/* Toggle Switch */}
                            <div className="relative inline-block w-8 mr-1 align-middle select-none transition duration-200 ease-in">
                              <input
                                type="checkbox"
                                name={`toggle-${emp.id}`}
                                id={`toggle-${emp.id}`}
                                checked={emp.status === 1}
                                onChange={() => handleToggleStatus(emp.id, emp.status)}
                                className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border border-gray-300 appearance-none cursor-pointer focus:outline-none"
                                style={{
                                  transform: emp.status === 1 ? 'translateX(100%)' : 'translateX(0)',
                                  borderColor: emp.status === 1 ? '#0B2545' : '#D1D5DB',
                                  transition: 'transform 0.25s ease, border-color 0.25s ease'
                                }}
                              />
                              <label
                                htmlFor={`toggle-${emp.id}`}
                                className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer transition-colors duration-250 ${emp.status === 1 ? 'bg-navy' : 'bg-gray-300'}`}
                                style={{ backgroundColor: emp.status === 1 ? '#0B2545' : '#D1D5DB' }}
                              ></label>
                            </div>
                            <span className="text-[10px] font-bold text-gray-500 font-sans uppercase">
                              {emp.status === 1 ? "Activo" : "Inactivo"}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 select-none text-right">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => handleEditClick(emp)}
                              title="Editar Empleado"
                              className="p-1.5 hover:bg-blue-50 rounded-lg transition duration-150 outline-none"
                            >
                              <svg className="w-5 h-5 text-blue hover:text-blue/80" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "#134074" }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                              title="Desactivar Empleado"
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
                    Registrar Nuevo Empleado
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                    Acceso y Control de Comisiones B2B
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
                    <div className="mb-4 bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-xs font-semibold py-3 px-4 rounded-xl text-center animate-pulse">
                      {submitError}
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Nombre Completo del Empleado (Obligatorio)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. María López"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Correo Electrónico (Obligatorio / Único para Login)
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="maria.lopez@destiny.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Contraseña de Acceso (Obligatorio)
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Código de Comisión Único (Obligatorio)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. MARIA5"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Porcentaje de Comisión (%)
                      </label>
                      <input
                        type="number"
                        required
                        min="0.0"
                        step="0.1"
                        placeholder="Ej. 5.0"
                        value={commissionPercentage}
                        onChange={(e) => setCommissionPercentage(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Rol Asignado en el Sistema
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm bg-white"
                      >
                        <option value="VENDEDOR">VENDEDOR</option>
                        <option value="ADMIN">ADMINISTRADOR</option>
                      </select>
                    </div>
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
                    {isSubmitting ? "Registrando..." : "Registrar Empleado"}
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
                    Editar Empleado
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">
                    Modificar Acceso e Información del Empleado
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
                    <div className="mb-4 bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-xs font-semibold py-3 px-4 rounded-xl text-center animate-pulse">
                      {updateError}
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                      Nombre Completo del Empleado (Obligatorio)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. María López"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Correo Electrónico (Obligatorio / Único)
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="maria.lopez@destiny.com"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Nueva Contraseña (Opcional / Dejar en blanco para no cambiar)
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={editPassword}
                        onChange={(e) => setEditPassword(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Código de Comisión Único (Obligatorio)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. MARIA5"
                        value={editCode}
                        onChange={(e) => setEditCode(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Porcentaje de Comisión (%)
                      </label>
                      <input
                        type="number"
                        required
                        min="0.0"
                        step="0.1"
                        placeholder="Ej. 5.0"
                        value={editCommissionPercentage}
                        onChange={(e) => setEditCommissionPercentage(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Rol Asignado en el Sistema
                      </label>
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="w-full border border-gray-300 focus:border-blue p-3 outline-none rounded-xl text-sm bg-white"
                      >
                        <option value="VENDEDOR">VENDEDOR</option>
                        <option value="ADMIN">ADMINISTRADOR</option>
                      </select>
                    </div>
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
