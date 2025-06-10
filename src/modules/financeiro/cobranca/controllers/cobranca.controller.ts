import { Request, Response } from 'express';
import { CobrancaService } from '../services/cobranca-service';
import { CobrancaDTO } from '../dtos/cobranca.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

function parseId(param: string): number | undefined {
  const id = parseInt(param, 10);
  return isNaN(id) ? undefined : id;
}

export class CobrancaController {
  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const cobrancas = await CobrancaService.listar();
      res.json(cobrancas);
    } catch {
      res.status(500).json({ message: 'Erro ao listar cobranças.' });
    }
  }

  static async criar(req: Request, res: Response): Promise<void> {
    try {
      const dados = plainToInstance(CobrancaDTO, req.body);
      const erros = await validate(dados);

      if (erros.length > 0) {
        res.status(400).json({ message: 'Dados inválidos', erros });
        return;
      }

      const nova = await CobrancaService.criar(dados);
      res.status(201).json(nova);
    } catch {
      res.status(500).json({ message: 'Erro ao criar cobrança.' });
    }
  }

  static async atualizar(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ message: 'ID inválido.' });
      return;
    }

    try {
      const dados = plainToInstance(CobrancaDTO, req.body);
      const erros = await validate(dados);

      if (erros.length > 0) {
        res.status(400).json({ message: 'Dados inválidos', erros });
        return;
      }

      const atualizada = await CobrancaService.atualizar(id, dados);
      res.status(200).json(atualizada);
    } catch {
      res.status(500).json({ message: 'Erro ao atualizar cobrança.' });
    }
  }

  static async gerarPDF(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ message: 'ID inválido.' });
      return;
    }

    try {
      const pdfBuffer = await CobrancaService.gerarPDF(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="boleto_${id}.pdf"`);

      res.send(Buffer.from(pdfBuffer));
      res.end();

      console.log('PDF enviado e resposta finalizada');

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Erro ao gerar PDF da cobrança.' });
      } else {
        res.end();
      }
    }
  }

  static async remover(req: Request, res: Response): Promise<void> {
    const id = parseId(req.params.id);
    if (!id) {
      res.status(400).json({ message: 'ID inválido.' });
      return;
    }

    try {
      await CobrancaService.remover(id);
      res.status(204).send();
    } catch {
      res.status(500).json({ message: 'Erro ao remover cobrança.' });
    }
  }
}
