import { useState } from "react";
import { GetStaticProps } from "next";
import axios from "axios";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

// Custom vector SVGs (Zero Emojis)
const EnvelopeIcon = () => (
  <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.557-5.27-4-6.827-6.827l1.293-.97c.362-.272.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 12.008 0c3.237.001 6.279 1.262 8.566 3.551 2.287 2.289 3.546 5.333 3.546 8.571 0 6.677-5.325 12.001-12.006 12.001-2.007-.001-3.98-.5-5.753-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.422 9.863-9.864.001-2.637-1.03-5.114-2.905-6.99C16.486 1.86 14.015.828 11.378.828 5.939.828 1.517 5.25 1.514 10.692c-.001 1.716.453 3.39 1.317 4.872L1.83 20.83l5.068-1.33c.001-.001.002-.001.003-.001-.001 0-.001 0 0 0z" />
  </svg>
);

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg("Por favor, rellene todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post("/api/v1/contact", {
        name,
        email,
        phone,
        subject,
        message,
      });

      if (res.data.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } else {
        setErrorMsg("Hubo un problema al procesar su solicitud. Intente de nuevo.");
      }
    } catch (error) {
      setErrorMsg("Ocurrió un error inesperado de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-lightnavy/30 min-h-screen flex flex-col font-sans">
      {/* Global Header */}
      <Header title="Contacto - Destiny / IJ Distribuidora" />

      {/* Main Body */}
      <main className="flex-grow py-8 sm:py-12 px-4 sm:px-8 md:px-20 max-w-[1280px] mx-auto w-full">
        
        {/* Intro */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="text-blue font-bold text-xs uppercase tracking-widest">Contacto Directo</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-navy font-serif mt-2 mb-4">
            ¿Cómo podemos ayudarte?
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed font-sans font-medium">
            Si eres un cliente distribuidor B2B, una institución pública o un cliente particular, escríbenos y uno de nuestros asesores textiles te atenderá.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray100 shadow-xl p-6 sm:p-10">
            
            {success ? (
              /* Success State */
              <div className="flex flex-col items-center justify-center py-8 text-center animate__animated animate__fadeIn">
                <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center text-green mb-6 border border-green/20">
                  <CheckIcon />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-navy font-serif mb-3">
                  ¡Mensaje Enviado con Éxito!
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed mb-6 font-sans">
                  Muchas gracias por contactarte. Hemos registrado su consulta en el sistema local y un asesor comercial de Destiny le responderá en las próximas 24 horas laborables.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="py-2.5 px-6 rounded-xl bg-navy hover:bg-blue text-white text-xs sm:text-sm font-bold transition-all duration-300 active:scale-95 cursor-pointer shadow-md"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-lg sm:text-xl font-bold text-navy font-serif border-b border-gray100 pb-3 mb-6">
                  Enviar una Consulta
                </h3>

                {errorMsg && (
                  <div className="bg-red/10 border border-red/20 text-red text-xs sm:text-sm font-semibold p-3.5 rounded-xl font-sans">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Nombre / Razón Social *</label>
                    <input
                      type="text"
                      placeholder="Ej: Fransua Cordero"
                      className="w-full mt-1.5 border border-gray300 focus:border-blue bg-white py-2.5 px-4 outline-none rounded-xl text-sm font-sans focus:ring-2 focus:ring-lightnavy transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Correo Electrónico *</label>
                    <input
                      type="email"
                      placeholder="correo@empresa.com"
                      className="w-full mt-1.5 border border-gray300 focus:border-blue bg-white py-2.5 px-4 outline-none rounded-xl text-sm font-sans focus:ring-2 focus:ring-lightnavy transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="Ej: +593 9999 999"
                      className="w-full mt-1.5 border border-gray300 focus:border-blue bg-white py-2.5 px-4 outline-none rounded-xl text-sm font-sans focus:ring-2 focus:ring-lightnavy transition-all"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Asunto</label>
                    <input
                      type="text"
                      placeholder="Ej: Cotización Mayorista"
                      className="w-full mt-1.5 border border-gray300 focus:border-blue bg-white py-2.5 px-4 outline-none rounded-xl text-sm font-sans focus:ring-2 focus:ring-lightnavy transition-all"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-sans">Mensaje / Requerimiento *</label>
                  <textarea
                    rows={4}
                    placeholder="Escriba aquí los detalles de su consulta, volúmenes de compra o especificaciones técnicas de uniformes."
                    className="w-full mt-1.5 border border-gray300 focus:border-blue bg-white py-2.5 px-4 outline-none rounded-xl text-sm font-sans focus:ring-2 focus:ring-lightnavy transition-all resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold text-white uppercase tracking-wider transition-all duration-300 active:scale-98 flex items-center justify-center space-x-2 shadow-md cursor-pointer ${
                    loading ? "bg-gray300 cursor-not-allowed text-gray-400" : "bg-navy hover:bg-blue"
                  }`}
                >
                  {loading ? (
                    <span>Enviando...</span>
                  ) : (
                    <>
                      <span>Enviar Mensaje Comercial</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct B2B WhatsApp Call-to-action */}
            <div className="rounded-3xl bg-gradient-to-br from-green to-emerald-800 text-white p-6 sm:p-8 shadow-xl border border-white/10 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="text-[9px] font-bold text-navy bg-white py-0.5 px-2 rounded-full border uppercase tracking-wider select-none font-sans">Soporte Express B2B</span>
                <h3 className="text-xl sm:text-2xl font-bold font-serif leading-tight mt-3 mb-2 text-navy">
                  ¿Asesoría Directa por WhatsApp?
                </h3>
                <p className="text-xs text-navy/90 leading-relaxed font-sans font-semibold">
                  Acelera tus cotizaciones mayoristas e institucionales. Conversa directamente con el departamento de ventas a través de nuestro chat corporativo autorizado.
                </p>
              </div>

              <a
                href="https://wa.me/593999999999?text=Hola,%20requiero%20asesoria%20textil%20B2B%20para%20un%20pedido%20de%20uniformes."
                target="_blank"
                rel="noreferrer"
                className="mt-6 w-full py-3 bg-navy hover:bg-blue text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center shadow-lg hover:shadow-xl active:scale-98"
              >
                <WhatsAppIcon />
                Chat Comercial de Ventas
              </a>
            </div>

            {/* General Info Card */}
            <div className="bg-white rounded-3xl border border-gray100 shadow-xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-navy font-serif border-b border-gray100 pb-3">
                Información de Oficinas
              </h3>

              {/* Pin */}
              <div className="flex items-start space-x-3.5 text-xs sm:text-sm leading-relaxed text-gray-500">
                <div className="w-9 h-9 rounded-xl bg-lightnavy flex items-center justify-center flex-none text-blue">
                  <MapPinIcon />
                </div>
                <div>
                  <h4 className="font-bold text-navy">Dirección Principal (Ecuador):</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Av. de los Granados, Edificio Principal, Oficina 102, Quito, Ecuador.</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-3.5 text-xs sm:text-sm leading-relaxed text-gray-500">
                <div className="w-9 h-9 rounded-xl bg-lightnavy flex items-center justify-center flex-none text-blue">
                  <ClockIcon />
                </div>
                <div>
                  <h4 className="font-bold text-navy">Horarios Corporativos:</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Lunes a Sábado: 8:30 AM ~ 6:00 PM</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3.5 text-xs sm:text-sm leading-relaxed text-gray-500">
                <div className="w-9 h-9 rounded-xl bg-lightnavy flex items-center justify-center flex-none text-blue">
                  <PhoneIcon />
                </div>
                <div>
                  <h4 className="font-bold text-navy">Líneas de Atención Mayorista:</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Soporte: +593 99 999 9999</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3.5 text-xs sm:text-sm leading-relaxed text-gray-500">
                <div className="w-9 h-9 rounded-xl bg-lightnavy flex items-center justify-center flex-none text-blue">
                  <EnvelopeIcon />
                </div>
                <div>
                  <h4 className="font-bold text-navy">Correo Electrónico Oficial:</h4>
                  <p className="text-xs text-gray-400 mt-0.5">ventas@destinycorporativo.com</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Global Footer */}
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

export default Contact;
