import React, { useState, useRef } from "react";
import axios from "axios";

interface ImageUploadPickerProps {
  label: string;
  value: string; // URL o ruta de la imagen actual
  onChange: (value: string) => void; // Callback al cambiar la ruta
  tip: string; // Mensaje de resolución recomendada
}

export default function ImageUploadPicker({ label, value, onChange, tip }: ImageUploadPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = async (file: File) => {
    setErrorMsg("");
    
    // 1. Validar formato en cliente
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Formato no permitido. Utilice únicamente PNG, JPG, JPEG o WEBP.");
      return;
    }

    setIsUploading(true);

    try {
      const apiKey = sessionStorage.getItem("admin_api_key");
      if (!apiKey) {
        setErrorMsg("Sesión administrativa expirada. Por favor, inicie sesión nuevamente.");
        setIsUploading(false);
        return;
      }

      // 2. Convertir a Base64 con FileReader
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;

        try {
          // 3. Subir al servidor local
          const response = await axios.post(
            "/api/v1/upload",
            {
              base64Data,
              filename: file.name
            },
            {
              headers: { "x-api-key": apiKey }
            }
          );

          if (response.data.success && response.data.url) {
            onChange(response.data.url);
          } else {
            setErrorMsg("Ocurrió un error al procesar el archivo en el servidor.");
          }
        } catch (err: any) {
          console.error("Upload API call failed:", err);
          if (err.response && err.response.data && err.response.data.error) {
            setErrorMsg(err.response.data.error);
          } else {
            setErrorMsg("Error de conexión al subir la imagen. Compruebe su conexión.");
          }
        } finally {
          setIsUploading(false);
        }
      };
    } catch (err) {
      console.error("File reading failed:", err);
      setErrorMsg("Error al leer el archivo local.");
      setIsUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const triggerPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2 font-sans select-none text-xs">
      <label className="block text-gray-400 font-bold uppercase tracking-wider">
        {label}
      </label>

      {errorMsg && (
        <div className="bg-red bg-opacity-10 border border-red border-opacity-20 text-red font-semibold py-2 px-3 rounded-lg text-center leading-relaxed">
          {errorMsg}
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onInputChange}
        accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
        className="hidden"
      />

      {value ? (
        // Preview State
        <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-between p-3.5 hover:border-blue transition-colors duration-200">
          <div className="flex items-center space-x-3.5 min-w-0">
            {/* Thumbnail */}
            <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Miniatura subida"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-navy block truncate" style={{ color: "#0B2545" }}>
                Imagen Cargada
              </span>
              <span className="text-[9px] font-mono text-gray-400 block truncate max-w-xs">
                {value}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={triggerPicker}
            disabled={isUploading}
            className="bg-lightnavy border border-gray-200 hover:border-blue text-blue text-[10px] font-bold py-1.5 px-3 rounded-lg transition-all duration-200 active:scale-95 uppercase tracking-wider"
            style={{ color: "#134074", backgroundColor: "rgba(238, 244, 248, 0.7)" }}
          >
            Cambiar Imagen
          </button>
        </div>
      ) : (
        // Drop zone State
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerPicker}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center space-y-2 select-none ${
            isDragOver ? "border-blue bg-lightnavy bg-opacity-20" : "border-gray-300 hover:border-blue bg-white"
          }`}
          style={isDragOver ? { borderColor: "#134074", backgroundColor: "rgba(238, 244, 248, 0.3)" } : {}}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2 py-4">
              <svg className="animate-spin h-6 w-6 text-blue" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-[10px] font-bold text-blue uppercase tracking-widest animate-pulse">
                Subiendo Archivo...
              </span>
            </div>
          ) : (
            <>
              <div className="p-3 bg-lightnavy rounded-full text-blue" style={{ backgroundColor: "rgba(238, 244, 248, 0.7)" }}>
                <svg className="w-5 h-5 text-blue" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ color: "#134074" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-bold text-navy block uppercase tracking-wider" style={{ color: "#0B2545" }}>
                  Seleccionar o Arrastrar Archivo
                </span>
                <span className="text-[9px] text-gray-400 block mt-1 uppercase tracking-widest">
                  PNG, JPG, JPEG o WEBP
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Resolution & Format Suggestions banner */}
      <div className="flex items-center space-x-2 bg-lightnavy/50 p-2.5 rounded-lg border border-gray-100" style={{ backgroundColor: "rgba(238, 244, 248, 0.4)" }}>
        <span className="text-[10px] text-blue font-bold flex-shrink-0" style={{ color: "#134074" }}>
          💡 Tip:
        </span>
        <span className="text-[9px] text-gray-400 leading-normal font-medium">
          {tip}
        </span>
      </div>
    </div>
  );
}
