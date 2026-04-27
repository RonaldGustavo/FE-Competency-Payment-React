import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Input,
  Stack,
  Text,
  InputGroup,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export default function Login(): React.JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4}>
      <Container maxW="md">
        <Stack
          bg="white"
          p={{ base: 6, md: 8 }}
          borderRadius="2xl"
          boxShadow="sm"
          gap="6"
        >
          {/* //NOTE - Header login */}
          <Stack gap="1" textAlign="center">
            <Text fontSize="2xl" fontWeight="bold">
              Login
            </Text>
            <Text fontSize="sm" color="gray.500">
              Silakan login untuk melanjutkan
            </Text>
          </Stack>

          {/* //NOTE - Form login */}
          <Stack gap="4">
            <Box>
              <Text fontSize="sm" mb="1" color="gray.600">
                Username
              </Text>
              <Input
                name="nik"
                placeholder="Masukkan Username"
                size="md"
                borderRadius="lg"
              />
            </Box>

            <Box>
              <Text fontSize="sm" mb="1" color="gray.600">
                Password
              </Text>

              <InputGroup
                endElement={
                  <IconButton
                    aria-label="toggle password"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </IconButton>
                }
              >
                <Input
                  name="password"
                  placeholder="Masukkan password"
                  type={showPassword ? 'text' : 'password'}
                  borderRadius="lg"
                />
              </InputGroup>
            </Box>
          </Stack>

          {/* //NOTE - Button login    */}
          <Button colorScheme="blue" size="md" borderRadius="lg">
            Masuk
          </Button>
        </Stack>
      </Container>
    </Flex>
  );
}
