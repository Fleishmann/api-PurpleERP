import { Router } from 'express';
import cobrancaRoutes from './cobranca-routes';

const router: Router = Router();

router.use('/cobrancas', cobrancaRoutes);

export default router;
