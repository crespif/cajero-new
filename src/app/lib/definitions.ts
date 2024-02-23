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


export interface Cliente {
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
}