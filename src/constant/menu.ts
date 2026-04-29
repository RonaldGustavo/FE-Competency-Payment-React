import {
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaUndoAlt,
  FaWallet,
} from 'react-icons/fa';

import Dashboard from '../pages/Dashboard';
import Invoice from '../pages/Invoice';
import Refund from '../pages/Refund';
import Wallet from '../pages/Wallet';

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
    roles: ['Admin','Merchant'],
  },
];