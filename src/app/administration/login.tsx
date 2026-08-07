"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../lib/adminActions";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await loginAdmin(password);
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError("Contraseña incorrecta");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full" style={{ maxWidth: 320 }}>
        <h1 className="text-lg font-semibold text-center">Panel de administración</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="border rounded-lg px-3 py-2"
          autoFocus
        />
        {error && <p className="text-sm" style={{ color: "var(--c-danger, #dc2626)" }}>{error}</p>}
        <button type="submit" disabled={loading} className="home-btn">
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
