import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const path = require('path');
app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

export default app;
