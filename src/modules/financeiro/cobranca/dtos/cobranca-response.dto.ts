import { EStatusCobranca } from "../models/cobranca.model";

export interface CobrancaResponseDTO {
  id?: number;
  descricao: string;
  valor: number;
  pagadorNome: string;
  pagadorDocumento?: string;
  pagadorEmail?: string;
  dataCriacao?: Date;
  dataVencimento: Date;
  status?: EStatusCobranca;
  pdfPath?: string;
}