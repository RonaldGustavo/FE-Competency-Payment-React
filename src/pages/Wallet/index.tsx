import React, { useState, useCallback, useEffect, type FormEvent } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import moment from 'moment';
import Swal from 'sweetalert2';
import Table from '../../components/Table/Table';
import Colors from '../../constant/color';
import type { Column } from '../../interface/global';
import { getStatusColor } from '../../constant/status';
import PageHeader from '../../components/PageHeader/PageHeader';
import { FaCheck, FaEdit, FaPlus, FaTimes } from 'react-icons/fa';
import AppModal from '../../components/AppModal/AppModal';
import { formatRupiah } from '../../utils/validation';
import { useAppSelector, useAppDispatch } from '../../config/hook';
import type { TopUp } from '../../interface/wallet';
import {
  createTopUpApi,
  getTopUpsApi,
  reviewTopUpApi,
} from '../../features/wallet/WalletService';
import {
  setWalletLoading,
  setTopUpList,
  setWalletPage,
  setWalletPerPage,
  setWalletSearch,
} from '../../features/wallet/WalletSlice';

const formatDate = (value: string | null | undefined) =>
  value ? moment(value).format('DD MMMM YYYY HH:mm:ss') : '-';

const Wallet = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'Admin';

  const { topUps, total, totalPages, page, perPage, search, isLoading } =
    useAppSelector((state) => state.wallet);

  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedTopUp, setSelectedTopUp] = useState<TopUp | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [pendingAction, setPendingAction] = useState<
    'approve' | 'reject' | null
  >(null);

  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    dispatch(setWalletLoading(true));
    getTopUpsApi({ page, per_page: perPage, search }, controller.signal)
      .then((result) => {
        if (cancelled) return;
        dispatch(
          setTopUpList({
            topUps: result.top_ups,
            total: result.pagination.total,
            totalPages: result.pagination.total_pages,
          }),
        );
      })
      .catch(() => {
        if (cancelled) return;
      })
      .finally(() => {
        if (!cancelled) dispatch(setWalletLoading(false));
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [page, perPage, search, refreshKey, dispatch]);

  const handleSearch = useCallback(
    (s: string) => dispatch(setWalletSearch(s)),
    [dispatch],
  );
  const handlePageChange = useCallback(
    (p: number) => dispatch(setWalletPage(p)),
    [dispatch],
  );
  const handlePerPageChange = useCallback(
    (pp: number) => dispatch(setWalletPerPage(pp)),
    [dispatch],
  );

  const columns: Column[] = [
    { key: 'user_name', header: 'Merchant' },
    {
      key: 'amount',
      header: 'Amount',
      render: (value) => formatRupiah(value as number),
    },
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
    {
      key: 'created_at',
      header: 'Created At',
      render: (value) => formatDate(value),
    },
    {
      key: 'updated_at',
      header: 'Updated At',
      render: (value) => formatDate(value),
    },
  ];

  const closeTopUpModal = () => {
    setIsTopUpModalOpen(false);
    setAmount('');
    setAmountError('');
  };

  const validateAmount = () => {
    const parsed = Number(amount);
    if (!amount.trim()) {
      setAmountError('Amount wajib diisi.');
      return false;
    }
    if (Number.isNaN(parsed) || parsed <= 0) {
      setAmountError('Amount harus lebih dari 0.');
      return false;
    }
    setAmountError('');
    return true;
  };

  const handleTopUpWallet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateAmount()) return;

    setIsSubmitting(true);
    try {
      await createTopUpApi({ amount: Number(amount) });
      closeTopUpModal();
      setRefreshKey((k) => k + 1);
      Swal.fire({
        icon: 'success',
        title: 'Top up berhasil diajukan',
        text: 'Permintaan top up sedang menunggu proses.',
        confirmButtonColor: Colors.primary,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeApprovalModal = () => {
    setSelectedTopUp(null);
    setReviewNote('');
    setPendingAction(null);
  };

  const handleConfirmReview = async () => {
    if (!selectedTopUp || !pendingAction) return;

    const topUpId = selectedTopUp.id;
    const action = pendingAction;
    const note = reviewNote;

    closeApprovalModal();

    try {
      await reviewTopUpApi(topUpId, { action, note });
      setRefreshKey((k) => k + 1);
      Swal.fire({
        icon: 'success',
        title: 'Status diperbarui',
        text: `Top up berhasil di-${action}.`,
        confirmButtonColor: Colors.primary,
      });
    } catch {
      // handled by global interceptor
    }
  };

  return (
    <VStack gap={6} align="stretch">
      <PageHeader
        title="Wallet Management"
        subtitle="Top Up and History Wallet Saldo"
      />

      {!isAdmin && (
        <Flex justify="end" align="center" wrap="wrap" gap={3}>
          <Button
            size="sm"
            bg={'#2e8c73'}
            minW={['100%', 125]}
            borderRadius={'5px'}
            ml={isAdmin ? 'auto' : undefined}
            onClick={() => setIsTopUpModalOpen(true)}
          >
            <FaPlus />
            Top Up Wallet
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
          data={topUps}
          columns={columns}
          isLoading={isLoading}
          pagination={{ total, page, perPage, totalPages }}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSearch={handleSearch}
          actions={
            isAdmin
              ? [
                  {
                    icon: <FaEdit />,
                    label: 'Approval',
                    onClick: (row) => {
                      setSelectedTopUp(row as TopUp);
                      setReviewNote('');
                      setPendingAction(null);
                    },
                    bg: '#de943a',
                    isVisible: (row) => row.status === 'PENDING',
                  },
                ]
              : undefined
          }
        />
      </Box>

      {/* //NOTE - Top up Modal */}
      <AppModal
        isOpen={isTopUpModalOpen}
        title="Top Up Wallet"
        subtitle="Ajukan penambahan saldo wallet merchant."
        onClose={closeTopUpModal}
        footer={
          <>
            <Button
              variant="outline"
              borderRadius="xl"
              onClick={closeTopUpModal}
            >
              Batal
            </Button>
            <Button
              form="top-up-wallet-form"
              type="submit"
              borderRadius="xl"
              bg={Colors.primary}
              color="white"
              _hover={{ bg: Colors.primaryDark }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mengajukan...' : 'Ajukan Top Up'}
            </Button>
          </>
        }
      >
        <form id="top-up-wallet-form" onSubmit={handleTopUpWallet}>
          <VStack gap="4" align="stretch">
            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Amount
              </Text>
              <Input
                type="text"
                inputMode="numeric"
                value={amount}
                placeholder="500000"
                borderRadius="xl"
                onChange={(event) =>
                  setAmount(event.target.value.replace(/\D/g, ''))
                }
              />
              {amountError && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>
                  {amountError}
                </Text>
              )}
            </Box>
          </VStack>
        </form>
      </AppModal>

      {/* //NOTE - Approve Modal */}
      <AppModal
        isOpen={Boolean(selectedTopUp)}
        title={
          pendingAction
            ? `Konfirmasi ${pendingAction === 'approve' ? 'Approve' : 'Reject'}`
            : 'Approval Top Up'
        }
        subtitle={
          pendingAction
            ? 'Tindakan ini tidak dapat dibatalkan setelah dikonfirmasi.'
            : 'Review request top up sebelum approve atau reject.'
        }
        onClose={closeApprovalModal}
        maxW="720px"
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
                bg={
                  pendingAction === 'approve' ? Colors.success : Colors.danger
                }
                color="white"
                _hover={{
                  bg: pendingAction === 'approve' ? '#047857' : '#B91C1C',
                }}
                onClick={handleConfirmReview}
              >
                {pendingAction === 'approve' ? (
                  <>
                    <FaCheck /> Ya, Approve
                  </>
                ) : (
                  <>
                    <FaTimes /> Ya, Reject
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                borderRadius="xl"
                onClick={closeApprovalModal}
              >
                Tutup
              </Button>
              {selectedTopUp && (
                <>
                  <Button
                    borderRadius="xl"
                    bg={Colors.danger}
                    color="white"
                    _hover={{ bg: '#B91C1C' }}
                    onClick={() => setPendingAction('reject')}
                  >
                    <FaTimes />
                    Reject
                  </Button>
                  <Button
                    borderRadius="xl"
                    bg={Colors.success}
                    color="white"
                    _hover={{ bg: '#047857' }}
                    onClick={() => setPendingAction('approve')}
                  >
                    <FaCheck />
                    Approve
                  </Button>
                </>
              )}
            </>
          )
        }
      >
        {selectedTopUp && !pendingAction && (
          <VStack gap="4" align="stretch">
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap="4"
            >
              {(
                [
                  ['Merchant', selectedTopUp.user_name ?? '-'],
                  ['Amount', formatRupiah(selectedTopUp.amount)],
                  ['Status', selectedTopUp.status],
                  ['Created At', formatDate(selectedTopUp.created_at)],
                ] as [string, string][]
              ).map(([label, value]) => (
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
            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Catatan Review
              </Text>
              <Textarea
                value={reviewNote}
                placeholder="Tulis catatan untuk approval..."
                borderRadius="xl"
                onChange={(event) => setReviewNote(event.target.value)}
              />
            </Box>
          </VStack>
        )}

        {selectedTopUp && pendingAction && (
          <Box
            bg={pendingAction === 'approve' ? '#F0FDF4' : '#FEF2F2'}
            border={`1px solid ${pendingAction === 'approve' ? '#BBF7D0' : '#FECACA'}`}
            borderRadius="16px"
            p={5}
            textAlign="center"
          >
            <Text fontWeight="600" color={Colors.textPrimary}>
              Top up
              {selectedTopUp.user_name
                ? ` dari ${selectedTopUp.user_name}`
                : ''}{' '}
              sebesar{' '}
              <Text as="span" fontWeight="700">
                {formatRupiah(selectedTopUp.amount)}
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

export default Wallet;
