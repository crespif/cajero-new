"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [doc, setDoc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doc) return;
    setLoading(true);
    window.location.href = `dashboard/${doc}`;
  };

  return (
    <main className="home-wrap">
      <div className="home-card anim-fade-up">
        <div className="home-logo">
          <Image
            src="/logo.png"
            alt="CELTA"
            width={64}
            height={80}
            priority
            style={{ width: "auto", height: "68px", margin: "0 auto" }}
          />
        </div>

        <h1 className="home-title">Cajero Virtual</h1>
        <p className="home-sub">
          Ingresá tu número de documento para consultar y pagar tus facturas
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            pattern="[0-9]*"
            placeholder="Número de documento"
            className="home-input"
            value={doc}
            onChange={(e) => setDoc(e.target.value)}
            required
            inputMode="numeric"
            autoFocus
            title="Ingrese solo números"
          />
          <button type="submit" className="home-btn" disabled={loading}>
            {loading ? (
              <>
                <svg
                  className="anim-spin"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                </svg>
                Buscando…
              </>
            ) : (
              <>
                Buscar
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
