import app from './app';

const PORT: number = Number(process.env.PORT) || 3000;

// app.listen(PORT, () => {
//   console.log(`Servidor rodando na porta ${PORT}`);
// });


app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor rodando em http://0.0.0.0:3000');
});