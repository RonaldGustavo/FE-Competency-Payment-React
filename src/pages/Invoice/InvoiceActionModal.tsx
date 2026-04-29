import React from 'react';
import { Box, Button, Flex, Grid, Icon, Text, VStack } from '@chakra-ui/react';
import { FaCheck, FaFileInvoiceDollar, FaTimes } from 'react-icons/fa';
import AppModal from '../../components/AppModal/AppModal';
import Colors from '../../constant/color';
import { statusColors } from '../../constant/status';
import { formatRupiah } from '../../utils/validation';

export interface InvoiceRow {
  no_invoice: string;
  name_merchant: string;
  email?: string;
  amount: number;
  method: string;
  status: string;
  due_date: string;
  created_at: string;
}

interface InvoiceActionModalProps {
  isOpen: boolean;
  invoice: InvoiceRow | null;
  isAdmin: boolean;
  onClose: () => void;
  onApprove: (invoice: InvoiceRow) => void;
  onReject: (invoice: InvoiceRow) => void;
}

const DetailItem = ({
  label,
  value,
  color,
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
}) => (
  <Box
    border={`1px solid ${Colors.borderPrimary}`}
    borderRadius="16px"
    p="4"
    bg={Colors.bgPrimary}
  >
    <Text fontSize="xs" color={Colors.textSecondary}>
      {label}
    </Text>
    <Text mt="1" fontWeight="700" color={color ?? Colors.textPrimary}>
      {value}
    </Text>
  </Box>
);

export default function InvoiceActionModal({
  isOpen,
  invoice,
  isAdmin,
  onClose,
  onApprove,
  onReject,
}: InvoiceActionModalProps): React.JSX.Element | null {
  if (!invoice) return null;

  const statusColor = statusColors[invoice.status] ?? Colors.textSecondary;

  return (
    <AppModal
      isOpen={isOpen}
      title="Detail Invoice"
      subtitle="Informasi invoice dan approval dalam satu modal."
      onClose={onClose}
      maxW="760px"
      footer={
        <>
          <Button variant="outline" borderRadius="xl" onClick={onClose}>
            Tutup
          </Button>

          {isAdmin && (
            <>
              <Button
                borderRadius="xl"
                bg={Colors.danger}
                color="white"
                _hover={{ bg: '#B91C1C' }}
                onClick={() => onReject(invoice)}
              >
                <Icon as={FaTimes} />
                Reject
              </Button>
              <Button
                borderRadius="xl"
                bg={Colors.success}
                color="white"
                _hover={{ bg: '#047857' }}
                onClick={() => onApprove(invoice)}
              >
                <Icon as={FaCheck} />
                Approve
              </Button>
            </>
          )}
        </>
      }
    >
      <VStack align="stretch" gap="6">
        <Flex
          align="center"
          justify="space-between"
          gap="4"
          p="5"
          borderRadius="18px"
          bg={`linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.info} 100%)`}
          color={Colors.white}
        >
          <Flex align="center" gap="4">
            <Flex
              boxSize="12"
              align="center"
              justify="center"
              borderRadius="xl"
              bg="rgba(255, 255, 255, 0.2)"
            >
              <Icon as={FaFileInvoiceDollar} boxSize="6" />
            </Flex>
            <Box>
              <Text fontSize="xs" opacity={0.82}>
                {invoice.no_invoice}
              </Text>
              <Text fontSize="xl" fontWeight="bold">
                {invoice.name_merchant}
              </Text>
            </Box>
          </Flex>

          <Box
            px="4"
            py="2"
            borderRadius="full"
            bg="rgba(255, 255, 255, 0.18)"
            fontWeight="bold"
          >
            {invoice.status}
          </Box>
        </Flex>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="4">
          <DetailItem label="Amount" value={formatRupiah(invoice.amount)} />
          <DetailItem label="Method" value={invoice.method} />
          <DetailItem
            label="Status Pembayaran"
            value={invoice.status}
            color={statusColor}
          />
          <DetailItem label="Email" value={invoice.email || '-'} />
          <DetailItem label="Created At" value={invoice.created_at} />
          <DetailItem label="Due Date" value={invoice.due_date} />
        </Grid>
      </VStack>
    </AppModal>
  );
}
