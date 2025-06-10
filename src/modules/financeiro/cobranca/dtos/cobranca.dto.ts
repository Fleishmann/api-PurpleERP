import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { EStatusCobranca } from '../models/cobranca.model';

export class CobrancaDTO {
  @IsString()
  descricao!: string;

  @IsNumber()
  valor!: number;

  @IsString()
  pagadorNome!: string;

  @IsOptional()
  @IsString()
  pagadorDocumento?: string;

  @IsOptional()
  @IsString()
  pagadorEmail?: string;

  @IsDateString()
  dataVencimento!: string;

  @IsOptional()
  @IsEnum(EStatusCobranca)
  status?: EStatusCobranca;
}
