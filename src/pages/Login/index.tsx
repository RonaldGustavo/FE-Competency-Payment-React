import React, { useState } from 'react';
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
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Colors from '../../constant/color';

export default function Login(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

          <VStack gap="6" w="full">
            <Box w="full">
              <Text
                fontSize="sm"
                mb="2"
                color={Colors.textPrimary}
                fontWeight="medium"
              >
                Username
              </Text>
              <Input
                placeholder="Enter your username"
                size="lg"
                borderRadius="xl"
                borderColor={Colors.borderPrimary}
                _focus={{
                  borderColor: Colors.primary,
                  boxShadow: `0 0 0 1px ${Colors.primary}`,
                }}
              />
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
                placeholder="Enter your password"
                size="lg"
                borderRadius="xl"
                borderColor={Colors.borderPrimary}
                pr="45px"
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
            </Box>
          </VStack>

          <Button
            w="full"
            size="lg"
            borderRadius="xl"
            bg={Colors.primary}
            color="white"
            _hover={{ bg: Colors.primaryDark }}
          >
            Sign In
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
