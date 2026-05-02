const ApiEndpoint = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    profile: '/users/profile',
    logout: '/auth/logout',
  },
  wallet: {
    balance: '/wallet/balance',
    topUps: '/wallet/top-ups',
    reviewTopUp: (id: string) => `/wallet/top-ups/${id}/review`,
  },
  invoice: {
    list: '/invoices',
    create: '/invoices',
    detail: (id: string) => `/invoices/${id}`,
    review: (id: string) => `/invoices/${id}/review`,
    delete: (id: string) => `/invoices/${id}`,
    paymentByToken: (token: string) => `/invoices/pay/${token}`,
    pay: (token: string) => `/invoices/pay/${token}`,
  },
};

export default ApiEndpoint;
