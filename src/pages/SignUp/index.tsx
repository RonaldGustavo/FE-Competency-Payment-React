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
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {
  HiArrowLeft,
  HiEye,
  HiEyeOff,
  HiOutlineLockClosed,
  HiOutlineMail,
  HiOutlineUser,
} from 'react-icons/hi';
import { FaUserPlus } from 'react-icons/fa';
import Colors from '../../constant/color';
import { signUpApi } from '../../features/auth/AuthService';
import { getApiErrorMessage } from '../../utils/apiError';
import { isValidEmail } from '../../utils/validation';

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type SignUpFormErrors = Partial<Record<keyof SignUpForm | 'general', string>>;

export default function SignUp(): React.JSX.Element {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<SignUpForm>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<SignUpFormErrors>({});

  const validateForm = () => {
    const nextErrors: SignUpFormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Nama lengkap wajib diisi.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email wajib diisi.';
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = 'Format email tidak valid.';
    }

    if (!form.password) {
      nextErrors.password = 'Password wajib diisi.';
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password minimal 8 karakter.';
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Konfirmasi password wajib diisi.';
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Konfirmasi password tidak sama.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await signUpApi({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      await Swal.fire({
        icon: 'success',
        title: 'Registrasi berhasil',
        text: 'Silakan login menggunakan akun baru.',
        confirmButtonColor: Colors.primary,
      });

      navigate('/sign-in');
    } catch (error) {
      setErrors({
        general: getApiErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = (field: keyof SignUpForm) => {
    setErrors((current) => ({ ...current, [field]: '', general: '' }));
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
                  <Icon as={FaUserPlus} boxSize="8" />
                </Flex>

                <Box>
                  <Text fontSize="3xl" fontWeight="bold">
                    Ronald Payment
                  </Text>
                  <Text mt="3" fontSize="md" opacity={0.9}>
                    Kelola pembayaran, invoice, refund, dan wallet dalam satu
                    dashboard yang rapi.
                  </Text>
                </Box>
              </VStack>
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
                <Icon as={HiArrowLeft} />
                Masuk
              </Button>

              <VStack gap="2" align="flex-start">
                <Flex gap="3" alignItems="center">
                  <Flex
                    boxSize="12"
                    align="center"
                    justify="center"
                    borderRadius="xl"
                    bg={Colors.primaryLight}
                  >
                    <Icon as={FaUserPlus} boxSize="6" color={Colors.primary} />
                  </Flex>
                  <Box>
                    <Text
                      fontSize={{ base: '2xl', md: '3xl' }}
                      fontWeight="bold"
                      color={Colors.textPrimary}
                    >
                      Buat Akun Baru
                    </Text>
                    <Text fontSize="sm" color={Colors.textSecondary}>
                      Isi data berikut untuk mulai menggunakan dashboard.
                    </Text>
                  </Box>
                </Flex>
              </VStack>

              <form onSubmit={handleSubmit}>
                <VStack gap="5" w="full">
                <Box w="full">
                  <Text
                    fontSize="sm"
                    mb="2"
                    color={Colors.textPrimary}
                    fontWeight="medium"
                  >
                    Nama Lengkap
                  </Text>
                  <Box position="relative">
                    <Icon
                      as={HiOutlineUser}
                      position="absolute"
                      left="14px"
                      top="50%"
                      transform="translateY(-50%)"
                      color={Colors.textMuted}
                      boxSize="5"
                    />
                    <Input
                      value={form.name}
                      placeholder="Masukkan nama lengkap"
                      size="lg"
                      borderRadius="xl"
                      borderColor={Colors.borderPrimary}
                      pl="44px"
                      onChange={(event) => {
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }));
                        clearError('name');
                      }}
                      _focus={{
                        borderColor: Colors.primary,
                        boxShadow: `0 0 0 1px ${Colors.primary}`,
                      }}
                    />
                  </Box>
                  {errors.name && (
                    <Text mt="2" fontSize="sm" color={Colors.danger}>
                      {errors.name}
                    </Text>
                  )}
                </Box>

                <Box w="full">
                  <Text
                    fontSize="sm"
                    mb="2"
                    color={Colors.textPrimary}
                    fontWeight="medium"
                  >
                    Email
                  </Text>
                  <Box position="relative">
                    <Icon
                      as={HiOutlineMail}
                      position="absolute"
                      left="14px"
                      top="50%"
                      transform="translateY(-50%)"
                      color={Colors.textMuted}
                      boxSize="5"
                    />
                    <Input
                      type="email"
                      value={form.email}
                      placeholder="nama@email.com"
                      size="lg"
                      borderRadius="xl"
                      borderColor={Colors.borderPrimary}
                      pl="44px"
                      onChange={(event) => {
                        setForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }));
                        clearError('email');
                      }}
                      _focus={{
                        borderColor: Colors.primary,
                        boxShadow: `0 0 0 1px ${Colors.primary}`,
                      }}
                    />
                  </Box>
                  {errors.email && (
                    <Text mt="2" fontSize="sm" color={Colors.danger}>
                      {errors.email}
                    </Text>
                  )}
                </Box>

                <Box w="full" position="relative">
                  <Text
                    fontSize="sm"
                    mb="2"
                    color={Colors.textPrimary}
                    fontWeight="medium"
                  >
                    Password
                  </Text>
                  <Box position="relative">
                    <Icon
                      as={HiOutlineLockClosed}
                      position="absolute"
                      left="14px"
                      top="50%"
                      transform="translateY(-50%)"
                      color={Colors.textMuted}
                      boxSize="5"
                    />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      placeholder="Buat password"
                      size="lg"
                      borderRadius="xl"
                      borderColor={Colors.borderPrimary}
                      pl="44px"
                      pr="45px"
                      onChange={(event) => {
                        setForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }));
                        clearError('password');
                      }}
                      _focus={{
                        borderColor: Colors.primary,
                        boxShadow: `0 0 0 1px ${Colors.primary}`,
                      }}
                    />
                    <Box
                      position="absolute"
                      right="12px"
                      top="50%"
                      transform="translateY(-50%)"
                      cursor="pointer"
                      color={Colors.textSecondary}
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <HiEyeOff /> : <HiEye />}
                    </Box>
                  </Box>
                  {errors.password && (
                    <Text mt="2" fontSize="sm" color={Colors.danger}>
                      {errors.password}
                    </Text>
                  )}
                </Box>

                <Box w="full" position="relative">
                  <Text
                    fontSize="sm"
                    mb="2"
                    color={Colors.textPrimary}
                    fontWeight="medium"
                  >
                    Konfirmasi Password
                  </Text>
                  <Box position="relative">
                    <Icon
                      as={HiOutlineLockClosed}
                      position="absolute"
                      left="14px"
                      top="50%"
                      transform="translateY(-50%)"
                      color={Colors.textMuted}
                      boxSize="5"
                    />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      placeholder="Ulangi password"
                      size="lg"
                      borderRadius="xl"
                      borderColor={Colors.borderPrimary}
                      pl="44px"
                      pr="45px"
                      onChange={(event) => {
                        setForm((current) => ({
                          ...current,
                          confirmPassword: event.target.value,
                        }));
                        clearError('confirmPassword');
                      }}
                      _focus={{
                        borderColor: Colors.primary,
                        boxShadow: `0 0 0 1px ${Colors.primary}`,
                      }}
                    />
                    <Box
                      position="absolute"
                      right="12px"
                      top="50%"
                      transform="translateY(-50%)"
                      cursor="pointer"
                      color={Colors.textSecondary}
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                    >
                      {showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                    </Box>
                  </Box>
                  {errors.confirmPassword && (
                    <Text mt="2" fontSize="sm" color={Colors.danger}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </Box>

                {errors.general && (
                  <Box
                    w="full"
                    p="3"
                    borderRadius="xl"
                    bg={`${Colors.danger}15`}
                    color={Colors.danger}
                  >
                    <Text fontSize="sm" fontWeight="medium">
                      {errors.general}
                    </Text>
                  </Box>
                )}

                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  borderRadius="xl"
                  bg={Colors.primary}
                  color="white"
                  _hover={{ bg: Colors.primaryDark }}
                  loading={isSubmitting}
                >
                  Daftar Sekarang
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
