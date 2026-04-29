import React from 'react';
import { Box, Button, Flex, Icon, Text, VStack } from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import Colors from '../../constant/color';

interface AppModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  maxW?: string;
}

export default function AppModal({
  isOpen,
  title,
  subtitle,
  children,
  footer,
  onClose,
  maxW = '640px',
}: AppModalProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <Flex
      position="fixed"
      inset={0}
      zIndex={1400}
      align="center"
      justify="center"
      bg="rgba(15, 23, 42, 0.55)"
      px={4}
      py={6}
    >
      <Box
        w="full"
        maxW={maxW}
        maxH="calc(100vh - 48px)"
        overflowY="auto"
        bg={Colors.white}
        borderRadius="24px"
        boxShadow="0 24px 80px rgba(15, 23, 42, 0.28)"
        border={`1px solid ${Colors.borderPrimary}`}
      >
        <Flex
          align="flex-start"
          justify="space-between"
          gap={4}
          px={{ base: 6, md: 8 }}
          pt={{ base: 6, md: 8 }}
          pb={4}
        >
          <VStack align="flex-start" gap={1}>
            <Text fontSize="xl" fontWeight="bold" color={Colors.textPrimary}>
              {title}
            </Text>
            {subtitle && (
              <Text fontSize="sm" color={Colors.textSecondary}>
                {subtitle}
              </Text>
            )}
          </VStack>

          <Button
            aria-label="Close modal"
            size="sm"
            variant="ghost"
            color={Colors.textSecondary}
            onClick={onClose}
          >
            <Icon as={FaTimes} />
          </Button>
        </Flex>

        <Box px={{ base: 6, md: 8 }} pb={footer ? 5 : { base: 6, md: 8 }}>
          {children}
        </Box>

        {footer && (
          <Flex
            justify="flex-end"
            gap={3}
            px={{ base: 6, md: 8 }}
            py={5}
            borderTop={`1px solid ${Colors.borderPrimary}`}
            bg={Colors.bgPrimary}
          >
            {footer}
          </Flex>
        )}
      </Box>
    </Flex>
  );
}
