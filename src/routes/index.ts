import { Router } from 'express';
import cobrancaRoutes from '@/modules/financeiro/cobranca/routes/cobranca-routes';

const router: Router = Router();

router.use('/cobrancas', cobrancaRoutes);

export default router;
