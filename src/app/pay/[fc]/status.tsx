'use client';


import { setCookie } from 'cookies-next';
import { useEffect } from 'react';

export default function Status( {Fc, Url, Hash} : {Fc: string, Url: string, Hash: string} ) {

  setCookie(`h${Fc}`, Hash, {maxAge: 60 * 15});

  useEffect(() => {
    window.location.href = Url;
  }, [Url]);

  return (
    <div>
      <h1>Redirigiendo a la pasarela de pago...</h1>
    </div>
  )
}