import { Box, Grid, GridItem } from '@chakra-ui/react';
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaUndoAlt,
} from 'react-icons/fa';
import StatsCard from '../../components/StatsCard/StatsCard';
import TransactionTable from '../../components/TransactionTable/TransactionTable';
import WelcomeCard from '../../components/WelcomeCard/WelcomeCard';
import Colors from '../../constant/color';

const mockTransactions = [
  {
    id: '1',
    description: 'Payment - Acme Corp',
    amount: '$2,500.00',
    status: 'completed' as const,
    date: 'Apr 24, 2026',
    type: 'payment' as const,
  },
  {
    id: '2',
    description: 'Invoice - TechStart Inc',
    amount: '$1,200.50',
    status: 'pending' as const,
    date: 'Apr 25, 2026',
    type: 'invoice' as const,
  },
  {
    id: '3',
    description: 'Refund - Customer Return',
    amount: '-$500.00',
    status: 'completed' as const,
    date: 'Apr 23, 2026',
    type: 'refund' as const,
  },
  {
    id: '4',
    description: 'Payment - Global Services',
    amount: '$3,750.00',
    status: 'completed' as const,
    date: 'Apr 22, 2026',
    type: 'payment' as const,
  },
];

const Dashboard = () => {
  return (
    <Box w="100%">
      <WelcomeCard userName="Ronald" userRole="Admin" />

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={6}
        mb={8}
      >
        <GridItem>
          <StatsCard
            icon={<FaMoneyBillWave />}
            label="Total Revenue"
            value="$45,231"
            change={{ value: 12.5, isPositive: true }}
            bgColor={Colors.primary}
            iconBg="#3B82F615"
          />
        </GridItem>

        <GridItem>
          <StatsCard
            icon={<FaCreditCard />}
            label="Total Payments"
            value="128"
            change={{ value: 8.2, isPositive: true }}
            bgColor={Colors.info}
            iconBg="#06B6D415"
          />
        </GridItem>

        <GridItem>
          <StatsCard
            icon={<FaUndoAlt />}
            label="Total Refund"
            value="24"
            change={{ value: 2.4, isPositive: true }}
            bgColor={Colors.success}
            iconBg="#10B98115"
          />
        </GridItem>

        <GridItem>
          <StatsCard
            icon={<FaExchangeAlt />}
            label="Pending Transactions"
            value="12"
            change={{ value: 3.1, isPositive: false }}
            bgColor={Colors.warning}
            iconBg="#F59E0B15"
          />
        </GridItem>
      </Grid>


      <Box mt={8}>
        <TransactionTable
          title="Recent Transactions"
          transactions={mockTransactions}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;