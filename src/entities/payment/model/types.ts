export interface PixData {
  value: number;
  recipient: string;
  city: string;
  txid: string;
}

export interface GeneratedPix {
  payload: string;
  qrCode: string;
  pixKey: string;
  value: string;
  expiresIn: number;
}

export interface BoletoData {
  value: number;
  orderId: string;
  customerName: string;
  customerCpf: string;
  dueDate?: Date;
}

export interface GeneratedBoleto {
  barcode: string;
  digitableLine: string;
  recipient: string;
  cnpj: string;
  value: string;
  dueDate: string;
  orderId: string;
  customerName: string;
  customerCpf: string;
}
