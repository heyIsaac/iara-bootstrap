import { Order } from './types';

const ORDERS_HISTORY_KEY = 'orders_history';
const PENDING_ORDER_KEY = 'pending_order';
const LAST_ORDER_KEY = 'last_order';

export const getOrdersHistory = (): Order[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ORDERS_HISTORY_KEY);
    if (!raw) return [];
    const orders: Order[] = JSON.parse(raw);
    return orders.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (err) {
    console.error('Erro ao ler orders_history:', err);
    return [];
  }
};

export const saveOrderToHistory = (order: Order): void => {
  if (typeof window === 'undefined') return;
  try {
    const history = getOrdersHistory();
    // Check if order already exists in history to update, otherwise push
    const index = history.findIndex((o) => o.id === order.id);
    if (index >= 0) {
      history[index] = order;
    } else {
      history.unshift(order);
    }
    localStorage.setItem(ORDERS_HISTORY_KEY, JSON.stringify(history));
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch (err) {
    console.error('Erro ao salvar pedido:', err);
  }
};

export const getPendingOrder = (): Order | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PENDING_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const savePendingOrder = (order: Order): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(order));
};

export const clearPendingOrder = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PENDING_ORDER_KEY);
};

export const getLastOrder = (): Order | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
