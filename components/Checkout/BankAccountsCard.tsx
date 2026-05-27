import React from "react";

/**
 * Propiedades requeridas para inicializar el componente de cuentas bancarias.
 */
interface BankAccountsCardProps {
  copiedBank: string | null;                              // Identificador del banco cuya cuenta fue copiada recientemente
  onCopyAccount: (accountNumber: string, bankId: string) => void; // Manejador de portapapeles para copiar rápido
}

const BankAccountsCard: React.FC<BankAccountsCardProps> = ({
  copiedBank,
  onCopyAccount,
}) => {
  // SVGs de Iconografía Premium (Cero Emojis)
  
  const BankIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V11M5 21V11M10 21V11M14 21V11M3 11h18M12 3L3 11h18L12 3zM3 21h18" />
    </svg>
  );

  const CopyIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );

  const CheckIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="mt-8 border border-gray-200 p-6 bg-lightnavy/50 rounded-2xl animate__animated animate__fadeIn">
      <h4 className="text-base font-bold font-serif text-navy tracking-wide mb-4 flex items-center">
        <BankIcon className="w-5 h-5 mr-2 text-blue" />
        Cuentas Bancarias Autorizadas
      </h4>
      <p className="text-xs text-gray-400 mb-6 leading-relaxed">
        Realice el depósito o transferencia y adjunte el comprobante. Puede usar la acción de copiado rápido para facilitar su transacción.
      </p>

      <div className="flex flex-col gap-6">
        {/* BANCO PICHINCHA - Tarjeta Premium con degradado */}
        <div
          className="text-white p-6 rounded-2xl border border-yellow/20 shadow-md flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #0B2545 0%, #134074 100%)" }}
        >
          <div className="flex justify-between items-start">
            <span className="font-serif font-semibold text-xs tracking-wider text-yellow">BANCO PICHINCHA</span>
            <span className="text-[10px] bg-yellow/20 text-yellow py-0.5 px-3 rounded-full font-bold">Cta. Corriente</span>
          </div>
          <div className="my-4">
            <span className="block text-[10px] text-gray-300 uppercase tracking-wider">Número de Cuenta</span>
            <span className="text-xl font-bold font-mono tracking-widest text-white">2201234567</span>
          </div>
          <div className="flex justify-between items-center border-t border-white/10 pt-3 text-[10px] text-gray-300">
            <div>
              <span className="block">RUC: 1799999999001</span>
              <span className="block font-semibold text-white">IJ DISTRIBUIDORA S.A.</span>
            </div>
            <button
              type="button"
              onClick={() => onCopyAccount("2201234567", "pichincha")}
              className="flex items-center space-x-1.5 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition duration-200 border border-white/5 active:scale-95 cursor-pointer font-sans"
            >
              {copiedBank === "pichincha" ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 text-green" />
                  <span className="text-green font-bold text-[9px] uppercase">Copiado</span>
                </>
              ) : (
                <>
                  <CopyIcon className="w-3.5 h-3.5 text-white" />
                  <span className="font-bold text-[9px] uppercase text-white">Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* PRODUBANCO - Tarjeta Premium con degradado verde esmeralda */}
        <div
          className="text-white p-6 rounded-2xl border border-green/20 shadow-md flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)" }}
        >
          <div className="flex justify-between items-start">
            <span className="font-serif font-semibold text-xs tracking-wider text-green font-bold">PRODUBANCO</span>
            <span className="text-[10px] bg-green/20 text-green py-0.5 px-3 rounded-full font-bold">Cta. Corriente</span>
          </div>
          <div className="my-4">
            <span className="block text-[10px] text-gray-300 uppercase tracking-wider">Número de Cuenta</span>
            <span className="text-xl font-bold font-mono tracking-widest text-white">00101234567</span>
          </div>
          <div className="flex justify-between items-center border-t border-white/10 pt-3 text-[10px] text-gray-300">
            <div>
              <span className="block">RUC: 1799999999001</span>
              <span className="block font-semibold text-white">IJ DISTRIBUIDORA S.A.</span>
            </div>
            <button
              type="button"
              onClick={() => onCopyAccount("00101234567", "produbanco")}
              className="flex items-center space-x-1.5 py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition duration-200 border border-white/5 active:scale-95 cursor-pointer font-sans"
            >
              {copiedBank === "produbanco" ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 text-green" />
                  <span className="text-green font-bold text-[9px] uppercase">Copiado</span>
                </>
              ) : (
                <>
                  <CopyIcon className="w-3.5 h-3.5 text-white" />
                  <span className="font-bold text-[9px] uppercase text-white">Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccountsCard;
