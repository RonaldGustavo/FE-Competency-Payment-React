import React, { useState, useCallback, useEffect, type FormEvent } from 'react';
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
  chakra,
} from '@chakra-ui/react';
import moment from 'moment';
import Swal from 'sweetalert2';
import { FaCheck, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';
import Table from '../../components/Table/Table';
import Colors from '../../constant/color';
import type { Column } from '../../interface/global';
import { getStatusColor } from '../../constant/status';
import PageHeader from '../../components/PageHeader/PageHeader';
import AppModal from '../../components/AppModal/AppModal';
import { useAppSelector, useAppDispatch } from '../../config/hook';
import type { Refund } from '../../interface/refund';
import {
  createRefundApi,
  getRefundsApi,
  reviewRefundApi,
} from '../../features/refund/RefundService';
import {
  setRefundLoading,
  setRefundList,
  setRefundPage,
  setRefundPerPage,
  setRefundSearch,
  setRefundStatusFilter,
} from '../../features/refund/RefundSlice';
import { getApiErrorMessage } from '../../utils/apiError';

const REFUND_STATUS_OPTIONS = ['', 'REQUESTED', 'APPROVED', 'REJECTED'] as const;

const formatDate = (value: string | null | undefined) =>
  value ? moment(value).format('DD MMMM YYYY HH:mm:ss') : '-';

const formatAmount = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  if (Number.isNaN(num)) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

interface RefundForm {
  invoice_id: string;
  reason: string;
}

type RefundFormErrors = Partial<Record<keyof RefundForm, string>>;

const initialForm: RefundForm = { invoice_id: '', reason: '' };

const RefundPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'Admin';

  const { refunds, total, totalPages, page, perPage, search, statusFilter, isLoading } =
    useAppSelector((state) => state.refund);

  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form, setForm] = useState<RefundForm>(initialForm);
  const [formErrors, setFormErrors] = useState<RefundFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createApiError, setCreateApiError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    dispatch(setRefundLoading(true));
    getRefundsApi({ page, per_page: perPage, search, status: statusFilter }, controller.signal)
      .then((result) => {
        if (cancelled) return;
        dispatch(setRefundList({
          refunds: result.refunds,
          total: result.pagination.total,
          totalPages: result.pagination.total_pages,
        }));
      })
      .catch(() => {
        if (cancelled) return;
      })
      .finally(() => {
        if (!cancelled) dispatch(setRefundLoading(false));
      });

    return () => { cancelled = true; controller.abort(); };
  }, [page, perPage, search, statusFilter, refreshKey, dispatch]);

  const handleSearch = useCallback((s: string) => dispatch(setRefundSearch(s)), [dispatch]);
  const handlePageChange = useCallback((p: number) => dispatch(setRefundPage(p)), [dispatch]);
  const handlePerPageChange = useCallback((pp: number) => dispatch(setRefundPerPage(pp)), [dispatch]);

  const columns: Column[] = [
    { key: 'id', header: 'No Refund' },
    { key: 'invoice_id', header: 'No Invoice' },
    { key: 'merchant_name', header: 'Merchant' },
    { key: 'amount', header: 'Amount', render: (v) => formatAmount(v) },
    { key: 'reason', header: 'Reason' },
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
    { key: 'created_at', header: 'Created At', render: (v) => formatDate(v) },
    { key: 'updated_at', header: 'Updated At', render: (v) => formatDate(v) },
  ];

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setForm(initialForm);
    setFormErrors({});
    setCreateApiError('');
  };

  const validateForm = () => {
    const errors: RefundFormErrors = {};
    if (!form.invoice_id.trim()) errors.invoice_id = 'Invoice ID wajib diisi.';
    if (!form.reason.trim()) errors.reason = 'Reason wajib diisi.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRefund = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setCreateApiError('');
    try {
      await createRefundApi({ invoice_id: form.invoice_id.trim(), reason: form.reason.trim() });
      closeCreateModal();
      setRefreshKey((k) => k + 1);
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Request refund dibuat',
          text: 'Refund sudah diajukan dan menunggu review.',
          confirmButtonColor: Colors.primary,
        });
      }, 300);
    } catch (error) {
      setCreateApiError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeApprovalModal = () => {
    setSelectedRefund(null);
    setReviewNote('');
    setPendingAction(null);
  };

  const handleConfirmReview = async () => {
    if (!selectedRefund || !pendingAction) return;
    const id = selectedRefund.id;
    const action = pendingAction;
    const note = reviewNote;
    closeApprovalModal();
    try {
      await reviewRefundApi(id, { action, note });
      setRefreshKey((k) => k + 1);
      Swal.fire({
        icon: 'success',
        title: 'Status refund diperbarui',
        text: `Refund berhasil di-${action}.`,
        confirmButtonColor: Colors.primary,
      });
    } catch {
      // handled by global interceptor
    }
  };

  return (
    <VStack gap={6} align="stretch">
      <PageHeader title="Refund Management" subtitle="Manage and track refund requests" />

      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <chakra.select
          value={statusFilter}
          onChange={(e) => dispatch(setRefundStatusFilter(e.target.value))}
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
          {REFUND_STATUS_OPTIONS.map((s) => (
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
            Request Refund
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
          data={refunds}
          columns={columns}
          isLoading={isLoading}
          pagination={{ total, page, perPage, totalPages }}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSearch={handleSearch}
          actions={[
            {
              icon: <FaEdit />,
              label: 'Review',
              onClick: (row) => {
                setSelectedRefund(row as Refund);
                setReviewNote('');
                setPendingAction(null);
              },
              bg: '#de943a',
              isVisible: (row) => isAdmin && row.status === 'REQUESTED',
            },
          ]}
        />
      </Box>

      {/* Create Refund Modal */}
      <AppModal
        isOpen={isCreateModalOpen}
        title="Request Refund"
        subtitle="Ajukan refund untuk invoice yang sudah dibayar."
        onClose={closeCreateModal}
        footer={
          <>
            <Button variant="outline" borderRadius="xl" onClick={closeCreateModal}>
              Batal
            </Button>
            <Button
              form="create-refund-form"
              type="submit"
              borderRadius="xl"
              bg={Colors.primary}
              color="white"
              _hover={{ bg: Colors.primaryDark }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mengajukan...' : 'Kirim Request'}
            </Button>
          </>
        }
      >
        <form id="create-refund-form" onSubmit={handleCreateRefund}>
          <VStack gap="4" align="stretch">
            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">Invoice ID</Text>
              <Input
                value={form.invoice_id}
                placeholder="UUID invoice yang ingin di-refund"
                borderRadius="xl"
                onChange={(e) => setForm((f) => ({ ...f, invoice_id: e.target.value }))}
              />
              {formErrors.invoice_id && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>{formErrors.invoice_id}</Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">Alasan Refund</Text>
              <Textarea
                value={form.reason}
                placeholder="Barang tidak sesuai, produk rusak, dll."
                borderRadius="xl"
                rows={3}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              />
              {formErrors.reason && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>{formErrors.reason}</Text>
              )}
            </Box>

            {createApiError && (
              <Box
                p="3"
                borderRadius="xl"
                bg="#FEF2F2"
                border="1px solid #FECACA"
              >
                <Text fontSize="sm" color={Colors.danger}>{createApiError}</Text>
              </Box>
            )}
          </VStack>
        </form>
      </AppModal>

      {/* Approval Modal */}
      <AppModal
        isOpen={Boolean(selectedRefund)}
        title={
          pendingAction
            ? `Konfirmasi ${pendingAction === 'approve' ? 'Approve' : 'Reject'}`
            : 'Review Refund'
        }
        subtitle={
          pendingAction
            ? 'Tindakan ini tidak dapat dibatalkan setelah dikonfirmasi.'
            : 'Review request refund sebelum approve atau reject.'
        }
        onClose={closeApprovalModal}
        maxW="720px"
        footer={
          pendingAction ? (
            <>
              <Button variant="outline" borderRadius="xl" onClick={() => setPendingAction(null)}>
                Kembali
              </Button>
              <Button
                borderRadius="xl"
                bg={pendingAction === 'approve' ? Colors.success : Colors.danger}
                color="white"
                _hover={{ bg: pendingAction === 'approve' ? '#047857' : '#B91C1C' }}
                onClick={handleConfirmReview}
              >
                {pendingAction === 'approve' ? (
                  <><Icon as={FaCheck} /> Ya, Approve</>
                ) : (
                  <><Icon as={FaTimes} /> Ya, Reject</>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" borderRadius="xl" onClick={closeApprovalModal}>
                Tutup
              </Button>
              {selectedRefund && (
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
        {selectedRefund && !pendingAction && (
          <VStack gap="4" align="stretch">
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="4">
              {(
                [
                  ['No Refund', selectedRefund.id],
                  ['No Invoice', selectedRefund.invoice_id],
                  ['Merchant', selectedRefund.user_name ?? '-'],
                  ['Status', selectedRefund.status],
                  ['Amount', formatAmount(selectedRefund.amount)],
                  ['Created At', formatDate(selectedRefund.created_at)],
                ] as [string, string][]
              ).map(([label, value]) => (
                <Box
                  key={label}
                  border={`1px solid ${Colors.borderPrimary}`}
                  borderRadius="16px"
                  p="4"
                  bg={Colors.bgPrimary}
                >
                  <Text fontSize="xs" color={Colors.textSecondary}>{label}</Text>
                  <Text mt="1" fontWeight="700" color={Colors.textPrimary}>{value}</Text>
                </Box>
              ))}
              <Box
                border={`1px solid ${Colors.borderPrimary}`}
                borderRadius="16px"
                p="4"
                bg={Colors.bgPrimary}
                gridColumn={{ md: 'span 2' }}
              >
                <Text fontSize="xs" color={Colors.textSecondary}>Reason</Text>
                <Text mt="1" fontWeight="700" color={Colors.textPrimary}>{selectedRefund.reason}</Text>
              </Box>
            </Grid>
            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">Catatan Review</Text>
              <Textarea
                value={reviewNote}
                placeholder="Tulis catatan untuk approval..."
                borderRadius="xl"
                onChange={(e) => setReviewNote(e.target.value)}
              />
            </Box>
          </VStack>
        )}

        {selectedRefund && pendingAction && (
          <Box
            bg={pendingAction === 'approve' ? '#F0FDF4' : '#FEF2F2'}
            border={`1px solid ${pendingAction === 'approve' ? '#BBF7D0' : '#FECACA'}`}
            borderRadius="16px"
            p={5}
            textAlign="center"
          >
            <Text fontWeight="600" color={Colors.textPrimary}>
              Refund dari invoice{' '}
              <Text as="span" fontWeight="700">{selectedRefund.invoice_id}</Text>
              {' '}akan di-
              <Text
                as="span"
                fontWeight="700"
                color={pendingAction === 'approve' ? Colors.success : Colors.danger}
              >
                {pendingAction === 'approve' ? 'APPROVE' : 'REJECT'}
              </Text>
              .
            </Text>
            {reviewNote && (
              <Text mt={3} fontSize="sm" color={Colors.textSecondary}>
                Catatan: {reviewNote}
              </Text>
            )}
          </Box>
        )}
      </AppModal>
    </VStack>
  );
};

export default RefundPage;
