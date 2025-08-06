export type Suministro = {
  idsuministro: number;
  idtipo_srv: number;
  idcategoria: string;
  idcliente: number;
  postcalle: string;
  postnropuerta: string;
  postpisodpto: string;
  postidcodpost: string;
  esdebito_auto: number;
}


/* export interface Cliente {
  idcliente: number;
  nrodocumento: string;
  idsuministro: number;
  cod_suministro: string;
  razon_social: string;
  domicilio: string;
  localidad: string;
  categoria: string;
  servicio: string;
  debito: boolean;
} */

export interface Cliente {
  PersonaNro: number;
  CuentaNro: number;
  CuentaSrv: string;
  CuentaDom: string;
  CuentaDoc: string;
  CuentaNom: string;
  CuentaLoc: string;
  CuentaNIS: string;
  CuentaUnA: string;
}


export interface Factura {
  FacturaID: string,
  FacturaFE: string,
  FacturaPer: number,
  FacturaFV: string,
  FacturaImp: number,
  FacturaSal: number,
  FacturaDA: string,
  PersonaNro: number,
  CuentaNro: number,
  CuentaNIS: string,
  CuentaUnA: string
}

export interface FacturaPagas {
  CliCod: number;
  SumNro: number;
  CompFec: string;
  CompLet: string;
  CompPtoV: number;
  CompNro: number;
  CompImp: number;
  CompSdo: number;
  CompTpo: number;
  CompVto: string;
}