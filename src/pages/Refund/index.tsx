import React, { useState, type FormEvent } from 'react';
import { Box, Button, Flex, Grid, Input, Text, VStack } from '@chakra-ui/react';
import Swal from 'sweetalert2';
import Table from '../../components/Table/Table';
import Colors from '../../constant/color';
import type { Column } from '../../interface';
import dataRefund from '../../mock/dataRefund.json';
import { statusColors } from '../../constant/status';
import PageHeader from '../../components/PageHeader/PageHeader';
import { FaCheck, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';
import { useAppSelector } from '../../config/hook';
import AppModal from '../../components/AppModal/AppModal';
import { getTodayDate, isFutureOrToday, isValidEmail } from '../../utils/validation';

interface RefundRow {
  id: string;
  transactionId: string;
  customerName: string;
  email?: string;
  amount: number;
  status: string;
  requestDate: string;
  reason: string;
}

interface RefundForm {
  transactionId: string;
  customerName: string;
  email: string;
  amount: string;
  requestDate: string;
  reason: string;
}

type RefundFormErrors = Partial<Record<keyof RefundForm, string>>;

const initialRefundForm: RefundForm = {
  transactionId: '',
  customerName: '',
  email: '',
  amount: '',
  requestDate: getTodayDate(),
  reason: '',
};

const createRefundId = (rows: RefundRow[]) => {
  const lastNumber = rows.reduce((max, row) => {
    const current = Number(row.id.replace(/\D/g, ''));
    return Number.isNaN(current) ? max : Math.max(max, current);
  }, 0);

  return `REF${String(lastNumber + 1).padStart(3, '0')}`;
};

const Refund = (): React.JSX.Element => {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'Admin';
  const [refundRows, setRefundRows] = useState<RefundRow[]>(
    dataRefund as RefundRow[],
  );
  const [selectedRefund, setSelectedRefund] = useState<RefundRow | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refundForm, setRefundForm] = useState<RefundForm>(initialRefundForm);
  const [formErrors, setFormErrors] = useState<RefundFormErrors>({});

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setRefundForm(initialRefundForm);
    setFormErrors({});
  };

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

  const validateRefundForm = () => {
    const errors: RefundFormErrors = {};
    const amount = Number(refundForm.amount);

    if (!refundForm.transactionId.trim()) {
      errors.transactionId = 'Transaction ID wajib diisi.';
    }

    if (!refundForm.customerName.trim()) {
      errors.customerName = 'Customer name wajib diisi.';
    }

    if (!refundForm.email.trim()) {
      errors.email = 'Email wajib diisi.';
    } else if (!isValidEmail(refundForm.email)) {
      errors.email = 'Format email tidak valid.';
    }

    if (!refundForm.amount.trim()) {
      errors.amount = 'Amount wajib diisi.';
    } else if (Number.isNaN(amount) || amount <= 0) {
      errors.amount = 'Amount harus lebih dari 0.';
    }

    if (!refundForm.requestDate) {
      errors.requestDate = 'Request date wajib diisi.';
    } else if (!isFutureOrToday(refundForm.requestDate)) {
      errors.requestDate = 'Request date minimal hari ini.';
    }

    if (!refundForm.reason.trim()) {
      errors.reason = 'Reason wajib diisi.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRefund = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateRefundForm()) {
      await Swal.fire({
        icon: 'error',
        title: 'Form belum valid',
        text: 'Periksa kembali error pada form refund.',
      });
      return;
    }

    const result = await Swal.fire({
      icon: 'question',
      title: 'Kirim request refund?',
      text: 'Request refund akan masuk dengan status Pending.',
      showCancelButton: true,
      confirmButtonText: 'Ya, kirim',
      cancelButtonText: 'Batal',
      confirmButtonColor: Colors.primary,
    });

    if (!result.isConfirmed) return;

    const newRefund: RefundRow = {
      id: createRefundId(refundRows),
      transactionId: refundForm.transactionId.trim(),
      customerName: refundForm.customerName.trim(),
      email: refundForm.email.trim(),
      amount: Number(refundForm.amount),
      status: 'Pending',
      requestDate: refundForm.requestDate,
      reason: refundForm.reason.trim(),
    };

    setRefundRows((currentRows) => [newRefund, ...currentRows]);
    setRefundForm(initialRefundForm);
    setFormErrors({});
    setIsCreateModalOpen(false);

    await Swal.fire({
      icon: 'success',
      title: 'Request refund dibuat',
      text: `${newRefund.id} sudah ditambahkan.`,
      confirmButtonColor: Colors.primary,
    });
  };

  const handleRefundApproval = async (
    refund: RefundRow,
    status: 'Approved' | 'Rejected',
  ) => {
    const isApprove = status === 'Approved';
    const result = await Swal.fire({
      icon: 'warning',
      title: `${isApprove ? 'Approve' : 'Reject'} refund?`,
      text: `${refund.id} akan diubah menjadi ${status}.`,
      showCancelButton: true,
      confirmButtonText: isApprove ? 'Ya, approve' : 'Ya, reject',
      cancelButtonText: 'Batal',
      confirmButtonColor: isApprove ? Colors.success : Colors.danger,
    });

    if (!result.isConfirmed) return;

    setRefundRows((currentRows) =>
      currentRows.map((row) =>
        row.id === refund.id ? { ...row, status } : row,
      ),
    );
    setSelectedRefund(null);

    await Swal.fire({
      icon: 'success',
      title: 'Status refund diperbarui',
      text: `${refund.id} sekarang ${status}.`,
      confirmButtonColor: Colors.primary,
    });
  };

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
            onClick={() => setIsCreateModalOpen(true)}
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
          data={refundRows}
          columns={columns}
          actions={
            isAdmin
              ? [
                  {
                    icon: <FaEdit />,
                    label: 'Approval',
                    onClick: (row) => setSelectedRefund(row as RefundRow),
                    bg: '#de943a',
                  },
                ]
              : undefined
          }
        />
      </Box>

      <AppModal
        isOpen={isCreateModalOpen}
        title="Request Refund"
        subtitle="Ajukan refund untuk transaksi customer."
        onClose={closeCreateModal}
        footer={
          <>
            <Button
              variant="outline"
              borderRadius="xl"
              onClick={closeCreateModal}
            >
              Batal
            </Button>
            <Button
              form="create-refund-form"
              type="submit"
              borderRadius="xl"
              bg={Colors.primary}
              color="white"
              _hover={{ bg: Colors.primaryDark }}
            >
              Kirim Request
            </Button>
          </>
        }
      >
        <form id="create-refund-form" onSubmit={handleCreateRefund}>
          <VStack gap="4" align="stretch">
            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Transaction ID
              </Text>
              <Input
                value={refundForm.transactionId}
                placeholder="TXN123456"
                borderRadius="xl"
                onChange={(event) =>
                  setRefundForm((current) => ({
                    ...current,
                    transactionId: event.target.value,
                  }))
                }
              />
              {formErrors.transactionId && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>
                  {formErrors.transactionId}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Customer Name
              </Text>
              <Input
                value={refundForm.customerName}
                placeholder="John Doe"
                borderRadius="xl"
                onChange={(event) =>
                  setRefundForm((current) => ({
                    ...current,
                    customerName: event.target.value,
                  }))
                }
              />
              {formErrors.customerName && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>
                  {formErrors.customerName}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Email Customer
              </Text>
              <Input
                type="email"
                value={refundForm.email}
                placeholder="customer@email.com"
                borderRadius="xl"
                onChange={(event) =>
                  setRefundForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
              {formErrors.email && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>
                  {formErrors.email}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Amount
              </Text>
              <Input
                type="number"
                min="1"
                value={refundForm.amount}
                placeholder="150000"
                borderRadius="xl"
                onChange={(event) =>
                  setRefundForm((current) => ({
                    ...current,
                    amount: event.target.value,
                  }))
                }
              />
              {formErrors.amount && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>
                  {formErrors.amount}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Request Date
              </Text>
              <Input
                type="date"
                min={getTodayDate()}
                value={refundForm.requestDate}
                borderRadius="xl"
                onChange={(event) =>
                  setRefundForm((current) => ({
                    ...current,
                    requestDate: event.target.value,
                  }))
                }
              />
              {formErrors.requestDate && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>
                  {formErrors.requestDate}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Reason
              </Text>
              <Input
                value={refundForm.reason}
                placeholder="Product damaged"
                borderRadius="xl"
                onChange={(event) =>
                  setRefundForm((current) => ({
                    ...current,
                    reason: event.target.value,
                  }))
                }
              />
              {formErrors.reason && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>
                  {formErrors.reason}
                </Text>
              )}
            </Box>
          </VStack>
        </form>
      </AppModal>

      <AppModal
        isOpen={Boolean(selectedRefund)}
        title="Approval Refund"
        subtitle="Review request refund sebelum approve atau reject."
        onClose={() => setSelectedRefund(null)}
        maxW="720px"
        footer={
          <>
            <Button
              variant="outline"
              borderRadius="xl"
              onClick={() => setSelectedRefund(null)}
            >
              Tutup
            </Button>
            {selectedRefund && (
              <>
                <Button
                  borderRadius="xl"
                  bg={Colors.danger}
                  color="white"
                  _hover={{ bg: '#B91C1C' }}
                  onClick={() => handleRefundApproval(selectedRefund, 'Rejected')}
                >
                  <FaTimes />
                  Reject
                </Button>
                <Button
                  borderRadius="xl"
                  bg={Colors.success}
                  color="white"
                  _hover={{ bg: '#047857' }}
                  onClick={() => handleRefundApproval(selectedRefund, 'Approved')}
                >
                  <FaCheck />
                  Approve
                </Button>
              </>
            )}
          </>
        }
      >
        {selectedRefund && (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="4">
            {[
              ['Refund ID', selectedRefund.id],
              ['Transaction ID', selectedRefund.transactionId],
              ['Customer Name', selectedRefund.customerName],
              ['Email', selectedRefund.email || '-'],
              ['Amount', `$${selectedRefund.amount.toFixed(2)}`],
              ['Status', selectedRefund.status],
              ['Request Date', selectedRefund.requestDate],
              ['Reason', selectedRefund.reason],
            ].map(([label, value]) => (
              <Box
                key={label}
                border={`1px solid ${Colors.borderPrimary}`}
                borderRadius="16px"
                p="4"
                bg={Colors.bgPrimary}
              >
                <Text fontSize="xs" color={Colors.textSecondary}>
                  {label}
                </Text>
                <Text mt="1" fontWeight="700" color={Colors.textPrimary}>
                  {value}
                </Text>
              </Box>
            ))}
          </Grid>
        )}
      </AppModal>
    </VStack>
  );
};

export default Refund;
