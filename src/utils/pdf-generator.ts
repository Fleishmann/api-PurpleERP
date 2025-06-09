import puppeteer from 'puppeteer';
import { Cobranca } from '../models/cobranca.model';

export async function gerarPDFBuffer(cobranca: Cobranca): Promise<Buffer> {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8" />
    <title>Boleto com QR Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 30px;
            background-color: #f9f9f9;
            color: #333;
        }

        .header {
            text-align: center;
            color: #0a4b78;
            margin-bottom: 20px;
        }

        .empresa {
            font-weight: bold;
            font-size: 20px;
        }

        .info {
            margin-bottom: 30px;
        }

        .section-title {
            font-weight: bold;
            margin: 20px 0 10px;
            color: #0a4b78;
            font-size: 16px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #e1f0ff;
            color: #0a4b78;
        }

        .qr-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 30px;
        }

        .qr-code {
            text-align: center;
        }

        .codigo-barras {
            font-family: monospace;
            font-size: 16px;
            background: #eee;
            padding: 10px;
            border: 1px solid #ccc;
            display: inline-block;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 40px;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="empresa">NovaLink Sistemas Integrados LTDA</div>
        <div>CNPJ: 48.237.159/0001-65</div>
        <div>Av. Central da Tecnologia, 482 - Belo Horizonte/MG</div>
        <div>Telefone: (31) 3456-7890</div>
    </div>

    <div class="info">
        <div class="section-title">Pagador</div>
        <div>Nome: ${cobranca.PagadorNome}</div>
        <div>CPF: ${cobranca.PagadorDocumento}</div>
        <div>Email: ${cobranca.PagadorEmail || '---'}</div>
    </div>

    <div class="section-title">Detalhes do Pagamento</div>
    <table>
        <thead>
            <tr>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Vencimento</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${cobranca.Descricao}</td>
                <td>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cobranca.Valor)}
                </td>
                <td>${new Date(cobranca.DataVencimento).toLocaleDateString('pt-BR')}</td>
            </tr>
        </tbody>
    </table>

    <div class="section-title">Instruções</div>
    <div>Pagamento via Pix utilizando o QR Code abaixo.<br>Não aceite após o vencimento.</div>

    <div class="qr-section">
        <div class="qr-code">
            <img src="https://api.qrserver.com/v1/create-qr-code/?data=${cobranca.PagadorEmail}&size=150x150"
                alt="QR Code Pix">
            <div>Escaneie com o app do seu banco</div>
        </div>

        <div>
            <div class="section-title">Código de Barras</div>
            <div class="codigo-barras">00190.00009 01234.567891 23456.789012 3 87650000010000</div>
        </div>
    </div>

    <div class="footer">
        Em caso de dúvidas, entre em contato pelo telefone acima.
    </div>
</body>

</html>
`;

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm', left: '10mm', right: '10mm' }
    });

    await browser.close();
    
    return Buffer.from(pdfBuffer);
}
