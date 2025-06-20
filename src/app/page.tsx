"use client";

import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Image from "next/image";

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
      
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Sitio en mantenimiento
        </h1>
        <p className="text-gray-600">disculpe las molestias</p>
        <Image
          src="/unnamed.png"
          alt="Maintenance"
          width={300}
          height={200}
          className="mt-4 rounded-lg"
        />
      
    </main>
  );
}
