export const ROUTES = {
  home: '/',
  catalog: '/catalog',
  gameDetails: (id: string | number) => `/game/${id}`,
  cart: '/cart',
  checkout: '/checkout',
  orders: '/orders',
  login: '/login',
  register: '/register',
  paymentPix: '/payment/pix',
  paymentBoleto: '/payment/boleto',
  success: '/success',
  cancel: '/cancel',
} as const;
