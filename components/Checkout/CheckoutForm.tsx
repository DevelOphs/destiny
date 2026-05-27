import React from "react";
import Input from "../Input/Input";

/**
 * Propiedades requeridas para inicializar el componente de formulario de despacho.
 */
interface CheckoutFormProps {
  name: string;                                          // Nombre completo del cliente o Razón Social
  setName: (value: string) => void;
  email: string;                                         // Correo electrónico principal del cliente
  setEmail: (value: string) => void;
  phone: string;                                         // Teléfono o Razón Social para contacto
  setPhone: (value: string) => void;
  password?: string;                                     // Contraseña (requerido solo para registrar usuarios nuevos)
  setPassword?: (value: string) => void;
  address: string;                                       // Dirección fiscal o habitacional principal
  setAddress: (value: string) => void;
  diffAddr: boolean;                                     // Booleano que indica si la dirección de entrega es diferente
  setDiffAddr: (value: boolean) => void;
  shippingAddress: string;                               // Dirección de entrega alterna
  setShippingAddress: (value: string) => void;
  isAuthUser: boolean;                                   // Indica si el cliente ya inició sesión en la tienda
  translationFunction: (key: string) => string;         // Función del diccionario de internacionalización
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  password = "",
  setPassword = () => {},
  address,
  setAddress,
  diffAddr,
  setDiffAddr,
  shippingAddress,
  setShippingAddress,
  isAuthUser,
  translationFunction: t,
}) => {
  return (
    <div className="w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
      <h3 className="text-xl font-bold font-serif text-navy border-b border-gray-100 pb-3 mb-6 uppercase tracking-wider">
        1. Información de Despacho
      </h3>

      {/* Campo: Nombre Completo */}
      <div className="my-4">
        <label htmlFor="name" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {t("name")}
        </label>
        <Input
          name="name"
          type="text"
          extraClass="w-full mt-1 mb-2 border border-gray300 focus:border-blue !rounded-xl"
          value={name}
          onChange={(e) => setName((e.target as HTMLInputElement).value)}
          required
        />
      </div>

      {/* Campo: Correo Electrónico (Solo Lectura si el usuario está autenticado) */}
      <div className="my-4">
        <label htmlFor="email" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {t("email_address")}
        </label>
        <Input
          name="email"
          type="email"
          readOnly={isAuthUser}
          extraClass={`w-full mt-1 mb-2 !rounded-xl ${
            isAuthUser
              ? "bg-gray-100 border border-gray-200 cursor-not-allowed text-gray-400"
              : "border border-gray300 focus:border-blue"
          }`}
          value={email}
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
          required
        />
      </div>

      {/* Campo: Contraseña (Solo se muestra a visitantes no logueados para registrar cuenta) */}
      {!isAuthUser && (
        <div className="my-4">
          <label htmlFor="password" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {t("password")}
          </label>
          <Input
            name="password"
            type="password"
            extraClass="w-full mt-1 mb-2 border border-gray300 focus:border-blue !rounded-xl"
            value={password}
            onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
            required
          />
        </div>
      )}

      {/* Campo: Teléfono de Contacto */}
      <div className="my-4">
        <label htmlFor="phone" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {t("phone")}
        </label>
        <Input
          name="phone"
          type="text"
          extraClass="w-full mt-1 mb-2 border border-gray300 focus:border-blue !rounded-xl"
          value={phone}
          onChange={(e) => setPhone((e.target as HTMLInputElement).value)}
          required
        />
      </div>

      {/* Campo: Dirección Principal de Facturación */}
      <div className="my-4">
        <label htmlFor="address" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {t("address")}
        </label>
        <textarea
          id="address"
          aria-label="Address"
          className="w-full mt-1 mb-2 border border-gray-300 focus:border-blue p-4 outline-none transition-all duration-200 !rounded-xl text-sm"
          rows={3}
          value={address}
          onChange={(e) => setAddress((e.target as HTMLTextAreaElement).value)}
          required
        />
      </div>

      {/* Toggle Deslizable: Indicar si requiere entrega en dirección diferente */}
      <div className="flex items-center my-6 select-none">
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            name="toggle"
            id="toggle"
            checked={diffAddr}
            onChange={() => setDiffAddr(!diffAddr)}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border border-gray-300 appearance-none cursor-pointer focus:outline-none"
          />
          <label
            htmlFor="toggle"
            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
          ></label>
        </div>
        <label htmlFor="toggle" className="text-xs text-gray-700 font-semibold cursor-pointer">
          {t("different_shipping_address")}
        </label>
      </div>

      {/* Textarea opcional: Dirección Alternativa de Despacho */}
      {diffAddr && (
        <div className="my-4">
          <label htmlFor="shipping_address" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {t("shipping_address")}
          </label>
          <textarea
            id="shipping_address"
            aria-label="shipping address"
            className="w-full mt-1 mb-2 border border-gray-300 focus:border-blue p-4 outline-none transition-all duration-200 !rounded-xl text-sm animate__animated animate__fadeInDown animate__faster"
            rows={3}
            value={shippingAddress}
            onChange={(e) => setShippingAddress((e.target as HTMLTextAreaElement).value)}
            required
          />
        </div>
      )}

      {/* Nota legal al pie para visitantes no logueados */}
      {!isAuthUser && (
        <div className="text-xs text-gray-400 mt-8 leading-6 p-4 rounded-xl border border-gray-100 font-sans" style={{ backgroundColor: 'rgba(238, 244, 248, 0.4)' }}>
          {t("form_note")}
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;
