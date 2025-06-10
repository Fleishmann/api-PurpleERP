import { CobrancaDTO } from '../dtos/cobranca.dto';
import { CobrancaResponseDTO } from '../dtos/cobranca-response.dto';
import { Cobranca, EStatusCobranca } from '../models/cobranca.model';
import { CobrancaRepository } from '../repositories/cobranca-repository';
import { gerarPDFBuffer } from '@/utils/pdf-generator';

export class CobrancaService {
  static async listar(): Promise<CobrancaResponseDTO[]> {
    const cobrancas = await CobrancaRepository.buscarTodas();
    return cobrancas.map(this.mapearModelParaResponse);
  }

  static async criar(dto: CobrancaDTO): Promise<CobrancaResponseDTO> {
    const cobrancaParaCriar = this.mapearDTOParaCriacao(dto);
    const criada = await CobrancaRepository.salvar(cobrancaParaCriar);
    return this.mapearModelParaResponse(criada);
  }

  static async atualizar(id: number, dto: CobrancaDTO): Promise<CobrancaResponseDTO> {
    const cobrancaParaAtualizar = this.mapearDTOParaAtualizacao(dto);
    const atualizada = await CobrancaRepository.atualizar(id, cobrancaParaAtualizar);
    return this.mapearModelParaResponse(atualizada);
  }

  static async gerarPDF(id: number): Promise<Buffer> {
    const cobranca = await CobrancaRepository.buscarPorId(id);
    if (!cobranca) throw new Error('Cobrança não encontrada');

    return gerarPDFBuffer(cobranca);
  }

  static remover(id: number): Promise<void> {
    return CobrancaRepository.deletar(id);
  }

  private static mapearDTOParaCriacao(dto: CobrancaDTO): Omit<Cobranca, 'Id'> {
    return {
      Descricao: dto.descricao,
      Valor: dto.valor,
      PagadorNome: dto.pagadorNome,
      PagadorDocumento: this.formatarDocumento(dto.pagadorDocumento),
      PagadorEmail: dto.pagadorEmail,
      DataCriacao: this.dataAtualSomenteData(),
      DataVencimento: new Date(dto.dataVencimento),
      Status: EStatusCobranca.Pendente
    };
  }

  private static mapearDTOParaAtualizacao(dto: CobrancaDTO): Partial<Cobranca> {
    return {
      Descricao: dto.descricao,
      Valor: dto.valor,
      PagadorNome: dto.pagadorNome,
      PagadorDocumento: this.formatarDocumento(dto.pagadorDocumento),
      PagadorEmail: dto.pagadorEmail,
      DataVencimento: new Date(dto.dataVencimento),
      Status: dto.status
    };
  }

  private static mapearModelParaResponse(model: Cobranca): CobrancaResponseDTO {
    return {
      id: model.Id,
      descricao: model.Descricao,
      valor: model.Valor,
      pagadorNome: model.PagadorNome,
      pagadorDocumento: model.PagadorDocumento,
      pagadorEmail: model.PagadorEmail,
      dataCriacao: model.DataCriacao,
      dataVencimento: model.DataVencimento,
      status: model.Status
    };
  }

  private static formatarDocumento(documento?: string): string | undefined {
    return documento?.replace(/\D/g, '');
  }

  private static dataAtualSomenteData(): Date {
    const agora = new Date();
    return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  }
}
