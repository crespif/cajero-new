"use client"

import { useRouter } from "next/navigation"

export default function Error() {

  const router = useRouter();

  return (
    <>
      <div className="text-center p-5 bg-red-200 text-red-800 rounded-md flex items-center">
    
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-red-500 mr-2">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
        </svg>
        <div>
          <h1>Hubo un error con la plataforma de pago</h1>
          <p>Disculpe las molestias, reintente en unos minutos</p>
        </div>
      </div> 
      <button className="bg-blue-500 p-2 text-white rounded-md flex items-center hover:bg-blue-400" onClick={() => router.back()}>
        <span className="mx-2">
          Volver
        </span>
      </button>
    </>
  )
}

