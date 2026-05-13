"use client";

import Image from "next/image";
import { useState } from "react";

export default function SurveyPopup({ personaNro }: { personaNro: number }) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative max-w-4xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute -top-4 -right-4 z-10 bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow-md text-white hover:bg-gray-400 transition-colors"
          aria-label="Cerrar"
        >
          ✕
        </button>
        <a
          href={`https://encuestacelta.vercel.app//?cod=${personaNro}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/encuesta-celta.png"
            alt="Encuesta de satisfacción Celta"
            width={600}
            height={450}
            className="rounded-lg shadow-xl w-full h-auto cursor-pointer"
            priority
          />
        </a>
      </div>
    </div>
  );
}
