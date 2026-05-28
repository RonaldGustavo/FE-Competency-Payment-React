import React, { useState, useCallback, useEffect, type FormEvent } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  chakra,
} from '@chakra-ui/react';
import moment from 'moment';
import Swal from 'sweetalert2';
import Table from '../../components/Table/Table';
import Colors from '../../constant/color';
import type { Column } from '../../interface/global';
import { getStatusColor } from '../../constant/status';
import PageHeader from '../../components/PageHeader/PageHeader';
import { FaEye, FaPlus } from 'react-icons/fa';
import AppModal from '../../components/AppModal/AppModal';
import { formatRupiah, getNowDatetime } from '../../utils/validation';
import { useAppSelector, useAppDispatch } from '../../config/hook';
import type { Invoice } from '../../interface/invoice';
import {
  createInvoiceApi,
  getInvoicesApi,
  reviewInvoiceApi,
} from '../../features/invoice/InvoiceService';
import {
  setInvoiceLoading,
  setInvoiceList,
  setInvoicePage,
  setInvoicePerPage,
  setInvoiceSearch,
  setInvoiceStatusFilter,
} from '../../features/invoice/InvoiceSlice';
import InvoiceActionModal from './InvoiceActionModal';

const INVOICE_STATUS_OPTIONS = ['', 'Pending', 'Failed', 'Paid', 'Expired', 'Refund'] as const;

const formatDate = (value: string | null | undefined) =>
  value ? moment(value).format('DD MMMM YYYY HH:mm:ss') : '-';

interface InvoiceForm {
  amount: string;
  description: string;
  due_date: string;
}

type InvoiceFormErrors = Partial<Record<keyof InvoiceForm, string>>;

const getInitialForm = (): InvoiceForm => ({
  amount: '',
  description: '',
  due_date: getNowDatetime(5),
});

const InvoicePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'Admin';

  const { invoices, total, totalPages, page, perPage, search, statusFilter, isLoading } =
    useAppSelector((state) => state.invoice);

  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [form, setForm] = useState<InvoiceForm>(getInitialForm);
  const [formErrors, setFormErrors] = useState<InvoiceFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    dispatch(setInvoiceLoading(true));
    getInvoicesApi({ page, per_page: perPage, search, status: statusFilter }, controller.signal)
      .then((result) => {
        if (cancelled) return;
        dispatch(setInvoiceList({
          invoices: result.invoices,
          total: result.pagination.total,
          totalPages: result.pagination.total_pages,
        }));
      })
      .catch(() => {
        if (cancelled) return;
      })
      .finally(() => {
        if (!cancelled) dispatch(setInvoiceLoading(false));
      });

    return () => { cancelled = true; controller.abort(); };
  }, [page, perPage, search, statusFilter, refreshKey, dispatch]);

  const handleSearch = useCallback((s: string) => dispatch(setInvoiceSearch(s)), [dispatch]);
  const handlePageChange = useCallback((p: number) => dispatch(setInvoicePage(p)), [dispatch]);
  const handlePerPageChange = useCallback((pp: number) => dispatch(setInvoicePerPage(pp)), [dispatch]);

  const columns: Column[] = [
    { key: 'id', header: 'No Invoice' },
    { key: 'merchant_name', header: 'Merchant' },
    {
      key: 'amount',
      header: 'Amount',
      render: (value) => formatRupiah(Number(value)),
    },
    { key: 'description', header: 'Deskripsi' },
    { key: 'payment_type', header: 'Payment Type' },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const color = getStatusColor(value as string);
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
    { key: 'due_date', header: 'Due Date', render: (v) => formatDate(v) },
    { key: 'created_at', header: 'Created At', render: (v) => formatDate(v) },
  ];

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setForm(getInitialForm());
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: InvoiceFormErrors = {};
    const amount = Number(form.amount);

    if (!form.amount.trim()) {
      errors.amount = 'Amount wajib diisi.';
    } else if (Number.isNaN(amount) || amount <= 0) {
      errors.amount = 'Amount harus lebih dari 0.';
    }

    if (!form.description.trim()) {
      errors.description = 'Deskripsi wajib diisi.';
    }

    if (!form.due_date) {
      errors.due_date = 'Due date wajib diisi.';
    } else if (new Date(form.due_date) < new Date()) {
      errors.due_date = 'Due date tidak boleh di masa lalu.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateInvoice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await createInvoiceApi({
        amount: Number(form.amount),
        description: form.description.trim(),
        due_date: new Date(form.due_date).toISOString(),
      });
      closeCreateModal();
      setRefreshKey((k) => k + 1);
      Swal.fire({
        icon: 'success',
        title: 'Invoice berhasil dibuat',
        text: 'Invoice sudah ditambahkan.',
        confirmButtonColor: Colors.primary,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInvoiceAction = (
    invoice: Invoice,
    action: 'approve' | 'reject',
    note: string,
  ) => {
    setSelectedInvoice(null);
    reviewInvoiceApi(invoice.id, { action, note })
      .then(() => {
        setRefreshKey((k) => k + 1);
        Swal.fire({
          icon: 'success',
          title: 'Status invoice diperbarui',
          text: `Invoice berhasil di-${action}.`,
          confirmButtonColor: Colors.primary,
        });
      })
      .catch(() => {});
  };

  return (
    <VStack gap={6} align="stretch">
      <PageHeader
        title="Invoice Management"
        subtitle="History Invoice and Create Invoice"
      />

      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <chakra.select
          value={statusFilter}
          onChange={(e) => dispatch(setInvoiceStatusFilter(e.target.value))}
          style={{
            width: '180px',
            borderRadius: '8px',
            backgroundColor: '#F8FAFC',
            borderColor: Colors.borderPrimary,
            borderStyle: 'solid',
            borderWidth: '1px',
            padding: '8px 12px',
            fontSize: '14px',
          }}
        >
          {INVOICE_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s || 'Semua Status'}</option>
          ))}
        </chakra.select>

        {!isAdmin && (
          <Button
            size="sm"
            bg="#2e8c73"
            minW={['100%', 125]}
            borderRadius="5px"
            ml="auto"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <FaPlus />
            Create Invoice
          </Button>
        )}
      </Flex>

      <Box
        bg={Colors.white}
        borderRadius="12px"
        border={`1px solid ${Colors.borderPrimary}`}
        p={6}
        boxShadow={Colors.cardShadow}
      >
        <Table
          data={invoices}
          columns={columns}
          isLoading={isLoading}
          pagination={{ total, page, perPage, totalPages }}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSearch={handleSearch}
          actions={[
            {
              icon: <FaEye />,
              label: 'Detail',
              onClick: (row) => setSelectedInvoice(row as Invoice),
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
            <Button variant="outline" borderRadius="xl" onClick={closeCreateModal}>
              Batal
            </Button>
            <Button
              form="create-invoice-form"
              type="submit"
              borderRadius="xl"
              bg={Colors.primary}
              color="white"
              _hover={{ bg: Colors.primaryDark }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Invoice'}
            </Button>
          </>
        }
      >
        <form id="create-invoice-form" onSubmit={handleCreateInvoice}>
          <VStack gap="4" align="stretch">
            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">Amount</Text>
              <Input
                type="text"
                inputMode="numeric"
                value={form.amount}
                placeholder="500000"
                borderRadius="xl"
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value.replace(/\D/g, '') }))
                }
              />
              {formErrors.amount && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>{formErrors.amount}</Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">Deskripsi</Text>
              <Input
                value={form.description}
                placeholder="Masukan Deskripsi"
                borderRadius="xl"
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              {formErrors.description && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>{formErrors.description}</Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">Due Date & Time</Text>
              <Input
                type="datetime-local"
                min={getNowDatetime()}
                value={form.due_date}
                borderRadius="xl"
                onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
              />
              {formErrors.due_date && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>{formErrors.due_date}</Text>
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
        onAction={handleInvoiceAction}
      />
    </VStack>
  );
};

export default InvoicePage;
