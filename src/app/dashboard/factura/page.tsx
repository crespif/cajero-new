'use client'

const { useState } = require("react");

import JsBarcode from "jsbarcode";
import { useSearchParams } from "next/navigation"

export default function Factura() {
  const searchParams = useSearchParams();
  const [vto, setVto] = useState(null);
  const [codigoBarra, setCodigoBarra] = useState(null);

  const factura = searchParams.get('cupon');
  
  /* decodificador */
  const facturaDecoded = decodeURIComponent(factura??"");
  const facturaBase64 = atob(facturaDecoded);
  const fact = JSON.parse(facturaBase64);

  function barcode() {
    let tipoSrv = (fact.idtipo_srv == 1) ? "1" : "2";
    let cliente =  (fact.idcbte).toString().padStart(8,0);
    let fecha = new Date();
    fecha.setDate(fecha.getDate() + 2);
    //setVto(fecha);
    let strFecha = fecha.toISOString().slice(0,10).replace(/-/g,"");
    strFecha = strFecha.substring(2, strFecha.length);
    let importe = Number.parseFloat(fact.srv_saldo).toFixed(2).replace(/\./g, '').padStart(7,"0");
    let string = `0447${tipoSrv}${cliente}${strFecha}${importe}0000000000000000005120185697`;
    //let string = `044711234567800000000000000000000000000000001234567890`;
    let digitoVerificador1 = digitoVerificacion(string);
    string += `${digitoVerificador1}`;
    let digitoVerificador2 = digitoVerificacion(string);
    string += `${digitoVerificador2}`;
    //setCodigoBarra(string);
    
    const img = new Image();
    if (img) {
      JsBarcode('.barcode', (string).replace('.', ''), {format: "itf"});
    };
  }

  function digitoVerificacion(s: any) {
    let secuencia = [3, 5, 7, 9];
    let x = 0; //indice de secuencia
    let suma = 0;
    suma += s[0] * 1;
    for (let i = 1; i < s.length; i++) {
      suma += s[i] * secuencia[x];
      (secuencia[x] == 9) ? x = 0 : x++;      
    }
    return parseInt(((suma/2)%10).toString());
  }


  return (
    <div className="bg-white border-dashed border-2 border-black-600">    
      <svg className="barcode w-100 object-cover" ref={barcode} ></svg>
    </div>
  )
}