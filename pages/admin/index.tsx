import { useEffect } from "react";
import { useRouter } from "next/router";

interface DecodedToken {
  role: "ADMIN" | "VENDEDOR";
  exp: number;
}

function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    return null;
  }
}

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) {
      router.replace("/admin/login");
      return;
    }

    const decoded = decodeToken(savedToken);
    if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
      localStorage.removeItem("admin_token");
      sessionStorage.removeItem("admin_api_key");
      router.replace("/admin/login");
    } else {
      if (decoded.role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/admin/orders");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightnavy select-none" style={{ backgroundColor: "#EEF4F8" }}>
      <p className="font-bold text-navy uppercase tracking-widest text-xs animate-pulse font-sans">
        Redireccionando al Panel...
      </p>
    </div>
  );
}
