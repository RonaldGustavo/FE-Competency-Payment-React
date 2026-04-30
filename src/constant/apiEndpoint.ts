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
  }
};

export default ApiEndpoint;
