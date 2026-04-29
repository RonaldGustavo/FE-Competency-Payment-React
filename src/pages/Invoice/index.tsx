import React, { useState, type FormEvent } from 'react';
import { Box, Button, Flex, Input, Text, VStack, chakra } from '@chakra-ui/react';
import Swal from 'sweetalert2';
import Table from '../../components/Table/Table';
import Colors from '../../constant/color';
import type { Column } from '../../interface';
import dataInvoice from '../../mock/dataInvoice.json';
import { statusColors } from '../../constant/status';
import PageHeader from '../../components/PageHeader/PageHeader';
import { FaEye, FaPlus } from 'react-icons/fa';
import { useAppSelector } from '../../config/hook';
import AppModal from '../../components/AppModal/AppModal';
import {
  formatRupiah,
  getTodayDate,
  isFutureOrToday,
  isValidEmail,
} from '../../utils/validation';
import InvoiceActionModal, { type InvoiceRow } from './InvoiceActionModal';

interface InvoiceForm {
  name_merchant: string;
  email: string;
  amount: string;
  method: string;
  due_date: string;
}

type InvoiceFormErrors = Partial<Record<keyof InvoiceForm, string>>;

const initialInvoiceForm: InvoiceForm = {
  name_merchant: '',
  email: '',
  amount: '',
  method: 'WALLET',
  due_date: getTodayDate(),
};

const createInvoiceNumber = (rows: InvoiceRow[]) => {
  const lastNumber = rows.reduce((max, row) => {
    const current = Number(row.no_invoice.replace(/\D/g, ''));
    return Number.isNaN(current) ? max : Math.max(max, current);
  }, 0);

  return `INV-${String(lastNumber + 1).padStart(4, '0')}`;
};

const Invoice = (): React.JSX.Element => {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'Admin';
  const [invoiceRows, setInvoiceRows] = useState<InvoiceRow[]>(
    dataInvoice as InvoiceRow[],
  );
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRow | null>(
    null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] =
    useState<InvoiceForm>(initialInvoiceForm);
  const [formErrors, setFormErrors] = useState<InvoiceFormErrors>({});

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setInvoiceForm(initialInvoiceForm);
    setFormErrors({});
  };

  const columns: Column[] = [
    {
      key: 'no_invoice',
      header: 'No Invoice',
    },
    {
      key: 'name_merchant',
      header: 'Nama Merchant',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value) => formatRupiah(value as number),
    },
    {
      key: 'method',
      header: 'Method',
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
      key: 'due_date',
      header: 'Due Date',
    },
    {
      key: 'created_at',
      header: 'Created At',
    },
  ];

  const validateInvoiceForm = () => {
    const errors: InvoiceFormErrors = {};
    const amount = Number(invoiceForm.amount);

    if (!invoiceForm.name_merchant.trim()) {
      errors.name_merchant = 'Nama merchant wajib diisi.';
    }

    if (!invoiceForm.email.trim()) {
      errors.email = 'Email wajib diisi.';
    } else if (!isValidEmail(invoiceForm.email)) {
      errors.email = 'Format email tidak valid.';
    }

    if (!invoiceForm.amount.trim()) {
      errors.amount = 'Amount wajib diisi.';
    } else if (Number.isNaN(amount) || amount <= 0) {
      errors.amount = 'Amount harus lebih dari 0.';
    }

    if (!invoiceForm.due_date) {
      errors.due_date = 'Due date wajib diisi.';
    } else if (!isFutureOrToday(invoiceForm.due_date)) {
      errors.due_date = 'Due date minimal hari ini.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateInvoice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInvoiceForm()) {
      await Swal.fire({
        icon: 'error',
        title: 'Form belum valid',
        text: 'Periksa kembali error pada form invoice.',
      });
      return;
    }

    const result = await Swal.fire({
      icon: 'question',
      title: 'Buat invoice baru?',
      text: 'Invoice akan masuk dengan status PENDING.',
      showCancelButton: true,
      confirmButtonText: 'Ya, buat',
      cancelButtonText: 'Batal',
      confirmButtonColor: Colors.primary,
    });

    if (!result.isConfirmed) return;

    const newInvoice: InvoiceRow = {
      no_invoice: createInvoiceNumber(invoiceRows),
      name_merchant: invoiceForm.name_merchant.trim(),
      email: invoiceForm.email.trim(),
      amount: Number(invoiceForm.amount),
      method: invoiceForm.method,
      status: 'PENDING',
      due_date: invoiceForm.due_date,
      created_at: getTodayDate(),
    };

    setInvoiceRows((currentRows) => [newInvoice, ...currentRows]);
    setInvoiceForm(initialInvoiceForm);
    setFormErrors({});
    setIsCreateModalOpen(false);

    await Swal.fire({
      icon: 'success',
      title: 'Invoice berhasil dibuat',
      text: `${newInvoice.no_invoice} sudah ditambahkan.`,
      confirmButtonColor: Colors.primary,
    });
  };

  const handleApproval = async (
    invoice: InvoiceRow,
    status: 'APPROVED' | 'REJECTED',
  ) => {
    const isApprove = status === 'APPROVED';
    const result = await Swal.fire({
      icon: 'warning',
      title: `${isApprove ? 'Approve' : 'Reject'} invoice?`,
      text: `${invoice.no_invoice} akan diubah menjadi ${status}.`,
      showCancelButton: true,
      confirmButtonText: isApprove ? 'Ya, approve' : 'Ya, reject',
      cancelButtonText: 'Batal',
      confirmButtonColor: isApprove ? Colors.success : Colors.danger,
    });

    if (!result.isConfirmed) return;

    setInvoiceRows((currentRows) =>
      currentRows.map((row) =>
        row.no_invoice === invoice.no_invoice ? { ...row, status } : row,
      ),
    );
    setSelectedInvoice(null);

    await Swal.fire({
      icon: 'success',
      title: 'Status invoice diperbarui',
      text: `${invoice.no_invoice} sekarang ${status}.`,
      confirmButtonColor: Colors.primary,
    });
  };

  return (
    <VStack gap={6} align="stretch">
      <PageHeader
        title="Invoice Management"
        subtitle="History Invoice and Create Invoice"
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
            Create Invoice
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
          data={invoiceRows}
          columns={columns}
          actions={[
            {
              icon: <FaEye />,
              label: 'Detail',
              onClick: (row) => setSelectedInvoice(row as InvoiceRow),
              bg: '#4253d1',
            },
          ]}
        />
      </Box>

      <AppModal
        isOpen={isCreateModalOpen}
        title="Create Invoice"
        subtitle="Buat invoice baru untuk customer."
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
              form="create-invoice-form"
              type="submit"
              borderRadius="xl"
              bg={Colors.primary}
              color="white"
              _hover={{ bg: Colors.primaryDark }}
            >
              Simpan Invoice
            </Button>
          </>
        }
      >
        <form id="create-invoice-form" onSubmit={handleCreateInvoice}>
          <VStack gap="4" align="stretch">
            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Nama Merchant
              </Text>
              <Input
                value={invoiceForm.name_merchant}
                placeholder="Toko Sukses Jaya"
                borderRadius="xl"
                onChange={(event) =>
                  setInvoiceForm((current) => ({
                    ...current,
                    name_merchant: event.target.value,
                  }))
                }
              />
              {formErrors.name_merchant && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>
                  {formErrors.name_merchant}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Email Customer
              </Text>
              <Input
                type="email"
                value={invoiceForm.email}
                placeholder="customer@email.com"
                borderRadius="xl"
                onChange={(event) =>
                  setInvoiceForm((current) => ({
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
                value={invoiceForm.amount}
                placeholder="150000"
                borderRadius="xl"
                onChange={(event) =>
                  setInvoiceForm((current) => ({
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
                Method
              </Text>
              <chakra.select
                value={invoiceForm.method}
                onChange={(event) =>
                  setInvoiceForm((current) => ({
                    ...current,
                    method: event.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  border: `1px solid ${Colors.borderPrimary}`,
                  padding: '12px 14px',
                }}
              >
                <option value="WALLET">WALLET</option>
                <option value="VA_DUMMY">VA_DUMMY</option>
                <option value="EWALLET_DUMMY">EWALLET_DUMMY</option>
              </chakra.select>
            </Box>

            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Due Date
              </Text>
              <Input
                type="date"
                min={getTodayDate()}
                value={invoiceForm.due_date}
                borderRadius="xl"
                onChange={(event) =>
                  setInvoiceForm((current) => ({
                    ...current,
                    due_date: event.target.value,
                  }))
                }
              />
              {formErrors.due_date && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>
                  {formErrors.due_date}
                </Text>
              )}
            </Box>
          </VStack>
        </form>
      </AppModal>

      <InvoiceActionModal
        isOpen={Boolean(selectedInvoice)}
        invoice={selectedInvoice}
        isAdmin={isAdmin}
        onClose={() => setSelectedInvoice(null)}
        onApprove={(invoice) => handleApproval(invoice, 'APPROVED')}
        onReject={(invoice) => handleApproval(invoice, 'REJECTED')}
      />
    </VStack>
  );
};

export default Invoice;
