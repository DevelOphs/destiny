import React from "react";

// Interfaz TypeScript estricta para las propiedades del componente
interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
}

export default function KpiCard({ title, value, trend, trendDirection = "up", icon }: KpiCardProps) {
  // Retorna color inline de tendencia según su dirección
  const getTrendColor = () => {
    if (trendDirection === "up") return "#10B981"; // Esmeralda / Éxito
    if (trendDirection === "down") return "#EF4444"; // Rojo / Caída
    return "#6B7280"; // Gris / Neutral
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between select-none transition-all duration-300 hover:shadow-md">
      <div>
        <header className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {title}
          </span>
          {icon && (
            <div className="p-2 bg-lightnavy text-blue rounded-lg" style={{ backgroundColor: "rgba(238, 244, 248, 0.7)", color: "#134074" }}>
              {icon}
            </div>
          )}
        </header>

        <div className="text-3xl font-bold text-navy mt-4 font-sans" style={{ color: "#0B2545" }}>
          {value}
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center space-x-1.5 text-xs font-semibold select-none">
          <span style={{ color: getTrendColor() }}>
            {trend}
          </span>
          <span className="text-gray-400">
            vs. semana pasada
          </span>
        </div>
      )}
    </div>
  );
}
