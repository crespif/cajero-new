import { Factura } from "./definitions";

const PUNTOS_VENTA_IMPRIMIBLES = ["0211", "0210"];
const PUNTOS_VENTA_NO_IMPRIMIBLES = ["0220", "0221", "0224"];

export function pickComprobante(facturas: Factura[]): Factura {
  const printable = facturas.filter((f) => PUNTOS_VENTA_IMPRIMIBLES.includes(f.FacturaID.slice(3, 7)));
  return printable[0] ?? facturas[0];
}

export function cbteNoEnergetico(facturas: Factura[]): Factura[] {
  return facturas.filter((f) => PUNTOS_VENTA_NO_IMPRIMIBLES.includes(f.FacturaID.slice(3, 7))) || [];
}

// nro_comprobante SIRO: 15 posiciones FacturaID + 1 concepto + 4 MMAA (periodo)
export function buildComprobante(factura: Factura): string {
  const periodo = factura.FacturaPer.toString().padStart(6, "0");
  const mm = periodo.slice(4, 6);
  const aa = periodo.slice(2, 4);
  return `${factura.FacturaID}0${mm}${aa}`;
}
