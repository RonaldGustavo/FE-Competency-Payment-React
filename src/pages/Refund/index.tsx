import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import Table from '../../components/Table/Table';
import Colors from '../../constant/color';
import type { Column } from '../../interface';
import dataRefund from '../../mock/dataRefund.json';
import { statusColors } from '../../constant/status';
import PageHeader from '../../components/PageHeader/PageHeader';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';

const Refund = (): React.JSX.Element => {
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
      key: 'customerName',
      header: 'Name',
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
      <PageHeader title='Refund Management' subtitle='Manage and track refund requests' />

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
  actions={[
    {
      icon: <FaEye />,
      label: 'View',
      onClick: (row) => console.log(row),
    },
    {
      icon: <FaEdit />,
      label: 'Edit',
      onClick: (row) => console.log(row),
    },
    {
      icon: <FaTrash />,
      label: 'Delete',
      colorScheme: 'red',
      onClick: (row) => console.log(row),
    },
  ]}
/>
    </Box>
    </VStack>
  );
};

export default Refund;
