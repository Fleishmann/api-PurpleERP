export interface CobrancaDTO {
  Descricao: string;
  Valor: number;
  PagadorNome: string;
  PagadorDocumento?: string;
  PagadorEmail?: string;
  DataVencimento: Date;
  Status?: number;
}
