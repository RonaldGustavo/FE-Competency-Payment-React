import React from 'react';
import { Box, Button, Flex, VStack } from '@chakra-ui/react';
import Table from '../../components/Table/Table';
import Colors from '../../constant/color';
import type { Column } from '../../interface';
import dataWallet from '../../mock/dataWallet.json';
import { statusColors } from '../../constant/status';
import PageHeader from '../../components/PageHeader/PageHeader';
import { FaPlus } from 'react-icons/fa';

const Wallet = (): React.JSX.Element => {
const columns: Column[] = [
  {
    key: 'merchant_name',
    header: 'Merchant',
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
    render: (value) => {
      const status = value as keyof typeof statusColors;
      const color = statusColors[status] ?? Colors.textSecondary;

      return (
        <Box
          as="span"
          px="2"
          py="1"
          borderRadius="md"
          fontSize="xs"
          fontWeight="bold"
          bg={`${color}20`}
          color={color}
        >
          {value}
        </Box>
      );
    },
  },
  {
    key: 'processed_at',
    header: 'Processed At',
  },
];

  return (
    <VStack gap={6} align="stretch">
      <PageHeader
        title="Wallet Management"
        subtitle="Top Up and History Wallet Saldo"
      />

      <Flex justifyContent="end">
        <Button
          size="sm"
          bg={'#2e8c73'}
          minW={['100%', 125]}
          borderRadius={'5px'}
          onClick={() => console.log('show modal form refund')}
        >
          <FaPlus />
          Top Up Wallet
        </Button>
      </Flex>

      <Box
        bg={Colors.white}
        borderRadius="12px"
        border={`1px solid ${Colors.borderPrimary}`}
        p={6}
        boxShadow={Colors.cardShadow}
      >
        <Table
          data={dataWallet}
          columns={columns}
        />
      </Box>
    </VStack>
  );
};

export default Wallet;
