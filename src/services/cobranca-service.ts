import { CobrancaDTO } from '../dtos/cobranca.dto';
import { Cobranca } from '../models/cobranca.model';
import { CobrancaRepository } from '../repositories/cobranca-repository';
import { gerarPDFBuffer } from '../utils/pdf-generator';

export class CobrancaService {
  static async listar() {
    return await CobrancaRepository.buscarTodas();
  }

  static async criar(dto: CobrancaDTO): Promise<Cobranca> {
    const now = new Date();

    // Zera hora, minuto, segundo e ms para salvar só a data
    const dataCriacaoSomenteData = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const dtoTratado: Omit<Cobranca, 'id' | 'pdfPath'> = {
      ...dto,
      PagadorDocumento: dto.PagadorDocumento ? dto.PagadorDocumento.replace(/\D/g, '') : undefined,
      DataCriacao: dataCriacaoSomenteData,
      Status: 1
    };

    return await CobrancaRepository.salvar(dtoTratado);
  }

  static async atualizar(id: number, dto: CobrancaDTO): Promise<Cobranca> {
    const dadosAtualizados: Partial<Cobranca> = {
      ...dto,
      PagadorDocumento: dto.PagadorDocumento ? dto.PagadorDocumento.replace(/\D/g, '') : undefined
    };

    return await CobrancaRepository.atualizar(id, dadosAtualizados);
  }

  static async gerarPDF(id: number): Promise<Buffer> {
    const cobranca = await CobrancaRepository.buscarPorId(id);
    if (!cobranca) throw new Error('Cobrança não encontrada');

    const buffer = await gerarPDFBuffer(cobranca);
    return buffer;
  }

  static async remover(id: number): Promise<void> {
    return await CobrancaRepository.deletar(id);
  }



}


function getSaoPauloDate(): Date {
  const now = new Date();

  // converte para UTC em ms
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;

  // offset São Paulo em minutos (UTC-3)
  const saoPauloOffset = -3 * 60;

  // para converter para horário de São Paulo, soma o offset (que é negativo, então subtrai 3h)
  return new Date(utc + saoPauloOffset * 60000);
}

