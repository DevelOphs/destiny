import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Interfaz para el tipado estricto de los datos del gráfico
interface DailyRevenue {
  day: string;
  revenue: number;
}

const mockData: DailyRevenue[] = [
  { day: "Lunes", revenue: 420 },
  { day: "Martes", revenue: 680 },
  { day: "Miércoles", revenue: 590 },
  { day: "Jueves", revenue: 950 },
  { day: "Viernes", revenue: 820 },
  { day: "Sábado", revenue: 1100 },
  { day: "Domingo", revenue: 980 }
];

interface SalesChartProps {
  data?: DailyRevenue[];
}

export default function SalesChart({ data = mockData }: SalesChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Evitar discrepancias de hidratación en el servidor (Next.js SSR)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div 
        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-full flex items-center justify-center"
        style={{ height: "384px" }}
      >
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
          Cargando Gráfico Interactivo...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-full select-none">
      <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-6 font-sans" style={{ color: "#0B2545" }}>
        Ingresos por Ventas (Últimos 7 Días)
      </h3>
      
      <div style={{ width: "100%", height: "320px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              {/* Gradiente desvanecido basado en el color principal de la marca Navy (#0B2545) */}
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0B2545" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0B2545" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            
            {/* Ocultar líneas verticales y hacer las horizontales muy sutiles */}
            <CartesianGrid 
              vertical={false} 
              stroke="#f3f4f6" 
            />
            
            <XAxis 
              dataKey="day" 
              tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: "bold" }}
              axisLine={false}
              tickLine={false}
            />
            
            <YAxis 
              tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: "bold" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#ffffff", 
                border: "1px solid #f3f4f6", 
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "bold",
                color: "#0B2545",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
              }}
              formatter={(value: any) => [`$ ${value} USD`, "Ingresos"]}
              labelFormatter={(label) => `Día: ${label}`}
            />
            
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#0B2545"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
