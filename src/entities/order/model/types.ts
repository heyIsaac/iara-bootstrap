export type PaymentMethod = 'card' | 'pix' | 'boleto';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  zipCode?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customer: CustomerInfo;
  paymentMethod: PaymentMethod | string;
  date: string;
  pixPaid?: boolean;
  boletoPaid?: boolean;
}
