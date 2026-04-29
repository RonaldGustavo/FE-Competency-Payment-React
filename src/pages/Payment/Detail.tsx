import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Icon,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaMobileAlt,
  FaWallet,
} from 'react-icons/fa';
import Colors from '../../constant/color';
import dataInvoice from '../../mock/dataInvoice.json';

type PaymentMethod = 'WALLET' | 'VA_DUMMY' | 'EWALLET_DUMMY';

interface InvoiceData {
  no_invoice: string;
  name_merchant: string;
  amount: number;
  method: PaymentMethod;
  status: string;
  due_date: string;
  created_at: string;
}

const invoices = dataInvoice as InvoiceData[];

const paymentMethods: Array<{
  value: PaymentMethod;
  label: string;
  description: string;
  icon: typeof FaWallet;
}> = [
  {
    value: 'WALLET',
    label: 'Wallet',
    description: 'Saldo Ronald Payment',
    icon: FaWallet,
  },
  {
    value: 'VA_DUMMY',
    label: 'VA Dummy',
    description: 'Virtual account simulasi',
    icon: FaCreditCard,
  },
  {
    value: 'EWALLET_DUMMY',
    label: 'E-Wallet Dummy',
    description: 'Dompet digital simulasi',
    icon: FaMobileAlt,
  },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    PAID: Colors.success,
    PENDING: Colors.warning,
    FAILED: Colors.danger,
    EXPIRED: Colors.textMuted,
  };

  return statusColors[status] ?? Colors.textSecondary;
};

export default function PaymentDetail(): React.JSX.Element {
  const navigate = useNavigate();
  const { invoiceNumber } = useParams<{ invoiceNumber: string }>();
  const invoice = useMemo(
    () =>
      invoices.find(
        (item) =>
          item.no_invoice.toLowerCase() ===
          decodeURIComponent(invoiceNumber ?? '').toLowerCase(),
      ),
    [invoiceNumber],
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    invoice?.method ?? 'WALLET',
  );

  if (!invoice) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        bg={`linear-gradient(135deg, ${Colors.primaryLight} 0%, ${Colors.bgPrimary} 100%)`}
        px={4}
      >
        <Container maxW="lg">
          <VStack
            bg={Colors.cardBg}
            p={{ base: 8, md: 10 }}
            borderRadius="3xl"
            boxShadow={Colors.cardShadowHover}
            gap="6"
            textAlign="center"
          >
            <Flex
              boxSize="14"
              align="center"
              justify="center"
              borderRadius="2xl"
              bg={Colors.primaryLight}
            >
              <Icon
                as={FaFileInvoiceDollar}
                boxSize="7"
                color={Colors.primary}
              />
            </Flex>
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color={Colors.textPrimary}>
                Invoice Tidak Ditemukan
              </Text>
              <Text mt="2" color={Colors.textSecondary}>
                Nomor invoice yang dimasukkan tidak tersedia.
              </Text>
            </Box>
            <Button
              w="full"
              size="lg"
              borderRadius="xl"
              bg={Colors.primary}
              color="white"
              _hover={{ bg: Colors.primaryDark }}
              onClick={() => navigate('/payment')}
            >
              Cari Invoice Lain
            </Button>
          </VStack>
        </Container>
      </Flex>
    );
  }

  const statusColor = getStatusColor(invoice.status);

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={`linear-gradient(135deg, ${Colors.primaryLight} 0%, ${Colors.bgPrimary} 100%)`}
      px={4}
      py={{ base: 8, md: 10 }}
    >
      <Container maxW="5xl">
        <VStack
          align="stretch"
          bg={Colors.cardBg}
          borderRadius="3xl"
          boxShadow={Colors.cardShadowHover}
          border={`1px solid ${Colors.borderLight}`}
          overflow="hidden"
        >
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            gap="5"
            p={{ base: 8, md: 10 }}
            bg={`linear-gradient(145deg, ${Colors.primary} 0%, ${Colors.info} 100%)`}
            color={Colors.white}
          >
            <VStack align="flex-start" gap="4">
              <Button
                size="sm"
                variant="ghost"
                color={Colors.white}
                onClick={() => navigate('/payment')}
              >
                <Icon as={FaArrowLeft} />
                Cari Invoice
              </Button>

              <Box>
                <Text fontSize="sm" opacity={0.86}>
                  {invoice.no_invoice}
                </Text>
                <Text
                  fontSize={{ base: '3xl', md: '4xl' }}
                  fontWeight="bold"
                >
                  {formatCurrency(invoice.amount)}
                </Text>
                <Text mt="2" opacity={0.9}>
                  {invoice.name_merchant}
                </Text>
              </Box>
            </VStack>

            <Box
              alignSelf={{ base: 'flex-start', md: 'center' }}
              border={`1px solid rgba(255, 255, 255, 0.28)`}
              borderRadius="2xl"
              px="5"
              py="4"
            >
              <Text fontSize="xs" opacity={0.82}>
                Status Pembayaran
              </Text>
              <Text mt="1" fontSize="lg" fontWeight="bold">
                {invoice.status}
              </Text>
            </Box>
          </Flex>

          <Box p={{ base: 8, md: 10 }}>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap="4">
              <Box
                border={`1px solid ${Colors.borderPrimary}`}
                borderRadius="2xl"
                p="5"
              >
                <Text fontSize="sm" color={Colors.textSecondary}>
                  Amount
                </Text>
                <Text mt="2" fontWeight="bold" color={Colors.textPrimary}>
                  {formatCurrency(invoice.amount)}
                </Text>
              </Box>

              <Box
                border={`1px solid ${Colors.borderPrimary}`}
                borderRadius="2xl"
                p="5"
              >
                <Text fontSize="sm" color={Colors.textSecondary}>
                  Status
                </Text>
                <Text mt="2" fontWeight="bold" color={statusColor}>
                  {invoice.status}
                </Text>
              </Box>

              <Box
                border={`1px solid ${Colors.borderPrimary}`}
                borderRadius="2xl"
                p="5"
              >
                <Flex align="center" gap="2" color={Colors.textSecondary}>
                  <Icon as={FaCalendarAlt} boxSize="4" />
                  <Text fontSize="sm">Created At</Text>
                </Flex>
                <Text mt="2" fontWeight="bold" color={Colors.textPrimary}>
                  {formatDate(invoice.created_at)}
                </Text>
              </Box>

              <Box
                border={`1px solid ${Colors.borderPrimary}`}
                borderRadius="2xl"
                p="5"
              >
                <Flex align="center" gap="2" color={Colors.textSecondary}>
                  <Icon as={FaCalendarAlt} boxSize="4" />
                  <Text fontSize="sm">Due Date</Text>
                </Flex>
                <Text mt="2" fontWeight="bold" color={Colors.textPrimary}>
                  {formatDate(invoice.due_date)}
                </Text>
              </Box>
            </Grid>

            <Box mt="8">
              <Text fontSize="lg" fontWeight="bold" color={Colors.textPrimary}>
                Metode Pembayaran
              </Text>
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                gap="4"
                mt="4"
              >
                {paymentMethods.map((method) => {
                  const isSelected = selectedMethod === method.value;

                  return (
                    <Button
                      key={method.value}
                      h="auto"
                      justifyContent="flex-start"
                      borderRadius="2xl"
                      border={`1px solid ${
                        isSelected ? Colors.primary : Colors.borderPrimary
                      }`}
                      bg={isSelected ? Colors.primaryLight : Colors.white}
                      color={Colors.textPrimary}
                      p="5"
                      _hover={{ borderColor: Colors.primary }}
                      onClick={() => setSelectedMethod(method.value)}
                    >
                      <Flex align="center" gap="4" textAlign="left">
                        <Flex
                          boxSize="11"
                          align="center"
                          justify="center"
                          borderRadius="xl"
                          bg={isSelected ? Colors.primary : Colors.bgSecondary}
                          color={isSelected ? Colors.white : Colors.primary}
                        >
                          <Icon as={method.icon} boxSize="5" />
                        </Flex>
                        <Box>
                          <Text fontWeight="bold">{method.label}</Text>
                          <Text
                            mt="1"
                            fontSize="xs"
                            color={Colors.textSecondary}
                          >
                            {method.description}
                          </Text>
                        </Box>
                      </Flex>
                    </Button>
                  );
                })}
              </Grid>
            </Box>

            <Button
              mt="8"
              w="full"
              size="lg"
              borderRadius="xl"
              bg={Colors.primary}
              color="white"
              _hover={{ bg: Colors.primaryDark }}
            >
              <Icon as={FaCheckCircle} />
              Bayar dengan {selectedMethod}
            </Button>
          </Box>
        </VStack>
      </Container>
    </Flex>
  );
}
