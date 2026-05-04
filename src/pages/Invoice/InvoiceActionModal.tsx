import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Input,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { FaCheck, FaCopy, FaFileInvoiceDollar, FaTimes } from 'react-icons/fa';
import moment from 'moment';
import AppModal from '../../components/AppModal/AppModal';
import Colors from '../../constant/color';
import { getStatusColor } from '../../constant/status';
import { formatRupiah } from '../../utils/validation';
import type { Invoice } from '../../interface/invoice';

interface InvoiceActionModalProps {
  isOpen: boolean;
  invoice: Invoice | null;
  isAdmin: boolean;
  onClose: () => void;
  onAction: (
    invoice: Invoice,
    action: 'approve' | 'reject',
    note: string,
  ) => void;
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

const formatDate = (value: string | null | undefined) =>
  value ? moment(value).format('DD MMMM YYYY HH:mm:ss') : '-';

export default function InvoiceActionModal({
  isOpen,
  invoice,
  isAdmin,
  onClose,
  onAction,
}: InvoiceActionModalProps): React.JSX.Element | null {
  const [note, setNote] = useState('');
  const [pendingAction, setPendingAction] = useState<
    'approve' | 'reject' | null
  >(null);
  const [copied, setCopied] = useState(false);

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!invoice) return null;

  const statusColor = getStatusColor(invoice.status);
  const canApprove = isAdmin && invoice.status === 'Pending';

  const handleClose = () => {
    setNote('');
    setPendingAction(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!pendingAction) return;
    onAction(invoice, pendingAction, note);
    setNote('');
    setPendingAction(null);
  };

  return (
    <AppModal
      isOpen={isOpen}
      title={
        pendingAction
          ? `Konfirmasi ${pendingAction === 'approve' ? 'Approve' : 'Reject'}`
          : 'Detail Invoice'
      }
      subtitle={
        pendingAction
          ? 'Tindakan ini tidak dapat dibatalkan setelah dikonfirmasi.'
          : 'Informasi invoice'
      }
      onClose={handleClose}
      maxW="760px"
      footer={
        pendingAction ? (
          <>
            <Button
              variant="outline"
              borderRadius="xl"
              onClick={() => setPendingAction(null)}
            >
              Kembali
            </Button>
            <Button
              borderRadius="xl"
              bg={pendingAction === 'approve' ? Colors.success : Colors.danger}
              color="white"
              _hover={{
                bg: pendingAction === 'approve' ? '#047857' : '#B91C1C',
              }}
              onClick={handleConfirm}
            >
              {pendingAction === 'approve' ? (
                <>
                  <Icon as={FaCheck} /> Ya, Approve
                </>
              ) : (
                <>
                  <Icon as={FaTimes} /> Ya, Reject
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" borderRadius="xl" onClick={handleClose}>
              Tutup
            </Button>
            {canApprove && (
              <>
                <Button
                  borderRadius="xl"
                  bg={Colors.danger}
                  color="white"
                  _hover={{ bg: '#B91C1C' }}
                  onClick={() => setPendingAction('reject')}
                >
                  <Icon as={FaTimes} />
                  Reject
                </Button>
                <Button
                  borderRadius="xl"
                  bg={Colors.success}
                  color="white"
                  _hover={{ bg: '#047857' }}
                  onClick={() => setPendingAction('approve')}
                >
                  <Icon as={FaCheck} />
                  Approve
                </Button>
              </>
            )}
          </>
        )
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
                {invoice.merchant_name ?? '-'}
              </Text>
              <Text fontSize="xl" fontWeight="bold">
                {formatRupiah(Number(invoice.amount))}
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

        {!pendingAction ? (
          <>
            <DetailItem label="No Invoice" value={invoice.id} />
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap="4"
            >
              <DetailItem label="Type" value={invoice.payment_type} />
              <DetailItem label="Description" value={invoice.description} />
              <DetailItem
                label="Status Pembayaran"
                value={invoice.status}
                color={statusColor}
              />
              <DetailItem
                label="Email Merchant"
                value={invoice.merchant_email || '-'}
              />
              <DetailItem
                label="Created At"
                value={formatDate(invoice.created_at)}
              />
              <DetailItem
                label="Due Date"
                value={formatDate(invoice.due_date)}
              />
            </Grid>

            {invoice.payment_token && (
              <Box>
                <Text fontSize="sm" mb="2" fontWeight="medium">
                  Payment Token
                </Text>
                <Flex gap="2">
                  <Input
                    value={invoice.payment_token}
                    readOnly
                    borderRadius="xl"
                    fontSize="xs"
                    fontFamily="mono"
                    bg={Colors.bgSecondary}
                    color={Colors.textSecondary}
                  />
                  <Button
                    flexShrink={0}
                    borderRadius="xl"
                    variant="outline"
                    onClick={() => handleCopyToken(invoice.payment_token!)}
                    title="Salin token"
                  >
                    <Icon as={FaCopy} />
                    {copied ? 'Disalin!' : 'Salin'}
                  </Button>
                </Flex>
              </Box>
            )}

            {canApprove && (
              <Box>
                <Text fontSize="sm" mb="2" fontWeight="medium">
                  Catatan Review
                </Text>
                <Textarea
                  value={note}
                  placeholder="Tulis catatan untuk approval..."
                  borderRadius="xl"
                  onChange={(e) => setNote(e.target.value)}
                />
              </Box>
            )}
          </>
        ) : (
          <Box
            bg={pendingAction === 'approve' ? '#F0FDF4' : '#FEF2F2'}
            border={`1px solid ${pendingAction === 'approve' ? '#BBF7D0' : '#FECACA'}`}
            borderRadius="16px"
            p={5}
            textAlign="center"
          >
            <Text fontWeight="600" color={Colors.textPrimary}>
              Invoice
              {invoice.merchant_name ? ` dari ${invoice.merchant_name}` : ''}{' '}
              sebesar{' '}
              <Text as="span" fontWeight="700">
                {formatRupiah(Number(invoice.amount))}
              </Text>{' '}
              akan di-
              <Text
                as="span"
                fontWeight="700"
                color={
                  pendingAction === 'approve' ? Colors.success : Colors.danger
                }
              >
                {pendingAction === 'approve' ? 'APPROVE' : 'REJECT'}
              </Text>
              .
            </Text>
            {note && (
              <Text mt={3} fontSize="sm" color={Colors.textSecondary}>
                Catatan: {note}
              </Text>
            )}
          </Box>
        )}
      </VStack>
    </AppModal>
  );
}
