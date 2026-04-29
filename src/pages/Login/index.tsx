import React, { useState, type FormEvent } from 'react';
import {
  Box,
  Button,
  Container,
  Input,
  Text,
  Flex,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { FaFileInvoiceDollar, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Colors from '../../constant/color';
import { useAppDispatch } from '../../config/hook';
import { login } from '../../features/auth/AuthSlice';
import { getProfileApi, loginApi } from '../../features/auth/AuthService';
import { normalizeAuthResponse, normalizeAuthUser } from '../../utils/authResponse';
import { saveAuthToken } from '../../utils/authToken';
import { getApiErrorMessage } from '../../utils/apiError';
import { isValidEmail } from '../../utils/validation';

interface LoginForm {
  email: string;
  password: string;
}

type LoginFormErrors = Partial<Record<keyof LoginForm | 'general', string>>;

export default function Login(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const validateForm = () => {
    const nextErrors: LoginFormErrors = {};

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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const clearError = (field: keyof LoginForm) => {
    setErrors((current) => ({ ...current, [field]: '', general: '' }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const authResponse = await loginApi({
        email: form.email.trim(),
        password: form.password,
      });
      const normalizedAuth = normalizeAuthResponse(authResponse);

      if (!normalizedAuth.token) {
        throw new Error('Token login tidak ditemukan dari response API.');
      }

      saveAuthToken(normalizedAuth.token);

      const profileResponse = await getProfileApi();
      const profile =
        normalizeAuthUser(profileResponse) ?? normalizedAuth.user;

      if (!profile) {
        throw new Error('Data profile tidak ditemukan.');
      }

      dispatch(login(profile));
    } catch (error) {
      setErrors({
        general: getApiErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          boxShadow={Colors.cardShadow}
          gap="8"
        >
          <VStack gap="3" textAlign="center">
            <Flex gap="3" alignItems="center">
              <Icon as={FaUser} boxSize="10" color={Colors.primary} />
              <Text fontSize="3xl" fontWeight="bold" color={Colors.textPrimary}>
                Ronald Payment
              </Text>
            </Flex>
            <Text fontSize="md" color={Colors.textSecondary}>
              Please sign in to continue
            </Text>
          </VStack>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack gap="6" w="full">
            <Box w="full">
              <Text
                fontSize="sm"
                mb="2"
                color={Colors.textPrimary}
                fontWeight="medium"
              >
                Email
              </Text>
              <Input
                type="email"
                value={form.email}
                placeholder="ronald@example.com"
                size="lg"
                borderRadius="xl"
                borderColor={Colors.borderPrimary}
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

              <Input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                placeholder="Enter your password"
                size="lg"
                borderRadius="xl"
                borderColor={Colors.borderPrimary}
                pr="45px"
                onChange={(event) => {
                  setForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }));
                  clearError('password');
                }}
              />

              <Box
                position="absolute"
                right="12px"
                top="38px"
                cursor="pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </Box>
              {errors.password && (
                <Text mt="2" fontSize="sm" color={Colors.danger}>
                  {errors.password}
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
              Sign In
            </Button>
          </VStack>
          </form>

          <Button
            w="full"
            size="lg"
            borderRadius="xl"
            variant="outline"
            borderColor={Colors.info}
            color={Colors.info}
            _hover={{ bg: '#06B6D415' }}
            onClick={() => navigate('/payment')}
          >
            <FaFileInvoiceDollar />
            Bayar Invoice
          </Button>

          <VStack gap="4" w="full">
            <Flex align="center" gap="3" w="full">
              <Box h="1px" flex="1" bg={Colors.borderPrimary} />
              <Text fontSize="sm" color={Colors.textMuted}>
                Belum punya akun?
              </Text>
              <Box h="1px" flex="1" bg={Colors.borderPrimary} />
            </Flex>

            <Button
              w="full"
              size="lg"
              borderRadius="xl"
              variant="outline"
              borderColor={Colors.primary}
              color={Colors.primary}
              _hover={{ bg: Colors.primaryLight }}
              onClick={() => navigate('/sign-up')}
            >
              Daftar
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Flex>
  );
}
