"use client";

import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Home() {
  const [doc, setDoc] = useState("10");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    e.preventDefault();
    setDoc(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    // Redirect to dashboard
    window.location.href = `dashboard/${doc}`;
  };

  return (
    <main className="flex flex-col items-center justify-between p-4">
      <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Cajero Virtual
        </h1>
        <p className="text-gray-600">Bienvenido al Cajero Virtual de CELTA</p>
        <form onSubmit={handleSubmit} className="flex md:flex-row flex-col items-center justify-center p-4">
          <input
            type="text" 
            pattern="[0-9]*"
            placeholder="Documento"
            className="p-2 m-2 border border-gray-300 rounded-lg"
            onChange={handleChange}
            required
            inputMode="numeric"
            title="Formato de documento invalido, ingrese solo numeros"
          />
          <button
            type="submit"
            className="flex items-center gap-2 self-start rounded-lg bg-blue-500 py-2 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base m-auto"
          >
            <MagnifyingGlassIcon className="w-5" />
            <span>{loading ? "Cargando..." : "Buscar"}</span>
          </button>
         {/*  
          <Link
            href={`dashboard/${doc}`}
            className="flex items-center gap-2 self-start rounded-lg bg-blue-500 py-2 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base m-auto"
            onClick={() => setLoading(true)}
          >
            <MagnifyingGlassIcon className="w-5" />
            <span>{loading ? "Cargando..." : "Buscar"}</span>
          </Link> */}
        </form>
      </div>
    </main>
  );
}
