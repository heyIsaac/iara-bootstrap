import { BoletoData, GeneratedBoleto } from './types';

export const generateBoletoBarcode = (data: BoletoData): string => {
  const { value, orderId } = data;

  const banco = '001';
  const moeda = '9';
  const fatorVencimento = '9999';
  const valorFormatado = Math.round(value * 100)
    .toString()
    .padStart(10, '0');
  const campoLivre = orderId.replace(/\D/g, '').padEnd(25, '0').substring(0, 25);

  const codigoSemDV = banco + moeda + fatorVencimento + valorFormatado + campoLivre;
  const dv = (parseInt(codigoSemDV.substring(0, 4)) % 10).toString();

  return banco + moeda + dv + fatorVencimento + valorFormatado + campoLivre;
};

export const generateBoletoDigitableLine = (barcode: string): string => {
  const campo1 = barcode.substring(0, 5) + '.' + barcode.substring(5, 10);
  const campo2 = barcode.substring(10, 15) + '.' + barcode.substring(15, 21);
  const campo3 = barcode.substring(21, 26) + '.' + barcode.substring(26, 32);
  const campo4 = barcode.substring(4, 5);
  const campo5 = barcode.substring(5, 9) + barcode.substring(9, 19);

  return `${campo1} ${campo2} ${campo3} ${campo4} ${campo5}`;
};

export const generateBoleto = (data: BoletoData): GeneratedBoleto => {
  const dueDate = data.dueDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const barcode = generateBoletoBarcode(data);
  const digitableLine = generateBoletoDigitableLine(barcode);

  return {
    barcode,
    digitableLine,
    recipient: 'Iara Games LTDA',
    cnpj: '00.000.000/0001-00',
    value: data.value.toFixed(2),
    dueDate: dueDate.toLocaleDateString('pt-BR'),
    orderId: data.orderId,
    customerName: data.customerName,
    customerCpf: data.customerCpf,
  };
};
