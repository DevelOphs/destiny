import { FC } from "react";

type SkeletonProps = {
  type?: "card" | "text" | "circle" | "image";
  extraClass?: string;
};

const SkeletonLoader: FC<SkeletonProps> = ({ type = "text", extraClass = "" }) => {
  switch (type) {
    case "card":
      return (
        <div className={`animate-pulse w-full flex flex-col space-y-3 ${extraClass}`} role="status" aria-label="Cargando contenido">
          <div className="bg-gray200 w-full h-64 rounded"></div>
          <div className="h-4 bg-gray200 rounded w-3/4"></div>
          <div className="h-4 bg-gray200 rounded w-1/2"></div>
          <span className="sr-only">Cargando...</span>
        </div>
      );
    case "circle":
      return <div className={`animate-pulse bg-gray200 rounded-full h-12 w-12 ${extraClass}`} role="status"><span className="sr-only">Cargando...</span></div>;
    case "image":
      return <div className={`animate-pulse bg-gray200 rounded h-48 w-full ${extraClass}`} role="status"><span className="sr-only">Cargando...</span></div>;
    case "text":
    default:
      return <div className={`animate-pulse bg-gray200 rounded h-4 w-full ${extraClass}`} role="status"><span className="sr-only">Cargando...</span></div>;
  }
};

export default SkeletonLoader;
