import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import { GetStaticProps } from "next";

// Importación de componentes estructurales de Header y Footer
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

// Importación de utilerías matemáticas
import { roundDecimal } from "../components/Util/utilFunc";

// Importación de estados y contextos de Carrito y Autenticación
import { useCart } from "../context/cart/CartProvider";
import { itemType } from "../context/wishlist/wishlist-type";
import { useAuth } from "../context/AuthContext";

// Importación de Subcomponentes Modulares de Checkout (SRP & <500 lineas de código)
import CheckoutForm from "../components/Checkout/CheckoutForm";
import BankAccountsCard from "../components/Checkout/BankAccountsCard";
import OrderSummary from "../components/Checkout/OrderSummary";
import OrderSuccess from "../components/Checkout/OrderSuccess";
import CreditCardModal from "../components/Checkout/CreditCardModal";

// Declaración de tipos estrictos
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
  couponCode?: string | null;
  employeeCode?: string | null;
}

const getColorName = (hex?: string) => {
  if (!hex) return "";
  const upperHex = hex.toUpperCase();
  const names: Record<string, string> = {
    "#4B5320": "Verde Oliva",
    "#000000": "Negro",
    "#C3B091": "Caqui / Tan",
    "#FFFFFF": "Blanco",
    "#FF0000": "Rojo",
    "#0000FF": "Azul",
    "#808080": "Gris",
    "#008000": "Verde",
    "#FFFF00": "Amarillo",
    "#FFA500": "Naranja",
    "#800080": "Morado",
    "#A52A2A": "Marrón",
    "#F0E68C": "Caqui Claro",
    "#2E8B57": "Verde Mar",
    "#1E90FF": "Azul Esquisto",
    "#36454F": "Gris Carbón",
  };
  return names[upperHex] || upperHex;
};

const ShoppingCart = () => {
  // ==========================================
  // ESTADOS Y CONTEXTOS GLOBALES DE APLICACIÓN
  // ==========================================
  const t = useTranslations("CartWishlist");
  const { cart, clearCart } = useCart();
  const auth = useAuth();

  // ==========================================
  // ESTADOS DE DESPACHO Y MÉTODOS DE PAGO
  // ==========================================
  const [deli, setDeli] = useState<DeliveryType>("STORE_PICKUP"); // Tipo de envío asignado
  const [paymentMethod, setPaymentMethod] = useState<PaymentType>("CASH_ON_DELIVERY"); // Método de pago

  // ==========================================
  // ESTADOS DE DATOS DEL CLIENTE
  // ==========================================
  const [name, setName] = useState(auth.user?.fullname || "");
  const [email, setEmail] = useState(auth.user?.email || "");
  const [phone, setPhone] = useState(auth.user?.phone || "");
  const [password, setPassword] = useState("");
  const [diffAddr, setDiffAddr] = useState(false);
  const [address, setAddress] = useState(auth.user?.shippingAddress || "");
  const [shippingAddress, setShippingAddress] = useState("");

  // ==========================================
  // ESTADOS DE FLUJO DE PEDIDO Y ERRORES
  // ==========================================
  const [isOrdering, setIsOrdering] = useState(false); // Bandera para procesar orden
  const [errorMsg, setErrorMsg] = useState("");         // Errores de registro de usuario
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null); // Datos de orden exitosa
  const [orderError, setOrderError] = useState("");     // Errores de transacciones
  const [sendEmail, setSendEmail] = useState(false);    // Check de envío de factura fiscal

  // ==========================================
  // ESTADOS DE CUPONES Y COMISIONES DE EMPLEADOS
  // ==========================================
  const [couponInput, setCouponInput] = useState("");
  const [employeeInput, setEmployeeInput] = useState("");
  const [couponCodeApplied, setCouponCodeApplied] = useState("");
  const [employeeCodeApplied, setEmployeeCodeApplied] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const [employeeSuccess, setEmployeeSuccess] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleApplyCoupon = async () => {
    setCouponError("");
    setCouponSuccess("");
    if (!couponInput.trim()) {
      setCouponError("Por favor ingrese un código de cupón.");
      setCouponCodeApplied("");
      setDiscountAmount(0);
      return;
    }

    try {
      const res = await axios.get(`/api/v1/coupons/validate?code=${encodeURIComponent(couponInput.trim())}`);
      if (res.data.success && res.data.valid) {
        const coupon = res.data.data;
        setCouponCodeApplied(coupon.code);
        let discount = 0;
        if (coupon.discountType === "PERCENTAGE") {
          discount = Number(subtotal) * (coupon.discountValue / 100);
        } else {
          discount = coupon.discountValue;
        }
        if (discount > Number(subtotal)) {
          discount = Number(subtotal);
        }
        const roundedDiscount = Number(roundDecimal(discount));
        setDiscountAmount(roundedDiscount);
        setCouponSuccess(`¡Cupón aplicado con éxito! Descuento: -$${roundedDiscount.toFixed(2)} USD`);
      } else {
        setCouponCodeApplied("");
        setDiscountAmount(0);
        setCouponError(res.data.error || "Cupón inválido.");
      }
    } catch (err) {
      console.error("Error applying coupon:", err);
      setCouponError("Ocurrió un error al validar el cupón.");
      setCouponCodeApplied("");
      setDiscountAmount(0);
    }
  };

  const handleApplyEmployee = async () => {
    setEmployeeError("");
    setEmployeeSuccess("");
    if (!employeeInput.trim()) {
      setEmployeeError("Por favor ingrese el código del vendedor.");
      setEmployeeCodeApplied("");
      return;
    }

    try {
      const res = await axios.get(`/api/v1/employees/validate?code=${encodeURIComponent(employeeInput.trim())}`);
      if (res.data.success && res.data.valid) {
        setEmployeeCodeApplied(res.data.data.code);
        setEmployeeSuccess(`Código válido. Asignado a: ${res.data.data.name}`);
      } else {
        setEmployeeCodeApplied("");
        setEmployeeError(res.data.error || "Código de vendedor inválido.");
      }
    } catch (err) {
      console.error("Error applying employee code:", err);
      setEmployeeError("Ocurrió un error al validar el código.");
      setEmployeeCodeApplied("");
    }
  };

  // ==========================================
  // ESTADOS DE UI PREMIUM
  // ==========================================
  const [isCardModalOpen, setIsCardModalOpen] = useState(false); // Apertura de modal PayPhone
  const [copiedBank, setCopiedBank] = useState<string | null>(null); // Copiado rápido bancario
  const orderPlacedRef = useRef(false);

  // ==========================================
  // CÓMPUTOS Y VALIDACIONES EN TIEMPO REAL
  // ==========================================
  const products = cart.map((item) => ({
    id: item.id,
    name: item.name,
    priceAtPurchase: item.price,
    quantity: item.qty,
    selectedColor: item.selectedColor,
  }));

  const subtotal = roundDecimal(
    cart.reduce(
      (accumulator: number, currentItem: itemType) =>
        accumulator + currentItem.price * currentItem.qty!,
      0
    )
  );

  let deliFee = 0;
  if (deli === "QUITO") {
    deliFee = 2.0;
  } else if (deli === "PROVINCIAS") {
    deliFee = 7.0;
  }

  // Verifica si el formulario base está debidamente relleno
  const isFormFilled = (): boolean => {
    const baseValid = name !== "" && email !== "" && phone !== "" && address !== "";
    if (!auth.user) {
      return baseValid && password !== "";
    }
    return baseValid;
  };

  const disableOrder = !isFormFilled() || isOrdering;

  // ==========================================
  // DISPATCHER DE COMPRAS CORPORATIVAS POR WHATSAPP B2B
  // ==========================================
  const handleWhatsAppQuote = () => {
    const formattedProducts = cart
      .map(
        (item, idx) => {
          const colorText = item.selectedColor ? ` - Color: ${getColorName(item.selectedColor)}` : "";
          return `${idx + 1}. *${item.name}* (x${item.qty} un.)${colorText} - P. Unitario: $${item.price} USD`;
        }
      )
      .join("\n");

    let pricingText = `*Subtotal:* $${subtotal} USD\n`;
    if (discountAmount > 0) {
      pricingText += `*Descuento (Cupón ${couponCodeApplied}):* -$${discountAmount.toFixed(2)} USD\n`;
    }
    pricingText += `*Cargos de Envío:* $${deliFee} USD (${deli === "STORE_PICKUP" ? "Retiro en Bodega" : deli === "QUITO" ? "Entrega en Quito" : "Envío a Provincias"})\n`;
    pricingText += `*Monto Estimado Total:* $${roundDecimal(Math.max(0, +subtotal - discountAmount) + deliFee)} USD`;
    if (employeeCodeApplied) {
      pricingText += `\n*Vendedor Referido:* ${employeeCodeApplied}`;
    }

    const message =
      `*SOLICITUD DE COTIZACIÓN - DESTINY / IJ DISTRIBUIDORA*\n\n` +
      `*Cliente / Razón Social:* ${name}\n` +
      `*Correo Electrónico:* ${email}\n` +
      `*Teléfono de Contacto:* ${phone}\n` +
      `*Dirección de Entrega:* ${shippingAddress ? shippingAddress : address}\n\n` +
      `*Detalle del Pedido Mayorista:*\n${formattedProducts}\n\n` +
      pricingText + `\n\n` +
      `*¡Hola! Requiero cotización formal y tiempos de entrega para este requerimiento.*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/593961044435?text=${encodedMessage}`;

    clearCart!();
    window.open(whatsappUrl, "_blank");

    setCompletedOrder({
      orderNumber: Math.floor(Math.random() * 900000) + 100000,
      customerId: auth.user?.id || 1,
      shippingAddress: shippingAddress ? shippingAddress : address,
      orderDate: new Date().toISOString(),
      paymentType: "WHATSAPP_QUOTE",
      deliveryType: deli,
      totalPrice: Number(roundDecimal(Math.max(0, +subtotal - discountAmount) + deliFee)),
      deliveryDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
      couponCode: couponCodeApplied || null,
      employeeCode: employeeCodeApplied || null
    });
  };

  // ==========================================
  // EVENTOS DEL SISTEMA Y REGISTRO DE ÓRDENES
  // ==========================================
  useEffect(() => {
    if (!isOrdering || completedOrder) return;
    setErrorMsg("");

    if (paymentMethod === "WHATSAPP_QUOTE") {
      handleWhatsAppQuote();
      setIsOrdering(false);
      return;
    }

    const registerUser = async () => {
      const regResponse = await auth.register!(
        email,
        name,
        password,
        address,
        phone
      );
      if (!regResponse.success) {
        setIsOrdering(false);
        if (regResponse.message === "alreadyExists") {
          setErrorMsg("email_already_exists");
        } else {
          setErrorMsg("error_occurs");
        }
        return false;
      }
    };
    if (!auth.user) registerUser();

    const makeOrder = async () => {
      if (orderPlacedRef.current) return;
      orderPlacedRef.current = true;

      const productsPayload = cart.map((item) => ({
        id: item.id,
        quantity: item.qty,
        selectedColor: item.selectedColor || null,
      }));

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
          {
            customerId: auth!.user?.id || 1,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            shippingAddress: shippingAddress ? shippingAddress : address,
            deliveryDate: new Date().setDate(new Date().getDate() + 7),
            paymentType: paymentMethod,
            deliveryType: deli,
            products: productsPayload,
            sendEmail,
            couponCode: couponCodeApplied || null,
            employeeCode: employeeCodeApplied || null,
          }
        );
        if (res.data.success) {
          setCompletedOrder(res.data.data);
          clearCart!();
          setIsOrdering(false);
        } else {
          orderPlacedRef.current = false; // reset en caso de fallo para permitir reintento
          setOrderError("error_occurs");
          setIsOrdering(false);
        }
      } catch (err: any) {
        console.error("Order creation failed:", err);
        orderPlacedRef.current = false; // reset en caso de fallo para permitir reintento
        const msg = err.response?.data?.error || "Ocurrió un error al procesar el pedido. Inténtelo de nuevo.";
        setOrderError(msg);
        setIsOrdering(false);
      }
    };
    if (auth.user) makeOrder();
  }, [isOrdering, auth.user]);

  // Vincula los campos del formulario si existe una sesión de usuario activa
  useEffect(() => {
    if (auth.user) {
      setName(auth.user.fullname);
      setEmail(auth.user.email);
      setAddress(auth.user.shippingAddress || "");
      setPhone(auth.user.phone || "");
    } else {
      setName("");
      setEmail("");
      setAddress("");
      setPhone("");
    }
  }, [auth.user]);



  // Manejador del portapapeles para copiar cuentas bancarias B2B
  const handleCopyAccount = (number: string, bankId: string) => {
    navigator.clipboard.writeText(number);
    setCopiedBank(bankId);
    setTimeout(() => {
      setCopiedBank(null);
    }, 2500);
  };

  return (
    <div className="bg-lightnavy font-sans text-gray500 min-h-screen" style={{ backgroundColor: 'rgba(238, 244, 248, 0.3)' }}>
      <Header title={`Finalizar Pedido - Destiny`} />

      <main id="main-content" className="pb-24">
        {/* Encabezado Principal */}
        <div className="app-max-width px-4 sm:px-8 md:px-20 w-full border-t border-gray100 bg-white shadow-sm py-4">
          <h1 className="text-3xl font-bold font-serif text-navy tracking-wider uppercase text-center sm:text-left">
            Finalizar Compra y Despacho
          </h1>
        </div>

        {/* Stepper de Progreso */}
        <div className="flex justify-between items-center max-w-xl mx-auto mb-10 mt-8 select-none font-sans px-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${isOrdering || completedOrder ? "bg-navy text-white" : "bg-blue text-white ring-4 ring-lightnavy"}`}>
              1
            </div>
            <span className="font-bold mt-2 uppercase tracking-widest text-navy" style={{ fontSize: '10px' }}>Despacho</span>
          </div>
          <div className="flex-auto h-0.5 bg-gray200 mx-4 rounded-full"></div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${completedOrder ? "bg-navy text-white" : isCardModalOpen || paymentMethod === "PAYPHONE_CARD" ? "bg-blue text-white ring-4 ring-lightnavy" : "bg-gray-200 text-gray-400"}`}>
              2
            </div>
            <span className="font-bold mt-2 uppercase tracking-widest text-gray-400" style={{ fontSize: '10px' }}>Pago Seguro</span>
          </div>
          <div className="flex-auto h-0.5 bg-gray200 mx-4 rounded-full"></div>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${completedOrder ? "bg-green text-white ring-4 ring-lightgreen" : "bg-gray-200 text-gray-400"}`}>
              3
            </div>
            <span className="font-bold mt-2 uppercase tracking-widest text-gray-400" style={{ fontSize: '10px' }}>Confirmación</span>
          </div>
        </div>

        {/* Renderizado Condicional de Flujo de Checkout */}
        {!completedOrder ? (
          <div className="app-max-width px-4 sm:px-8 md:px-20 mb-16 flex flex-col lg:flex-row items-start gap-10">
            {/* LADO IZQUIERDO: Formulario de Despacho e Información Bancaria B2B */}
            <div className="w-full lg:w-7/12 flex flex-col gap-6">
              {errorMsg !== "" && (
                <div className="bg-red bg-opacity-10 border border-red border-opacity-20 text-red text-sm font-semibold py-3 px-4 rounded-xl">
                  {t(errorMsg)}
                </div>
              )}
              
              <CheckoutForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                password={password}
                setPassword={setPassword}
                address={address}
                setAddress={setAddress}
                diffAddr={diffAddr}
                setDiffAddr={setDiffAddr}
                shippingAddress={shippingAddress}
                setShippingAddress={setShippingAddress}
                isAuthUser={!!auth.user}
                translationFunction={t}
              />

              {paymentMethod === "BANK_TRANSFER" && (
                <div id="cuentas-bancarias" className="scroll-mt-24 animate__animated animate__fadeInUp">
                  <BankAccountsCard
                    copiedBank={copiedBank}
                    onCopyAccount={handleCopyAccount}
                  />
                </div>
              )}
            </div>

            {/* LADO DERECHO: Resumen de Pedido, Despacho y Envío */}
            <div className="w-full lg:w-5/12 flex flex-col gap-6" id="seccion-resumen">
              <OrderSummary
                cart={cart}
                subtotal={+subtotal}
                deli={deli}
                setDeli={setDeli}
                deliFee={deliFee}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                sendEmail={sendEmail}
                setSendEmail={setSendEmail}
                disableOrder={disableOrder}
                onOrderSubmit={() => {
                  if (paymentMethod === "PAYPHONE_CARD") {
                    setIsCardModalOpen(true);
                  } else {
                    setIsOrdering(true);
                  }
                }}
                orderError={orderError}
                translationFunction={t}
                couponCode={couponInput}
                setCouponCode={setCouponInput}
                employeeCode={employeeInput}
                setEmployeeCode={setEmployeeInput}
                onApplyCoupon={handleApplyCoupon}
                onApplyEmployee={handleApplyEmployee}
                couponError={couponError}
                couponSuccess={couponSuccess}
                employeeError={employeeError}
                employeeSuccess={employeeSuccess}
                discountAmount={discountAmount}
              />
            </div>
          </div>
        ) : (
          <OrderSuccess
            completedOrder={completedOrder}
            name={name}
            email={email}
          />
        )}
      </main>

      {/* Modal Seguro de Tarjeta de Crédito */}
      <CreditCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        subtotal={+subtotal}
        deliFee={deliFee}
        onConfirmPayment={() => {
          setIsCardModalOpen(false);
          setIsOrdering(true);
        }}
      />

      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../messages/common/${locale || "es"}.json`)).default,
    },
  };
};

export default ShoppingCart;
