import { Router } from 'express';
import { CobrancaController } from '@/modules/financeiro/cobranca';

const cobrancaRouter: Router = Router();

cobrancaRouter.get('/', CobrancaController.listar);

cobrancaRouter.post('/', CobrancaController.criar);

cobrancaRouter.put('/:id', CobrancaController.atualizar);

cobrancaRouter.delete('/:id', CobrancaController.remover);

cobrancaRouter.get('/:id/pdf', CobrancaController.gerarPDF);

export default cobrancaRouter;
