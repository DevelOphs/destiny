import { FC } from "react";

type BadgeProps = {
  text: string;
  variant?: "success" | "warning" | "danger" | "primary" | "secondary" | "neutral";
  extraClass?: string;
};

const Badge: FC<BadgeProps> = ({ text, variant = "neutral", extraClass = "" }) => {
  let badgeStyles = "";

  switch (variant) {
    case "success":
      badgeStyles = "bg-green text-gray500 border-green"; // Available / Stock
      break;
    case "warning":
      badgeStyles = "bg-yellow text-gray500 border-yellow"; // Low Stock / Special order
      break;
    case "danger":
      badgeStyles = "bg-red text-white border-red"; // Out of stock / Sold
      break;
    case "primary":
      badgeStyles = "bg-blue text-white border-blue"; // Slate secondary
      break;
    case "secondary":
      badgeStyles = "bg-navy text-white border-navy"; // Deep Navy primary
      break;
    default:
      badgeStyles = "bg-gray100 text-gray400 border-gray200"; // Neutral grey
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyles} ${extraClass}`}
    >
      {text}
    </span>
  );
};

export default Badge;
