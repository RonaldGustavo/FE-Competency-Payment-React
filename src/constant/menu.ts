import {
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaUndoAlt,
  FaWallet,
} from 'react-icons/fa';

import { Dashboard, Invoice, Refund, Wallet } from '../pages';

export const Menu = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: FaTachometerAlt,
    element: Dashboard,
    roles: ['Admin', 'Merchant'],
  },
  {
    label: 'Invoice',
    path: '/invoice',
    icon: FaFileInvoiceDollar,
    element: Invoice,
    roles: ['Admin', 'Merchant'],
  },
  {
    label: 'Refund',
    path: '/refund',
    icon: FaUndoAlt,
    element: Refund,
    roles: ['Admin', 'Merchant'], 
  },
  {
    label: 'Wallet',
    path: '/wallet',
    icon: FaWallet,
    element: Wallet,
    roles: ['Merchant'],
  },
];