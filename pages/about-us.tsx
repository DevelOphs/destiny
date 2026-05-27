import { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

// Custom vector SVGs (Zero Emojis)
const ImportIcon = () => (
  <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-.554-8.243-1.558m16.516 0t-1.528-4.865a9.003 9.003 0 00-13.46 0L3.5 8.942" />
  </svg>
);

const TailorIcon = () => (
  <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
  </svg>
);

const LogisticsIcon = () => (
  <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25M3 14.25h15m0 0V8.25m0 0h-.879a1.5 1.5 0 01-1.06-.44l-2.122-2.122A1.5 1.5 0 0013.06 5.25H9.75M18 14.25h3.75a1.125 1.125 0 001.125-1.125V11.25m-19.5 0h16.5" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6 text-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
);

const AboutUs = () => {
  const t = useTranslations("Navigation");

  return (
    <div className="bg-lightnavy/30 min-h-screen flex flex-col font-sans">
      {/* Global Header */}
      <Header title="Quiénes Somos - Destiny / IJ Distribuidora" />

      {/* Main Body */}
      <main className="flex-grow pt-8 pb-16">
        
        {/* Editorial Hero Banner */}
        <section className="app-max-width px-4 sm:px-8 md:px-20 mb-14">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-navy to-blue text-white p-8 sm:p-12 md:p-16 flex flex-col justify-center min-h-[320px] sm:min-h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
            
            <span className="text-yellow font-bold text-xs sm:text-sm uppercase tracking-widest mb-3">IJ DISTRIBUIDORA</span>
            <h1 className="text-3xl sm:text-5xl font-bold font-serif leading-tight mb-6">
              Destiny: Confección & Importación Textil Corporativa
            </h1>
            <p className="text-sm sm:text-base max-w-2xl text-gray100/90 leading-relaxed font-sans font-medium">
              Somos un aliado estratégico textil en el Ecuador, dedicados a la confección premium, importación de insumos técnicos y comercialización de productos de alta durabilidad para empresas corporativas, instituciones del Estado y el día a día.
            </p>
          </div>
        </section>

        {/* Corporate History / Editorial Description */}
        <section className="app-max-width px-4 sm:px-8 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 mb-16 items-center">
          <div>
            <span className="text-blue font-bold text-xs uppercase tracking-widest block mb-2">Nuestra Trayectoria</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy font-serif mb-6 leading-snug">
              Moda y resistencia técnica hechas a la medida de tu organización
            </h2>
            <div className="text-sm text-gray-500 space-y-5 leading-relaxed font-sans">
              <p>
                Fundada sobre los pilares del servicio riguroso y la selección impecable de fibras, **Destiny (bajo el respaldo de IJ Distribuidora S.A.)** ha consolidado su posición en el mercado nacional proveyendo indumentaria que combina a la perfección la estética moderna con las exigencias del trabajo pesado.
              </p>
              <p>
                Nos especializamos en cubrir desde prendas de vestir administrativas de alta gama hasta equipamiento militar y policial táctico de máxima exigencia. Cada hilo, costura y cremallera es auditada bajo los estándares internacionales más estrictos para garantizar un desempeño excepcional en cualquier clima y escenario del Ecuador.
              </p>
            </div>
          </div>
          
          {/* Asymmetric Graphic Block */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-gray100 shadow-xl flex flex-col justify-between min-h-[300px]">
            <div className="absolute top-4 right-4 text-blue/10 transform rotate-12 scale-150 pointer-events-none">
              <ShieldIcon />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-blue font-bold text-xs tracking-wider uppercase">
                <ShieldIcon />
                <span>Garantía Asegurada</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-navy font-serif leading-tight">
                Compromiso absoluto con las licitaciones públicas y el sector corporativo privado.
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                Contamos con procesos de control de calidad estandarizados y fichas técnicas robustas en PDF que garantizan el cumplimiento riguroso de cada pliego de contratación estatal o corporativo.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-gray100 flex items-center justify-between text-xs font-semibold">
              <span className="text-navy uppercase">RUC: 1799999999001</span>
              <span className="text-blue uppercase tracking-widest font-mono">IJ DISTRIBUIDORA S.A.</span>
            </div>
          </div>
        </section>

        {/* The Three Pillars Section */}
        <section className="app-max-width px-4 sm:px-8 md:px-20 mb-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-blue font-bold text-xs uppercase tracking-widest">Nuestra Operación</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy font-serif mt-2 mb-4">
              Los Tres Pilares de IJ Distribuidora
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Controlamos cada fase del ciclo de suministro para asegurar un precio competitivo de distribuidor directo y una entrega ágil sin intermediarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Pillar 1: Importación */}
            <div className="bg-white p-8 rounded-2xl border border-gray100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-lightnavy flex items-center justify-center mb-6">
                <ImportIcon />
              </div>
              <h3 className="text-lg font-bold text-navy font-serif mb-3">Importación Directa</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Adquirimos fibras textiles premium, telas tácticas antidesgarro (Ripstop) y avíos metálicos directamente de los principales puertos mundiales, asegurando materias primas inigualables en el mercado ecuatoriano.
              </p>
            </div>

            {/* Pillar 2: Confección */}
            <div className="bg-white p-8 rounded-2xl border border-gray100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-lightnavy flex items-center justify-center mb-6">
                <TailorIcon />
              </div>
              <h3 className="text-lg font-bold text-navy font-serif mb-3">Confección Premium</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Nuestros talleres textiles cuentan con maquinaria industrial de última generación y artesanos expertos que dan vida a diseños ergonómicos corporativos y prendas blindadas o de alta visibilidad hechas a medida.
              </p>
            </div>

            {/* Pillar 3: Distribución */}
            <div className="bg-white p-8 rounded-2xl border border-gray100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-lightnavy flex items-center justify-center mb-6">
                <LogisticsIcon />
              </div>
              <h3 className="text-lg font-bold text-navy font-serif mb-3">Comercialización Directa</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Abastecemos de manera ágil a empresas y ministerios con nuestra propia flota de despacho en Quito y envíos asegurados a todas las provincias del Ecuador, manteniendo tiempos de entrega consistentes y directos.
              </p>
            </div>

          </div>
        </section>

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

export default AboutUs;
