import { getConnection, sql } from '../config/db';
import { Cobranca } from '../models/cobranca.model';

export class CobrancaRepository {

  static async buscarTodas(): Promise<Cobranca[]> {
    const pool = await getConnection();
    const result = await pool.request().query('SELECT * FROM Cobrancas');
    return result.recordset;
  }

  static async salvar(data: Omit<Cobranca, 'id' | 'pdfPath'>): Promise<Cobranca> {
    const pool = await getConnection();

    const result = await pool.request()
      .input('descricao', sql.NVarChar, data.Descricao)
      .input('valor', sql.Decimal(10, 2), data.Valor)
      .input('pagadorNome', sql.NVarChar, data.PagadorNome)
      .input('pagadorDocumento', sql.NVarChar, data.PagadorDocumento)
      .input('pagadorEmail', sql.NVarChar, data.PagadorEmail)
      .input('dataCriacao', sql.DateTime, data.DataCriacao)
      .input('dataVencimento', sql.DateTime, new Date(data.DataVencimento))
      .input('status', sql.Int, data.Status)
      .query(`
        INSERT INTO Cobrancas 
          (Descricao, Valor, PagadorNome, PagadorDocumento, PagadorEmail, DataCriacao, DataVencimento, Status)
        OUTPUT INSERTED.*
        VALUES 
          (@descricao, @valor, @pagadorNome, @pagadorDocumento, @pagadorEmail, @dataCriacao, @dataVencimento, @status)
      `);

    return result.recordset[0];
  }

  static async atualizar(id: number, data: Partial<Cobranca>): Promise<Cobranca> {
    const pool = await getConnection();

    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('descricao', sql.NVarChar, data.Descricao)
      .input('valor', sql.Decimal(10, 2), data.Valor)
      .input('pagadorNome', sql.NVarChar, data.PagadorNome)
      .input('pagadorDocumento', sql.NVarChar, data.PagadorDocumento)
      .input('pagadorEmail', sql.NVarChar, data.PagadorEmail)
      .input('dataVencimento', sql.DateTime, new Date(data.DataVencimento!))
      .input('status', sql.Int, data.Status)
      .query(`
      UPDATE Cobrancas SET
        Descricao = @descricao,
        Valor = @valor,
        PagadorNome = @pagadorNome,
        PagadorDocumento = @pagadorDocumento,
        PagadorEmail = @pagadorEmail,
        DataVencimento = @dataVencimento,
        Status = @status
      OUTPUT INSERTED.*
      WHERE Id = @id
    `);

    return result.recordset[0];
  }

  static async buscarPorId(id: number): Promise<Cobranca | null> {
    const pool = await getConnection();

    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Cobrancas WHERE id = @id');

    return result.recordset[0] ?? null;
  }

  static async deletar(id: number): Promise<void> {
    const pool = await getConnection();
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Cobrancas WHERE Id = @id');
  }
}
