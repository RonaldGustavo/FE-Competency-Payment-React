import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaUndoAlt,
} from 'react-icons/fa';
import StatsCard from '../../components/StatsCard/StatsCard';
import WelcomeCard from '../../components/WelcomeCard/WelcomeCard';
import Colors from '../../constant/color';
import type { Column } from '../../interface/global';
import Table from '../../components/Table/Table';
import dataTransaction from '../../mock/dataTransaction.json'

  const columns: Column[] = [
    {
      key: 'description',
      header: 'Description',
    },
    {
      key: 'type',
      header: 'Type',
    },
    {
      key: 'amount',
      header: 'Amount',
    },
    {
      key: 'status',
      header: 'Status',
    },
    {
      key: 'date',
      header: 'Date',
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

              <Box  mb={4}>
        <Text fontSize="lg" fontWeight="700" color={Colors.textPrimary}>
          Recent Transactions
        </Text>
      </Box>
      <Box
        bg={Colors.white}
        borderRadius="12px"
        border={`1px solid ${Colors.borderPrimary}`}
        p={6}
        boxShadow={Colors.cardShadow}
      >
        <>
        <Table
          data={dataTransaction}
          columns={columns}
          />
          </>
      </Box>
    </Box>
  );
};

export default Dashboard;