import React from 'react';
import { Box, Badge, Flex, Text } from '@chakra-ui/react';
import Colors from '../../constant/color';

interface TableTransaction {
  id: string;
  description: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  type: 'payment' | 'refund' | 'invoice';
}

interface TransactionTableProps {
  title: string;
  transactions: TableTransaction[];
}

const statusColorMap = {
  completed: { bg: '#DCFCE7', text: Colors.success },
  pending: { bg: '#FEF3C7', text: Colors.warning },
  failed: { bg: '#FEE2E2', text: Colors.danger },
};

const typeColorMap = {
  payment: Colors.info,
  refund: Colors.success,
  invoice: Colors.primary,
};

const TransactionTable: React.FC<TransactionTableProps> = ({ title, transactions }) => {
  return (
    <Box
      bg={Colors.white}
      borderRadius="12px"
      border={`1px solid ${Colors.borderPrimary}`}
      overflow="hidden"
    >
      <Box p={6} borderBottom={`1px solid ${Colors.borderPrimary}`}>
        <Text fontSize="lg" fontWeight="700" color={Colors.textPrimary}>
          {title}
        </Text>
      </Box>

      <Box overflowX="auto">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: Colors.bgSecondary }}>
              <th
                style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  color: Colors.textSecondary,
                  fontSize: '12px',
                  fontWeight: '600',
                  borderBottom: `1px solid ${Colors.borderPrimary}`,
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  color: Colors.textSecondary,
                  fontSize: '12px',
                  fontWeight: '600',
                  borderBottom: `1px solid ${Colors.borderPrimary}`,
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  color: Colors.textSecondary,
                  fontSize: '12px',
                  fontWeight: '600',
                  borderBottom: `1px solid ${Colors.borderPrimary}`,
                }}
              >
                Amount
              </th>
              <th
                style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  color: Colors.textSecondary,
                  fontSize: '12px',
                  fontWeight: '600',
                  borderBottom: `1px solid ${Colors.borderPrimary}`,
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  color: Colors.textSecondary,
                  fontSize: '12px',
                  fontWeight: '600',
                  borderBottom: `1px solid ${Colors.borderPrimary}`,
                }}
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                style={{
                  borderBottom: `1px solid ${Colors.borderPrimary}`,
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = Colors.bgSecondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td
                  style={{
                    padding: '16px 24px',
                    color: Colors.textPrimary,
                  }}
                >
                  {transaction.description}
                </td>
                <td
                  style={{
                    padding: '16px 24px',
                  }}
                >
                  <Badge
                    bg={`${typeColorMap[transaction.type]}15`}
                    color={typeColorMap[transaction.type]}
                    px={2}
                    py={1}
                    borderRadius="6px"
                    fontSize="xs"
                    fontWeight="600"
                  >
                    {transaction.type}
                  </Badge>
                </td>
                <td
                  style={{
                    padding: '16px 24px',
                    fontWeight: '600',
                    color: Colors.textPrimary,
                  }}
                >
                  {transaction.amount}
                </td>
                <td
                  style={{
                    padding: '16px 24px',
                  }}
                >
                  <Badge
                    bg={statusColorMap[transaction.status].bg}
                    color={statusColorMap[transaction.status].text}
                    px={2}
                    py={1}
                    borderRadius="6px"
                    fontSize="xs"
                    fontWeight="600"
                  >
                    {transaction.status}
                  </Badge>
                </td>
                <td
                  style={{
                    padding: '16px 24px',
                    color: Colors.textSecondary,
                    fontSize: '14px',
                  }}
                >
                  {transaction.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      {transactions.length === 0 && (
        <Flex
          direction="column"
          align="center"
          justify="center"
          p={8}
          color={Colors.textMuted}
        >
          <Text>No transactions found</Text>
        </Flex>
      )}
    </Box>
  );
};

export default TransactionTable;
