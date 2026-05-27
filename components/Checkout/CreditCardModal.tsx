import React, { useState } from "react";
import { roundDecimal } from "../Util/utilFunc";

/**
 * Propiedades requeridas para inicializar el componente CreditCardModal.
 * Todas las variables tienen tipado explícito y nomenclatura clara.
 */
interface CreditCardModalProps {
  isOpen: boolean;            // Determina si el modal está visible
  onClose: () => void;        // Función para cerrar el modal
  subtotal: number;           // Costo base de los productos en el carrito
  deliFee: number;            // Costo asignado por envío/despacho
  onConfirmPayment: () => void; // Callback al confirmar y validar el pago
}

const CreditCardModal: React.FC<CreditCardModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  deliFee,
  onConfirmPayment,
}) => {
  // ==========================================
  // ESTADOS DEL FORMULARIO (Nombres Legibles)
  // ==========================================
  const [numeroTarjeta, setNumeroTarjeta] = useState(""); // Número de tarjeta (con formato de espacios)
  const [nombreTitular, setNombreTitular] = useState(""); // Nombre del titular tal como figura en el plástico
  const [fechaExpiracion, setFechaExpiracion] = useState(""); // Fecha en formato MM/AA
  const [codigoSeguridad, setCodigoSeguridad] = useState(""); // CVV de 3 o 4 dígitos (encriptado visualmente en input)

  // Si el modal no está activo, retornamos nulo para evitar sobrecarga del árbol DOM
  if (!isOpen) return null;

  // ==========================================
  // FUNCIONES DE FORMATEO Y UTILERÍAS
  // ==========================================

  /**
   * Formatea la entrada del número de tarjeta agregando un espacio cada 4 dígitos.
   * Limita la longitud total a un máximo de 16 dígitos numéricos (19 caracteres con espacios).
   */
  const handleNumeroTarjetaChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;
    let valorLimpio = inputElement.value.replace(/\D/g, ""); // Remueve cualquier caracter que no sea número

    if (valorLimpio.length > 16) {
      valorLimpio = valorLimpio.slice(0, 16);
    }

    // Inserta un espacio en blanco cada 4 dígitos para legibilidad del usuario
    const numeroFormateado = valorLimpio.replace(/(.{4})/g, "$1 ").trim();
    setNumeroTarjeta(numeroFormateado);
  };

  /**
   * Formatea la fecha de expiración insertando automáticamente una barra inclinada "/"
   * después de los primeros dos dígitos (mes). Limita la entrada a 4 dígitos (MM/AA).
   */
  const handleExpiracionChange = (e: React.FormEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;
    let valorLimpio = inputElement.value.replace(/\D/g, ""); // Remueve caracteres no numéricos

    if (valorLimpio.length > 4) {
      valorLimpio = valorLimpio.slice(0, 4);
    }

    if (valorLimpio.length >= 2) {
      valorLimpio = valorLimpio.slice(0, 2) + "/" + valorLimpio.slice(2);
    }
    setFechaExpiracion(valorLimpio);
  };

  /**
   * Evalúa la validez de los datos de la tarjeta utilizando criterios estándar de longitud
   * y presencia de campos, previniendo submits accidentales con campos incompletos.
   */
  const esTarjetaValida = (): boolean => {
    const numeroSinEspacios = numeroTarjeta.replace(/\s+/g, "");
    const esNumeroCorrecto = numeroSinEspacios.length >= 15; // Amex usa 15 dígitos, Visa/MC usan 16
    const esNombreRelleno = nombreTitular.trim() !== "";
    const esExpiracionCompleta = fechaExpiracion.length === 5;
    const esCvvValido = codigoSeguridad.length >= 3;

    return esNumeroCorrecto && esNombreRelleno && esExpiracionCompleta && esCvvValido;
  };

  /**
   * Identifica la marca emisora de la tarjeta en base a los dígitos iniciales.
   * Utilizado para renderizar dinámicamente los logotipos oficiales en el mockup de la tarjeta virtual.
   */
  const detectarEmisorTarjeta = (numero: string): string => {
    const numeroLimpio = numero.replace(/\s+/g, "");
    if (/^4/.test(numeroLimpio)) return "visa";
    if (/^5[1-5]/.test(numeroLimpio)) return "mastercard";
    if (/^3[47]/.test(numeroLimpio)) return "amex";
    if (/^3(?:0[0-5]|[68])/.test(numeroLimpio)) return "diners";
    return "desconocido";
  };

  /**
   * Manejador de evento submit. Valida la tarjeta y delega la ejecución de la orden al checkout principal.
   */
  const procesarConfirmacionPago = (e: React.FormEvent) => {
    e.preventDefault();
    if (esTarjetaValida()) {
      onConfirmPayment();
    }
  };

  // ==========================================
  // COMPONENTES ICONOGRÁFICOS SVG (Cero Emojis)
  // ==========================================

  // Icono vectorial de candado de seguridad
  const IconoSeguridadLock = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );

  // Icono vectorial de cruz fina de cierre
  const IconoCierreClose = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  // Icono vectorial de escudo de confianza
  const IconoEscudoConfianza = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );

  // Isotipo del chip dorado de tarjeta inteligente con gradiente SVG
  const ChipDoradoTarjetaSVG = () => (
    <svg className="w-10 h-7 sm:w-11 sm:h-8 rounded" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="36" rx="6" fill="url(#degradadoChip)" />
      <path d="M0 12H14M0 24H14M14 0V36M34 0V36M34 12H48M34 24H48M14 18H34" stroke="#4E3600" strokeWidth="1.5" opacity="0.35" />
      <rect x="18" y="10" width="12" height="16" rx="2.5" fill="#E4C15E" stroke="#A7851C" strokeWidth="1" />
      <defs>
        <linearGradient id="degradadoChip" x1="0" y1="0" x2="48" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE59E" />
          <stop offset="50%" stopColor="#D8AF44" />
          <stop offset="100%" stopColor="#9C7716" />
        </linearGradient>
      </defs>
    </svg>
  );

  // Renderizador condicional de logos oficiales bancarios según el emisor detectado
  const renderizarLogoMarcaTarjeta = (emisor: string) => {
    switch (emisor) {
      case "visa":
        return (
          <svg className="h-5 sm:h-6 w-12 sm:w-14 fill-current text-white animate__animated animate__fadeIn" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.2 3L14.7 17.5H10.9L7.2 5.5C6.9 4.7 6.7 4.4 6 4C4.9 3.4 3.1 2.9 1.5 2.5L1.6 2H8.3C9.3 2 10.2 2.7 10.4 3.7L12.4 14.1L16.2 3H19.2ZM35.4 9.9C35.4 6.7 31 6.5 31.1 5.1C31.2 4.7 31.6 4.3 32.5 4.2C33 4.1 34.3 4 35.5 4.6L36.1 2.1C34.6 1.5 32.7 1.4 31.1 1.4C28.2 1.4 26.2 3 26.1 5.3C26 7 28 8 29.3 8.7C30.6 9.3 31.1 9.7 31.1 10.3C31 11.2 29.9 11.6 28.9 11.6C27.4 11.6 26 11.2 25.4 10.9L24.8 13.5C26.3 14.2 28.1 14.4 29.9 14.4C32.9 14.4 35.4 12.9 35.4 9.9ZM46.5 2.1H43.5C42.6 2.1 41.9 2.6 41.5 3.4L36.3 15.9H40.2L41 13.6H45.8L46.2 15.9H49.7L46.5 2.1ZM41.8 10.8L43.8 5.2L45 10.8H41.8ZM25.4 2.1H21.8L19.2 15.9H23L25.4 2.1Z" fill="#FFFFFF" />
            <path d="M7.2 5.5L1.6 2L1.5 2.1L7.2 15.9H11L13 5.5L7.2 5.5Z" fill="#F7B600" />
          </svg>
        );
      case "mastercard":
        return (
          <svg className="h-5 sm:h-6 w-9 sm:w-11 animate__animated animate__fadeIn" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#EB001B" />
            <circle cx="24" cy="12" r="10" fill="#F79E1B" fillOpacity="0.85" />
            <path d="M18 12C18 9.5 19 7.3 20.6 5.8C22.2 7.3 23.2 9.5 23.2 12C23.2 14.5 22.2 16.7 20.6 18.2C19 16.7 18 14.5 18 12Z" fill="#FF5F00" />
          </svg>
        );
      case "amex":
        return (
          <svg className="h-5 sm:h-6 w-9 sm:w-11 animate__animated animate__fadeIn" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="24" rx="4" fill="#0070CD" />
            <text x="5" y="15" fill="#FFFFFF" fontSize="8" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">AMEX</text>
          </svg>
        );
      case "diners":
        return (
          <svg className="h-5 sm:h-6 w-9 sm:w-11 animate__animated animate__fadeIn" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="24" rx="4" fill="#0079C1" />
            <text x="3" y="15" fill="#FFFFFF" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.2">DINERS</text>
          </svg>
        );
      default:
        // Renderiza un icono de tarjeta genérico translúcido si la marca aún no es descifrada
        return (
          <svg className="h-5 sm:h-6 w-8 sm:w-10 text-white/30 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="1.5">
            <rect x="2" y="5" width="20" height="14" rx="3" />
            <line x1="2" y1="10" x2="22" y2="10" />
          </svg>
        );
    }
  };

  // ==========================================
  // ESTRUCTURA MAQUETA RESPONSIVA (HTML/CSS)
  // ==========================================
  return (
    // Backdrop del modal (Fondo oscuro transparente) - Cumple estrictamente las pautas
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate__animated animate__fadeIn">
      {/* Cierre del Modal al hacer click fuera de la caja blanca principal */}
      <div className="fixed inset-0 cursor-default" onClick={onClose}></div>

      {/* Caja del Pop-Up con clases Tailwind específicas exigidas, limitada a max-h-[90vh] para laptop */}
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl relative z-50 flex flex-col animate__animated animate__zoomIn animate__faster">

        {/* Cabecera Fija del Modal */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-100 bg-lightnavy/50 flex-none">
          <h3 className="text-base sm:text-lg font-bold text-navy font-serif tracking-wide flex items-center">
            <IconoSeguridadLock className="w-4 h-4 mr-2 text-blue" />
            Pago Seguro con Tarjeta
          </h3>

          <button
            type="button"
            className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray400 hover:text-red outline-none cursor-pointer active:scale-90"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <IconoCierreClose className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>

        {/* Formulario e inputs con scroll interno controlado para resguardar la altura útil (max-h-[60vh] del form body) */}
        <form onSubmit={procesarConfirmacionPago} className="flex-1 flex flex-col overflow-hidden">

          {/* Cuerpo Desplazable Interno (Espacioso y con respiración, gracias a que el footer está limpio de textos) */}
          <div className="p-5 sm:p-6 overflow-y-auto max-h-[58vh] scrollbar-thin">

            {/* VISTA PREVIA DE TARJETA VIRTUAL (Mockup premium con relación de aspecto que escala fluidamente) */}
            <div className="relative w-full max-w-[260px] sm:max-w-[290px] aspect-[1.586/1] mb-5 select-none font-mono tracking-widest mx-auto animate__animated animate__flipInX">
              <div
                className="relative w-full h-full text-white shadow-lg rounded-xl border border-white/10 overflow-hidden p-4 sm:p-5 flex flex-col justify-between"
                style={{
                  background: "linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "0.85rem",
                }}
              >
                <div className="absolute top-0 right-0 w-22 h-22 sm:w-26 sm:h-26 bg-white/5 rounded-full -mr-5 -mt-5 pointer-events-none"></div>

                <div className="flex justify-between items-start">
                  {/* Isotipo Chip */}
                  <div className="transform scale-80 sm:scale-95 origin-left">
                    <ChipDoradoTarjetaSVG />
                  </div>

                  {/* Logo de Marca Dinámico */}
                  <div className="transition-all duration-300 transform scale-80 sm:scale-95 origin-right">
                    {renderizarLogoMarcaTarjeta(detectarEmisorTarjeta(numeroTarjeta))}
                  </div>
                </div>

                {/* Número Impreso (Se auto-espacia en tiempo real) */}
                <div className="my-1.5 sm:my-2">
                  <span className="text-xs sm:text-sm md:text-base font-semibold block text-center font-mono tracking-wider sm:tracking-widest text-gray-100">
                    {numeroTarjeta || "•••• •••• •••• ••••"}
                  </span>
                </div>

                <div className="flex justify-between items-end text-white/80">
                  {/* Titular */}
                  <div className="flex flex-col min-w-0 flex-1 mr-2">
                    <span className="text-[5.5px] sm:text-[6.5px] uppercase tracking-wider text-gray-400 font-sans">Titular</span>
                    <span className="text-[8.5px] sm:text-[10px] font-semibold tracking-wider font-sans uppercase truncate text-white">
                      {nombreTitular || "Tu Nombre Completo"}
                    </span>
                  </div>
                  {/* Expiración */}
                  <div className="flex flex-col text-right flex-none">
                    <span className="text-[5.5px] sm:text-[6.5px] uppercase tracking-wider text-gray-400 font-sans">Expiración</span>
                    <span className="text-[8.5px] sm:text-[10px] font-semibold font-mono text-white">
                      {fechaExpiracion || "MM/AA"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE INPUTS ESPACIOSA Y CON RESPIRACIÓN (Distribución horizontal óptima en computadoras) */}
            <div className="space-y-3">

              {/* Número de Tarjeta */}
              <div className="my-2">
                <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Número de Tarjeta</label>
                <input
                  type="text"
                  placeholder="4000 1234 5678 9010"
                  maxLength={19}
                  className="w-full mt-1.5 border border-gray-300 focus:border-blue bg-white py-2 px-3 outline-none rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-lightnavy transition-all"
                  value={numeroTarjeta}
                  onChange={handleNumeroTarjetaChange}
                  required
                />
              </div>

              {/* Fila de campos secundarios (Nombre, Expiración y CVV fusionados) */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-2">

                {/* Nombre de Titular (Ocupa el 50% de la fila en computadoras) */}
                <div className="sm:col-span-2">
                  <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Titular de Tarjeta</label>
                  <input
                    type="text"
                    placeholder="Como figura en el plástico"
                    className="w-full mt-1.5 border border-gray-300 focus:border-blue bg-white py-2 px-3 outline-none rounded-xl text-xs sm:text-sm uppercase font-sans focus:ring-2 focus:ring-lightnavy transition-all"
                    value={nombreTitular}
                    onChange={(e) => setNombreTitular(e.target.value)}
                    required
                  />
                </div>

                {/* Expiración (Ocupa el 25% de la fila) */}
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Expiración</label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    className="w-full mt-1.5 border border-gray-300 focus:border-blue bg-white py-2 px-3 outline-none rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-lightnavy transition-all"
                    value={fechaExpiracion}
                    onChange={handleExpiracionChange}
                    required
                  />
                </div>

                {/* Código de Seguridad (Ocupa el 25% de la fila) */}
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={4}
                    className="w-full mt-1.5 border border-gray-300 focus:border-blue bg-white py-2 px-3 outline-none rounded-xl text-xs sm:text-sm font-mono focus:ring-2 focus:ring-lightnavy transition-all"
                    value={codigoSeguridad}
                    onChange={(e) => setCodigoSeguridad(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Cuadro Resumen de Monto a Debitar con Escudo de Seguridad Integrado */}
            <div className="bg-lightnavy/50 p-3 rounded-xl border border-gray100 mt-4 text-xs sm:text-sm flex justify-between items-center shadow-sm relative">
              <span className="font-semibold text-gray-500 font-sans">Total a Debitar:</span>
              
              <div className="flex items-center space-x-2.5">
                {/* ESCUDO DE SEGURIDAD INTERACTIVO CON TOOLTIP FLOTANTE (Sin texto estático, más grande) */}
                <div className="relative group flex items-center cursor-pointer">
                  <span className="flex items-center justify-center p-1.5 rounded-full bg-green/10 text-green border border-green/20 hover:bg-green/25 transition-all select-none animate__animated animate__pulse animate__infinite animate__slow">
                    <IconoEscudoConfianza className="w-5 h-5 text-green" />
                  </span>

                  {/* Tooltip absoluto que flota hacia arriba (bottom-full) para evitar clipping */}
                  <div className="absolute bottom-full right-0 mb-2.5 w-72 sm:w-80 bg-navy text-white text-[9.5px] sm:text-[10px] p-4 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none leading-relaxed border border-white/10">
                    {/* Flecha decorativa inferior apuntando al escudo */}
                    <div className="absolute top-full right-3.5 border-4 border-transparent border-t-navy"></div>
                    <strong>Conexión segura de 256 bits.</strong> Los datos de su transacción están totalmente protegidos de manera cifrada. Cumplimos con el estándar internacional PCI-DSS y la verificación de identidad 3D-Secure. Procesado bajo el respaldo de PayPhone Ecuador.
                  </div>
                </div>

                <span className="font-bold text-navy font-serif tracking-wide">$ {roundDecimal(+subtotal + deliFee)} USD</span>
              </div>
            </div>
          </div>

          {/* Pie de Página Fijo (Botones de Cancelar y Confirmación) */}
          <div className="flex flex-col sm:flex-row items-center justify-end px-4 sm:px-6 py-3 border-t border-gray-100 bg-lightnavy/30 gap-2 sm:space-x-3 sm:gap-0 flex-none">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-2 px-4 text-xs sm:text-sm font-semibold rounded-xl text-navy hover:bg-gray-200 transition-all active:scale-95 text-center order-2 sm:order-1 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!esTarjetaValida()}
              className={`w-full sm:w-auto py-2.5 px-5 text-xs sm:text-sm font-bold rounded-xl text-white transition-all duration-300 active:scale-95 flex items-center justify-center space-x-1.5 order-1 sm:order-2 ${esTarjetaValida()
                  ? "bg-navy hover:bg-blue shadow-md cursor-pointer"
                  : "bg-gray300 text-gray400 cursor-not-allowed"
                }`}
            >
              <IconoSeguridadLock className="w-3.5 h-3.5 text-white" />
              <span>Confirmar Pago Seguro</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreditCardModal;
