import 'module-alias/register';
import app from './app';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (isNaN(PORT) || PORT <= 0) {
  console.error('PORT inválida. Configure a variável de ambiente PORT corretamente.');
  process.exit(1);
}

const server = app.listen(PORT, HOST, () => {
  console.log(`[${new Date().toISOString()}] Servidor rodando em http://${HOST}:${PORT}`);
});

server.on('error', (error) => {
  console.error('Erro no servidor:', error);
  process.exit(1);
});
