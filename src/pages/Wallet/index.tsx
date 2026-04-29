import React, { useState, type FormEvent } from 'react';
import { Box, Button, Flex, Input, Text, VStack } from '@chakra-ui/react';
import Swal from 'sweetalert2';
import Table from '../../components/Table/Table';
import Colors from '../../constant/color';
import type { Column } from '../../interface/global';
import dataWallet from '../../mock/dataWallet.json';
import { statusColors } from '../../constant/status';
import PageHeader from '../../components/PageHeader/PageHeader';
import { FaPlus } from 'react-icons/fa';
import AppModal from '../../components/AppModal/AppModal';
import {
  formatRupiah,
  getTodayDate,
  isFutureOrToday,
  isValidEmail,
} from '../../utils/validation';

interface WalletRow {
  merchant_name: string;
  type: string;
  amount: number;
  status: string;
  processed_at: string | null;
  email?: string;
  request_date?: string;
}

interface WalletForm {
  merchant_name: string;
  email: string;
  amount: string;
  request_date: string;
}

type WalletFormErrors = Partial<Record<keyof WalletForm, string>>;

const initialWalletForm: WalletForm = {
  merchant_name: '',
  email: '',
  amount: '',
  request_date: getTodayDate(),
};

const Wallet = (): React.JSX.Element => {
  const [walletRows, setWalletRows] = useState<WalletRow[]>(
    dataWallet as WalletRow[],
  );
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [walletForm, setWalletForm] = useState<WalletForm>(initialWalletForm);
  const [formErrors, setFormErrors] = useState<WalletFormErrors>({});

  const closeTopUpModal = () => {
    setIsTopUpModalOpen(false);
    setWalletForm(initialWalletForm);
    setFormErrors({});
  };

  const columns: Column[] = [
  {
    key: 'merchant_name',
    header: 'Merchant',
  },
  {
    key: 'type',
    header: 'Type',
  },
  {
    key: 'amount',
    header: 'Amount',
    render: (value) => formatRupiah(value as number),
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
    key: 'processed_at',
    header: 'Processed At',
    render: (value) => value || '-',
  },
];

  const validateWalletForm = () => {
    const errors: WalletFormErrors = {};
    const amount = Number(walletForm.amount);

    if (!walletForm.merchant_name.trim()) {
      errors.merchant_name = 'Merchant wajib diisi.';
    }

    if (!walletForm.email.trim()) {
      errors.email = 'Email wajib diisi.';
    } else if (!isValidEmail(walletForm.email)) {
      errors.email = 'Format email tidak valid.';
    }

    if (!walletForm.amount.trim()) {
      errors.amount = 'Amount wajib diisi.';
    } else if (Number.isNaN(amount) || amount <= 0) {
      errors.amount = 'Amount harus lebih dari 0.';
    }

    if (!walletForm.request_date) {
      errors.request_date = 'Tanggal top up wajib diisi.';
    } else if (!isFutureOrToday(walletForm.request_date)) {
      errors.request_date = 'Tanggal top up minimal hari ini.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleTopUpWallet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateWalletForm()) {
      await Swal.fire({
        icon: 'error',
        title: 'Form belum valid',
        text: 'Periksa kembali error pada form top up wallet.',
      });
      return;
    }

    const result = await Swal.fire({
      icon: 'question',
      title: 'Ajukan top up wallet?',
      text: 'Top up akan masuk dengan status PENDING.',
      showCancelButton: true,
      confirmButtonText: 'Ya, ajukan',
      cancelButtonText: 'Batal',
      confirmButtonColor: Colors.primary,
    });

    if (!result.isConfirmed) return;

    const newTopUp: WalletRow = {
      merchant_name: walletForm.merchant_name.trim(),
      email: walletForm.email.trim(),
      type: 'TOP_UP',
      amount: Number(walletForm.amount),
      status: 'PENDING',
      processed_at: null,
      request_date: walletForm.request_date,
    };

    setWalletRows((currentRows) => [newTopUp, ...currentRows]);
    setWalletForm(initialWalletForm);
    setFormErrors({});
    setIsTopUpModalOpen(false);

    await Swal.fire({
      icon: 'success',
      title: 'Top up wallet dibuat',
      text: `${newTopUp.merchant_name} menunggu proses top up.`,
      confirmButtonColor: Colors.primary,
    });
  };

  return (
    <VStack gap={6} align="stretch">
      <PageHeader
        title="Wallet Management"
        subtitle="Top Up and History Wallet Saldo"
      />

      <Flex justifyContent="end">
        <Button
          size="sm"
          bg={'#2e8c73'}
          minW={['100%', 125]}
          borderRadius={'5px'}
          onClick={() => setIsTopUpModalOpen(true)}
        >
          <FaPlus />
          Top Up Wallet
        </Button>
      </Flex>

      <Box
        bg={Colors.white}
        borderRadius="12px"
        border={`1px solid ${Colors.borderPrimary}`}
        p={6}
        boxShadow={Colors.cardShadow}
      >
        <Table
          data={walletRows}
          columns={columns}
        />
      </Box>

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
            >
              Ajukan Top Up
            </Button>
          </>
        }
      >
        <form id="top-up-wallet-form" onSubmit={handleTopUpWallet}>
          <VStack gap="4" align="stretch">
            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Merchant
              </Text>
              <Input
                value={walletForm.merchant_name}
                placeholder="Toko Sukses Jaya"
                borderRadius="xl"
                onChange={(event) =>
                  setWalletForm((current) => ({
                    ...current,
                    merchant_name: event.target.value,
                  }))
                }
              />
              {formErrors.merchant_name && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>
                  {formErrors.merchant_name}
                </Text>
              )}
            </Box>

            <Box>
              <Text fontSize="sm" mb="2" fontWeight="medium">
                Email Merchant
              </Text>
              <Input
                type="email"
                value={walletForm.email}
                placeholder="merchant@email.com"
                borderRadius="xl"
                onChange={(event) =>
                  setWalletForm((current) => ({
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
                value={walletForm.amount}
                placeholder="500000"
                borderRadius="xl"
                onChange={(event) =>
                  setWalletForm((current) => ({
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
                Tanggal Top Up
              </Text>
              <Input
                type="date"
                min={getTodayDate()}
                value={walletForm.request_date}
                borderRadius="xl"
                onChange={(event) =>
                  setWalletForm((current) => ({
                    ...current,
                    request_date: event.target.value,
                  }))
                }
              />
              {formErrors.request_date && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>
                  {formErrors.request_date}
                </Text>
              )}
            </Box>
          </VStack>
        </form>
      </AppModal>
    </VStack>
  );
};

export default Wallet;
