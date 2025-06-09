import sql, { ConnectionPool, config as SqlConfig } from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: SqlConfig = {
  user: process.env.DB_USER || 'SEU_USUARIO',
  password: process.env.DB_PASSWORD || 'SUA_SENHA',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE || 'SEU_BANCO',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: ConnectionPool | null = null;

export async function getConnection(): Promise<ConnectionPool> {
  if (pool) return pool;

  try {
    pool = await sql.connect(dbConfig);
    console.log('Conectado ao SQL Server');
    return pool;
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
    throw err;
  }
}

export { sql };
