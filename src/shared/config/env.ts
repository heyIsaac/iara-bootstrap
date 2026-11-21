export const ENV = {
  rawgApiKey:
    process.env.NEXT_PUBLIC_RAWG_KEY ||
    process.env.REACT_APP_RAWG_KEY ||
    'b839705fc6404b13b54780739df24e63',
  reqresBaseUrl:
    process.env.NEXT_PUBLIC_REQRES_BASE_URL ||
    process.env.REACT_APP_REQRES_BASE_URL ||
    'https://reqres.in/api',
  stripePublishableKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
    '',
} as const;
