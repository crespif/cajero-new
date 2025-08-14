'use client';

import { useEffect } from 'react';

export default function Status( {Url} : {Url: string} ) {

  useEffect(() => {
    window.location.href = Url;
  }, [Url]);

  return (
    <div>
      <h1>Redirigiendo a la pasarela de pago...</h1>
    </div>
  )
}