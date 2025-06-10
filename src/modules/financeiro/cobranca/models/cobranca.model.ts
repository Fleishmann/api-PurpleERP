export interface Cobranca {
  Id?: number;
  Descricao: string;
  Valor: number;
  PagadorNome: string;
  PagadorDocumento?: string;
  PagadorEmail?: string;
  DataCriacao?: Date;
  DataVencimento: Date;
  Status?: EStatusCobranca;
}

export enum EStatusCobranca {
  Pendente = 1,
  Gerado = 2,
  Pago = 3,
  Cancelado = 4
}
