import React from 'react';
import { Box, Button, Flex, VStack } from '@chakra-ui/react';
import Table from '../../components/Table/Table';
import Colors from '../../constant/color';
import type { Column } from '../../interface';
import dataRefund from '../../mock/dataRefund.json';
import { statusColors } from '../../constant/status';
import PageHeader from '../../components/PageHeader/PageHeader';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { useAppSelector } from '../../config/hook';

const Refund = (): React.JSX.Element => {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'Admin';

  const columns: Column[] = [
    {
      key: 'id',
      header: 'ID',
    },
    {
      key: 'transactionId',
      header: 'Transaction ID',
    },
    {
      key: 'customerName',
      header: 'Customer Name',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value) => `$${(value as number).toFixed(2)}`,
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
      key: 'requestDate',
      header: 'Request Date',
    },
    {
      key: 'reason',
      header: 'Reason',
    },
  ];

  return (
    <VStack gap={6} align="stretch">
      <PageHeader
        title="Refund Management"
        subtitle="Manage and track refund requests"
      />

      {!isAdmin && (
        <Flex justifyContent="end">
          <Button
            size="sm"
            bg={'#2e8c73'}
            minW={['100%', 125]}
            borderRadius={'5px'}
            onClick={() => console.log('show modal form refund')}
          >
            <FaPlus />
            Request Refund
          </Button>
        </Flex>
      )}

      <Box
        bg={Colors.white}
        borderRadius="12px"
        border={`1px solid ${Colors.borderPrimary}`}
        p={6}
        boxShadow={Colors.cardShadow}
      >
        <Table
          data={dataRefund}
          columns={columns}
          actions={
            isAdmin
              ? [
                  {
                    icon: <FaEdit />,
                    label: 'Edit',
                    onClick: (row) => console.log(row),
                    bg: '#de943a',
                  },
                ]
              : undefined
          }
        />
      </Box>
    </VStack>
  );
};

export default Refund;
