import { FC, useEffect, useRef } from "react";
import Button from "../Buttons/Button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  extraClass?: string;
};

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children, extraClass = "" }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-gray500 opacity-60 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal Card */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-lg mx-4 bg-white border border-gray200 shadow-2xl flex flex-col outline-none focus:outline-none z-50 rounded-sm ${extraClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray100">
          <h3 id="modal-title" className="text-xl font-bold text-navy font-serif tracking-wide">
            {title}
          </h3>
          <button
            className="p-1 ml-auto bg-transparent border-0 text-gray300 float-right text-3xl leading-none font-light outline-none focus:outline-none hover:text-red transition-colors duration-200"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="relative p-6 flex-auto text-base text-gray400 leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-gray100 space-x-2">
          <Button value="Cerrar" onClick={onClose} extraClass="!py-1 !px-4 text-sm font-medium" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
