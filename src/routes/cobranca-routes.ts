import { Router } from 'express';
import { CobrancaController } from '../controllers/cobranca.controller';

const router: Router = Router();

router.get('/', CobrancaController.listar);
router.post('/', CobrancaController.criar);
router.put('/:id', CobrancaController.atualizar);
router.delete('/:id', CobrancaController.remover);

router.get('/:id/gerar-pdf', CobrancaController.gerarPDF);


export default router;
