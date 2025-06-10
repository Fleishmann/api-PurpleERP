import sql, { ConnectionPool } from 'mssql';
import { dbConfig } from './env';

let pool: ConnectionPool | null = null;

export async function getConnection(): Promise<ConnectionPool> {
  if (pool) return pool;

  try {
    pool = await sql.connect(dbConfig);
    console.log('✅ Conectado ao SQL Server');
    return pool;
  } catch (err) {
    console.error('❌ Erro ao conectar ao banco:', err);
    throw err;
  }
}

export { sql };
