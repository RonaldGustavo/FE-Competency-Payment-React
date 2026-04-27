import {
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaUndoAlt,
  FaWallet,
} from 'react-icons/fa';

import { Dashboard, Invoice, Payment, Refund, Wallet } from '../pages';

export const Menu = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: FaTachometerAlt,
    element: Dashboard,
  },
  {
    label: 'Invoice',
    path: '/invoice',
    icon: FaFileInvoiceDollar,
    element: Invoice,
  },
  {
    label: 'Payment',
    path: '/payment',
    icon: FaCreditCard,
    element: Payment,
  },
  {
    label: 'Refund',
    path: '/refund',
    icon: FaUndoAlt,
    element: Refund,
  },
  {
    label: 'Wallet',
    path: '/wallet',
    icon: FaWallet,
    element: Wallet,
  },
];