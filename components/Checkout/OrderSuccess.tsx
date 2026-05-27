import React from "react";

type PaymentType = "CASH_ON_DELIVERY" | "BANK_TRANSFER" | "WHATSAPP_QUOTE" | "PAYPHONE_CARD";
type DeliveryType = "STORE_PICKUP" | "QUITO" | "PROVINCIAS";

interface Order {
  orderNumber: number;
  customerId: number;
  shippingAddress: string;
  township?: null | string;
  city?: null | string;
  state?: null | string;
  zipCode?: null | string;
  orderDate: string;
  paymentType: PaymentType;
  deliveryType: DeliveryType;
  totalPrice: number;
  deliveryDate: string;
}

/**
 * Propiedades requeridas para renderizar la pantalla de confirmación exitosa de pedido.
 */
interface OrderSuccessProps {
  completedOrder: Order;                                    // Datos de la orden ingresada exitosamente
  name: string;                                             // Nombre o Razón Social del cliente registrado
  email: string;                                            // Correo electrónico de contacto
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({
  completedOrder,
  name,
  email,
}) => {
  // SVGs Vectoriales Premium para la pantalla de éxito (Cero Emojis)
  
  const CheckIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

  const ShieldCheckIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );

  return (
    <div className="app-max-width px-4 sm:px-8 md:px-20 mb-16 mt-6 font-sans animate__animated animate__fadeIn">
      {/* Alerta de éxito elegante */}
      <div className="border border-green bg-green/5 p-6 rounded-2xl text-gray500 mb-8 flex items-center space-x-4">
        <div className="w-9 h-9 rounded-full bg-green text-navy flex items-center justify-center font-bold">
          <CheckIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-navy font-serif text-lg">¡Pedido Procesado con Éxito!</h4>
          <p className="text-sm text-gray-400 mt-0.5">
            Muchas gracias. Hemos ingresado su solicitud de pedido o cotización en el sistema.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* LADO IZQUIERDO: Tarjeta con los detalles financieros y de transacción */}
        <div className="h-full w-full md:w-1/2">
          <div className="border border-gray-200 p-6 divide-y divide-gray-200 shadow-xl bg-white rounded-2xl">
            <h3 className="text-lg font-bold font-serif text-navy mb-4 border-b border-gray-100 pb-2">
              Detalles de la Operación
            </h3>

            <div className="flex justify-between py-2.5 text-sm">
              <span className="font-medium text-gray-400">ID de Operación:</span>
              <span className="font-bold text-navy uppercase">#{completedOrder.orderNumber}</span>
            </div>

            <div className="pt-3 pb-3 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Cliente:</span>
                <span className="font-semibold text-navy">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Correo Registrado:</span>
                <span className="font-semibold text-navy">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Fecha de Operación:</span>
                <span className="font-semibold text-navy">
                  {new Date(completedOrder.orderDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Fecha Estimada de Entrega:</span>
                <span className="font-semibold text-navy">
                  {new Date(completedOrder.deliveryDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="py-3 text-sm space-y-2.5">
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Forma de Pago:</span>
                <span className="font-bold text-blue uppercase text-xs tracking-wider">
                  {completedOrder.paymentType === "WHATSAPP_QUOTE"
                    ? "Cotización WhatsApp"
                    : completedOrder.paymentType === "PAYPHONE_CARD"
                    ? "Tarjeta PayPhone"
                    : completedOrder.paymentType === "BANK_TRANSFER"
                    ? "Transferencia Bancaria"
                    : "Contra Entrega"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-400">Forma de Envío:</span>
                <span className="font-semibold text-navy uppercase text-xs tracking-wider">
                  {completedOrder.deliveryType === "STORE_PICKUP"
                    ? "Retiro en Bodega"
                    : completedOrder.deliveryType === "QUITO"
                    ? "Envío en Quito"
                    : "Envío a Provincias"}
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-between font-bold text-base text-navy font-serif border-t border-gray-200">
              <span className="uppercase">Total Operación</span>
              <span>$ {completedOrder.totalPrice} USD</span>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: Instrucciones logísticas y guías de post-venta */}
        <div className="h-full w-full md:w-1/2 text-sm leading-relaxed text-gray-400">
          <div className="bg-lightnavy p-6 border border-gray-200 rounded-2xl shadow-md">
            <h4 className="font-bold text-navy font-serif uppercase tracking-wider mb-2 border-b border-gray-200 pb-2 flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2 text-blue" />
              Instrucciones de Despacho
            </h4>

            {/* Instrucción WhatsApp B2B */}
            {completedOrder.paymentType === "WHATSAPP_QUOTE" && (
              <p className="mt-2 text-navy font-medium">
                Hemos auto-generado su solicitud formal de cotización y abrimos WhatsApp Web/App para enviar el resumen del requerimiento. Nuestro equipo de ventas revisará su volumen de compra y le enviará un correo con el descuento de distribuidor asignado.
              </p>
            )}

            {/* Instrucción Tarjeta de Crédito B2C */}
            {completedOrder.paymentType === "PAYPHONE_CARD" && (
              <p className="mt-2 text-green font-semibold">
                Su pago con tarjeta mediante la pasarela integrada de PayPhone se procesó exitosamente de forma encriptada. Los cargos se reflejarán a nombre de IJ DISTRIBUIDORA. En breve le enviaremos el comprobante fiscal y los datos de rastreo.
              </p>
            )}

            {/* Instrucción Transferencia Bancaria */}
            {completedOrder.paymentType === "BANK_TRANSFER" && (
              <div className="mt-2">
                <p>
                  Por favor, realice su depósito o transferencia bancaria en cualquiera de nuestras cuentas oficiales que se listan abajo. Luego, envíe el comprobante con su ID de operación a nuestro correo o vía WhatsApp para procesar y liberar su mercadería.
                </p>

                <div className="mt-4 border-t border-gray-200 pt-4 space-y-2">
                  <h5 className="font-bold text-navy uppercase text-xs tracking-wider">Cuentas Corrientes Autorizadas (Ecuador):</h5>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-500">Banco Pichincha:</span>
                    <span className="font-mono text-navy font-bold">CTA: 2201234567</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-500">Banco Produbanco:</span>
                    <span className="font-mono text-navy font-bold">CTA: 00101234567</span>
                  </div>
                  <span className="block text-[10px] text-gray-300 mt-2 font-sans">
                    Titular: IJ DISTRIBUIDORA S.A. | RUC: 1799999999001
                  </span>
                </div>
              </div>
            )}

            {/* Instrucción Contra entrega */}
            {completedOrder.paymentType === "CASH_ON_DELIVERY" && (
              <p className="mt-2">
                Su pedido se despachará en nuestro siguiente camión de distribución. Nuestro motorizado se contactará con usted al teléfono ingresado antes de realizar la entrega. Recuerde tener listo el valor correspondiente en efectivo al momento de recibir el paquete.
              </p>
            )}

            <p className="mt-6 border-t border-gray-200 pt-4 text-xs font-semibold text-navy text-right">
              Gracias por elegir Destiny como tu proveedor textil corporativo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
