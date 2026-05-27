import React from "react";
import Button from "../Buttons/Button";
import { roundDecimal } from "../Util/utilFunc";
import { itemType } from "../../context/wishlist/wishlist-type";

type PaymentType = "CASH_ON_DELIVERY" | "BANK_TRANSFER" | "WHATSAPP_QUOTE" | "PAYPHONE_CARD";
type DeliveryType = "STORE_PICKUP" | "QUITO" | "PROVINCIAS";

/**
 * Propiedades requeridas para inicializar el resumen y despacho del pedido.
 */
interface OrderSummaryProps {
  cart: itemType[];                                           // Lista de productos en el carrito actual
  subtotal: number;                                          // Sumatorio base del costo de productos
  deli: DeliveryType;                                        // Tipo de entrega seleccionado
  setDeli: (value: DeliveryType) => void;
  deliFee: number;                                           // Recargo correspondiente por entrega
  paymentMethod: PaymentType;                                // Método de pago seleccionado por el cliente
  setPaymentMethod: (value: PaymentType) => void;
  sendEmail: boolean;                                        // Booleano para envío de factura fiscal
  setSendEmail: (value: boolean) => void;
  disableOrder: boolean;                                     // Booleano para inhabilitar el botón de submit si faltan campos
  onOrderSubmit: () => void;                                 // Acción para disparar el flujo del checkout
  orderError: string;                                        // Mensaje de error general de orden
  translationFunction: (key: string) => string;              // Función del diccionario de internacionalización
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  subtotal,
  deli,
  setDeli,
  deliFee,
  paymentMethod,
  setPaymentMethod,
  sendEmail,
  setSendEmail,
  disableOrder,
  onOrderSubmit,
  orderError,
  translationFunction: t,
}) => {
  // SVGs Premium para Métodos de Pago y Despachos (Cero Emojis)
  
  const WhatsAppIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.59 1.978 14.121 1.01 11.5 1.01 6.064 1.01 1.642 5.378 1.638 10.81c-.001 1.762.463 3.484 1.347 5.02L2.005 20.31l4.642-1.156zm12.021-7.24c-.33-.164-1.951-.955-2.254-1.064-.3-.109-.521-.164-.74.164-.221.328-.853 1.064-1.047 1.282-.194.218-.388.245-.718.082-1.28-.636-2.183-1.11-3.025-2.535-.221-.383.221-.356.632-1.168.077-.153.038-.287-.019-.405-.057-.118-.52-1.239-.713-1.693-.186-.45-.375-.389-.521-.389-.131-.008-.28-.008-.43-.008-.15 0-.393.055-.599.278-.206.223-.787.758-.787 1.848 0 1.09.8 2.14 1.09 2.53.29.39 1.55 2.33 3.73 3.27.52.22 1.02.37 1.37.48.52.16 1.01.14 1.39.08.43-.06 1.95-.79 2.22-1.52.28-.73.28-1.36.19-1.5-.09-.13-.33-.21-.66-.37z" />
    </svg>
  );

  const CreditCardIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );

  const BankIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V11M5 21V11M10 21V11M14 21V11M3 11h18M12 3L3 11h18L12 3zM3 21h18" />
    </svg>
  );

  const CashIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );

  return (
    <div className="w-full">
      <div className="border border-gray-100 p-8 divide-y divide-gray-200 shadow-2xl bg-white rounded-3xl">
        <h3 className="text-xl font-bold font-serif text-navy mb-4 border-b border-gray-100 pb-3 uppercase tracking-wider">
          2. Resumen del Pedido
        </h3>

        {/* Encabezados de Resumen */}
        <div className="flex justify-between font-bold text-xs uppercase mb-3 text-navy tracking-wider pt-2">
          <span>{t("product")}</span>
          <span>{t("subtotal")}</span>
        </div>

        {/* Listado de Ítems del Carrito */}
        <div className="pt-3 pb-3 space-y-3">
          {cart.map((item) => (
            <div className="flex justify-between items-center text-sm" key={item.id}>
              <span className="font-semibold text-gray-500">
                {item.name}{" "}
                <span className="text-blue font-bold text-xs ml-2 bg-lightnavy py-0.5 px-2 rounded-full">
                  x {item.qty}
                </span>
              </span>
              <span className="font-bold text-navy">
                $ {roundDecimal(item.price * item.qty!)}
              </span>
            </div>
          ))}
        </div>

        {/* Subtotal base */}
        <div className="py-3 flex justify-between text-sm font-semibold">
          <span className="uppercase text-gray-400 font-sans">{t("subtotal")}</span>
          <span className="text-navy font-bold">$ {subtotal}</span>
        </div>

        {/* Métodos de Despacho (Ecuador) */}
        <div className="py-4">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider font-sans">
            {t("delivery")}
          </span>
          <div className="mt-3 space-y-3 text-sm">
            {/* Opción 1: Retiro en bodega */}
            <div className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition cursor-pointer" style={{ backgroundColor: 'rgba(238, 244, 248, 0.2)' }}>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="deli"
                  value="STORE_PICKUP"
                  id="pickup"
                  checked={deli === "STORE_PICKUP"}
                  onChange={() => setDeli("STORE_PICKUP")}
                  className="text-blue focus:ring-blue cursor-pointer"
                />{" "}
                <label htmlFor="pickup" className="cursor-pointer font-semibold text-gray-500">
                  {t("store_pickup")}
                </label>
              </div>
              <span className="font-bold text-green uppercase text-xs">Gratis</span>
            </div>

            {/* Opción 2: Quito */}
            <div className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition cursor-pointer" style={{ backgroundColor: 'rgba(238, 244, 248, 0.2)' }}>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="deli"
                  value="QUITO"
                  id="ygn"
                  checked={deli === "QUITO"}
                  onChange={() => setDeli("QUITO")}
                  className="text-blue focus:ring-blue cursor-pointer"
                />{" "}
                <label htmlFor="ygn" className="cursor-pointer font-semibold text-gray-500">
                  Envío dentro de Quito
                </label>
              </div>
              <span className="font-bold text-navy">$ 2.00</span>
            </div>

            {/* Opción 3: Provincias */}
            <div className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition cursor-pointer" style={{ backgroundColor: 'rgba(238, 244, 248, 0.2)' }}>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="deli"
                  value="PROVINCIAS"
                  id="others"
                  checked={deli === "PROVINCIAS"}
                  onChange={() => setDeli("PROVINCIAS")}
                  className="text-blue focus:ring-blue cursor-pointer"
                />{" "}
                <label htmlFor="others" className="cursor-pointer font-semibold text-gray-500">
                  Envío a otras Provincias
                </label>
              </div>
              <span className="font-bold text-navy">$ 7.00</span>
            </div>
          </div>
        </div>

        {/* Gran Total */}
        <div>
          <div className="flex justify-between py-4 font-bold text-base text-navy font-serif tracking-wider border-b border-gray-100 mb-6">
            <span>{t("grand_total")}</span>
            <span>$ {roundDecimal(+subtotal + deliFee)} USD</span>
          </div>

          {/* Grilla Selectora de Métodos de Pago */}
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 font-sans">
            Método de Pago
          </h4>
          
          <div className="grid gap-4 mt-2 mb-6">
            {/* Pago 1: WhatsApp Cotización */}
            <label
              htmlFor="plan-whatsapp"
              className={`relative flex flex-col p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                paymentMethod === "WHATSAPP_QUOTE"
                  ? "border-blue bg-lightnavy ring-2 ring-blue ring-opacity-10 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-navy text-sm leading-tight flex items-center">
                  <WhatsAppIcon className="w-4 h-4 mr-2 text-green" />
                  WhatsApp Cotización B2B
                </span>
                {paymentMethod === "WHATSAPP_QUOTE" && (
                  <span className="font-bold text-blue bg-lightnavy py-0.5 px-2.5 rounded-full border border-blue border-opacity-20" style={{ fontSize: '9px' }}>
                    ACTIVO
                  </span>
                )}
              </div>
              <span className="text-gray-400 text-xs mt-2 leading-relaxed">
                Compra por volumen, requerimientos corporativos y uniformes del Estado. (Recomendado B2B).
              </span>
              <input
                type="radio"
                name="plan"
                id="plan-whatsapp"
                value="WHATSAPP_QUOTE"
                className="absolute h-0 w-0 appearance-none focus:outline-none"
                onChange={() => setPaymentMethod("WHATSAPP_QUOTE")}
              />
            </label>

            {/* Pago 2: Pasarela Tarjeta PayPhone */}
            <label
              htmlFor="plan-payphone"
              className={`relative flex flex-col p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                paymentMethod === "PAYPHONE_CARD"
                  ? "border-blue bg-lightnavy ring-2 ring-blue ring-opacity-10 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-navy text-sm leading-tight flex items-center">
                  <CreditCardIcon className="w-4 h-4 mr-2 text-blue" />
                  Tarjeta de Crédito / Débito
                </span>
                {paymentMethod === "PAYPHONE_CARD" && (
                  <span className="font-bold text-blue bg-lightnavy py-0.5 px-2.5 rounded-full border border-blue border-opacity-20" style={{ fontSize: '9px' }}>
                    ACTIVO
                  </span>
                )}
              </div>
              <span className="text-gray-400 text-xs mt-2 leading-relaxed">
                Pago seguro en línea para pedidos menores utilizando la pasarela protegida de PayPhone Ecuador.
              </span>
              <input
                type="radio"
                name="plan"
                id="plan-payphone"
                value="PAYPHONE_CARD"
                className="absolute h-0 w-0 appearance-none focus:outline-none"
                onChange={() => setPaymentMethod("PAYPHONE_CARD")}
              />
            </label>

            {/* Pago 3: Cuentas Bancarias */}
            <label
              htmlFor="plan-bank"
              className={`relative flex flex-col p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                paymentMethod === "BANK_TRANSFER"
                  ? "border-blue bg-lightnavy ring-2 ring-blue ring-opacity-10 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-navy text-sm leading-tight flex items-center">
                  <BankIcon className="w-4 h-4 mr-2 text-blue" />
                  Transferencia o Depósito
                </span>
                {paymentMethod === "BANK_TRANSFER" && (
                  <span className="font-bold text-blue bg-lightnavy py-0.5 px-2.5 rounded-full border border-blue border-opacity-20" style={{ fontSize: '9px' }}>
                    ACTIVO
                  </span>
                )}
              </div>
              <span className="text-gray-400 text-xs mt-2 leading-relaxed">
                Pago directo a nuestras cuentas autorizadas del Banco Pichincha o Produbanco.
              </span>
              <input
                type="radio"
                name="plan"
                id="plan-bank"
                value="BANK_TRANSFER"
                className="absolute h-0 w-0 appearance-none focus:outline-none"
                onChange={() => setPaymentMethod("BANK_TRANSFER")}
              />
            </label>

            {/* Pago 4: Contra entrega */}
            <label
              htmlFor="plan-cash"
              className={`relative flex flex-col p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${
                paymentMethod === "CASH_ON_DELIVERY"
                  ? "border-blue bg-lightnavy ring-2 ring-blue ring-opacity-10 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-navy text-sm leading-tight flex items-center">
                  <CashIcon className="w-4 h-4 mr-2 text-gray-400" />
                  {t("cash_on_delivery")}
                </span>
                {paymentMethod === "CASH_ON_DELIVERY" && (
                  <span className="font-bold text-blue bg-lightnavy py-0.5 px-2.5 rounded-full border border-blue border-opacity-20" style={{ fontSize: '9px' }}>
                    ACTIVO
                  </span>
                )}
              </div>
              <input
                type="radio"
                name="plan"
                id="plan-cash"
                value="CASH_ON_DELIVERY"
                className="absolute h-0 w-0 appearance-none focus:outline-none"
                onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
              />
            </label>
          </div>

          {/* Toggle Deslizable: Recibir comprobante digital */}
          <div className="my-6 flex items-center select-none p-3 rounded-xl border border-gray-100" style={{ backgroundColor: 'rgba(238, 244, 248, 0.3)' }}>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                name="send-email-toggle"
                id="send-email-toggle"
                checked={sendEmail}
                onChange={() => setSendEmail(!sendEmail)}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border border-gray-300 appearance-none cursor-pointer focus:outline-none"
              />
              <label
                htmlFor="send-email-toggle"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
            <label htmlFor="send-email-toggle" className="text-xs text-gray-700 font-semibold cursor-pointer font-sans">
              Recibir comprobante en mi correo
            </label>
          </div>
        </div>

        {/* Botón Principal de Confirmación */}
        <Button
          value={
            paymentMethod === "WHATSAPP_QUOTE"
              ? "Enviar Cotización a WhatsApp"
              : paymentMethod === "PAYPHONE_CARD"
              ? "Pagar de forma Segura con Tarjeta"
              : "Confirmar Pedido"
          }
          size="xl"
          extraClass="w-full !bg-navy hover:!bg-blue text-white border-navy font-serif tracking-wider uppercase py-4 select-none !rounded-2xl transition-all duration-300 font-bold active:scale-98"
          onClick={onOrderSubmit}
          disabled={disableOrder}
        />
      </div>

      {/* Alertas de error en la transacción */}
      {orderError !== "" && (
        <div className="bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-sm font-semibold py-3 px-4 rounded-xl mt-4">
          {orderError}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
