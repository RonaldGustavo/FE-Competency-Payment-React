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
  },
  {
    label: 'Invoice',
    path: '/invoice',
    icon: FaFileInvoiceDollar,
    element: Invoice,
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