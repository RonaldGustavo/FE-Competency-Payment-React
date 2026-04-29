import React, { useState, type FormEvent } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Icon,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFileInvoiceDollar, FaSearch } from 'react-icons/fa';
import Colors from '../../constant/color';

export default function Payment(): React.JSX.Element {
  const navigate = useNavigate();
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const invoice = invoiceNumber.trim().toUpperCase();

    if (!invoice) {
      setErrorMessage('No invoice wajib diisi.');
      return;
    }

    navigate(`/payment/${encodeURIComponent(invoice)}`);
  };

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
        <Grid
          templateColumns={{ base: '1fr', lg: '0.9fr 1.1fr' }}
          bg={Colors.cardBg}
          borderRadius="3xl"
          boxShadow={Colors.cardShadowHover}
          overflow="hidden"
          border={`1px solid ${Colors.borderLight}`}
        >
          <GridItem
            display={{ base: 'none', lg: 'block' }}
            bg={`linear-gradient(145deg, ${Colors.primary} 0%, ${Colors.info} 100%)`}
            color={Colors.white}
            p={10}
          >
            <Flex direction="column" justify="space-between" minH="100%">
              <VStack align="flex-start" gap="5">
                <Flex
                  boxSize="16"
                  align="center"
                  justify="center"
                  borderRadius="2xl"
                  bg="rgba(255, 255, 255, 0.18)"
                >
                  <Icon as={FaFileInvoiceDollar} boxSize="8" />
                </Flex>

                <Box>
                  <Text fontSize="3xl" fontWeight="bold">
                    Bayar Invoice
                  </Text>
                  <Text mt="3" fontSize="md" opacity={0.9}>
                    Pembayaran invoice publik untuk customer Ronald Payment.
                  </Text>
                </Box>
              </VStack>

              <Grid templateColumns="repeat(2, 1fr)" gap="4" mt="12">
                <Box
                  border={`1px solid rgba(255, 255, 255, 0.24)`}
                  borderRadius="2xl"
                  p="5"
                >
                  <Text fontSize="2xl" fontWeight="bold">
                    3
                  </Text>
                  <Text fontSize="sm" opacity={0.84}>
                    Metode bayar
                  </Text>
                </Box>
                <Box
                  border={`1px solid rgba(255, 255, 255, 0.24)`}
                  borderRadius="2xl"
                  p="5"
                >
                  <Text fontSize="2xl" fontWeight="bold">
                    24/7
                  </Text>
                  <Text fontSize="sm" opacity={0.84}>
                    Akses publik
                  </Text>
                </Box>
              </Grid>
            </Flex>
          </GridItem>

          <GridItem p={{ base: 8, md: 10 }}>
            <VStack align="stretch" gap="8">
              <Button
                alignSelf="flex-start"
                size="sm"
                variant="ghost"
                color={Colors.textSecondary}
                onClick={() => navigate('/sign-in')}
              >
                <Icon as={FaArrowLeft} />
                Sign In
              </Button>

              <VStack gap="3" align="flex-start">
                <Flex
                  boxSize="12"
                  align="center"
                  justify="center"
                  borderRadius="xl"
                  bg={Colors.primaryLight}
                >
                  <Icon
                    as={FaFileInvoiceDollar}
                    boxSize="6"
                    color={Colors.primary}
                  />
                </Flex>

                <Box>
                  <Text
                    fontSize={{ base: '2xl', md: '3xl' }}
                    fontWeight="bold"
                    color={Colors.textPrimary}
                  >
                    Cari Invoice
                  </Text>
                  <Text fontSize="sm" color={Colors.textSecondary}>
                    Masukkan nomor invoice yang ingin dibayar.
                  </Text>
                </Box>
              </VStack>

              <form onSubmit={handleSubmit}>
                <VStack gap="5" align="stretch">
                  <Box>
                    <Text
                      fontSize="sm"
                      mb="2"
                      color={Colors.textPrimary}
                      fontWeight="medium"
                    >
                      No Invoice
                    </Text>
                    <Box position="relative">
                      <Icon
                        as={FaSearch}
                        position="absolute"
                        left="14px"
                        top="50%"
                        transform="translateY(-50%)"
                        color={Colors.textMuted}
                        boxSize="4"
                      />
                      <Input
                        value={invoiceNumber}
                        placeholder="INV-0002"
                        size="lg"
                        borderRadius="xl"
                        borderColor={Colors.borderPrimary}
                        pl="44px"
                        textTransform="uppercase"
                        onChange={(event) => {
                          setInvoiceNumber(event.target.value);
                          setErrorMessage('');
                        }}
                        _focus={{
                          borderColor: Colors.primary,
                          boxShadow: `0 0 0 1px ${Colors.primary}`,
                        }}
                      />
                    </Box>
                    {errorMessage && (
                      <Text mt="2" fontSize="sm" color={Colors.danger}>
                        {errorMessage}
                      </Text>
                    )}
                  </Box>

                  <Button
                    type="submit"
                    w="full"
                    size="lg"
                    borderRadius="xl"
                    bg={Colors.primary}
                    color="white"
                    _hover={{ bg: Colors.primaryDark }}
                  >
                    Lanjutkan Pembayaran
                  </Button>
                </VStack>
              </form>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Flex>
  );
}
