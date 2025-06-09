import { Request, Response } from 'express';
import { CobrancaService } from '../services/cobranca-service';
import { CobrancaDTO } from '../dtos/cobranca.dto';

export class CobrancaController {
  static async listar(req: Request, res: Response): Promise<void> {
    try {
      const cobrancas = await CobrancaService.listar();
      res.json(cobrancas);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar cobranças', error });
    }
  }

  static async criar(req: Request, res: Response): Promise<void> {
    try {
      const dados: CobrancaDTO = req.body;
      const nova = await CobrancaService.criar(dados);
      res.status(201).json(nova);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar cobrança', error });
    }
  }

  static async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const dados: CobrancaDTO = req.body;
      const atualizada = await CobrancaService.atualizar(id, dados);
      res.status(200).json(atualizada);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar cobrança', error });
    }
  }

  static async gerarPDF(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const pdfBuffer = await CobrancaService.gerarPDF(id); // retorna Uint8Array
      const buffer = Buffer.from(pdfBuffer); // converte corretamente

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="boleto_${id}.pdf"`);
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao gerar PDF da cobrança', error });
    }
  }

  static async remover(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await CobrancaService.remover(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover cobrança', error });
    }
  }
}
