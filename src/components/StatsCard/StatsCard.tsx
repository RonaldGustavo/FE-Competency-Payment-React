import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import Colors from '../../constant/color';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
  iconBg?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  bgColor = Colors.primary,
  iconBg,
}) => {
  return (
    <Box
      h="100%"
      bg={Colors.white}
      p={6}
      borderRadius="12px"
      border={`1px solid ${Colors.borderPrimary}`}
      transition="all 0.3s ease"
      _hover={{
        boxShadow: Colors.cardShadowHover,
        transform: 'translateY(-4px)',
      }}
    >
      <Flex gap={4} align="flex-start">
        <Flex
          align="center"
          justify="center"
          w="56px"
          h="56px"
          borderRadius="12px"
          bg={iconBg || `${bgColor}15`}
          color={bgColor}
          fontSize="24px"
        >
          {icon}
        </Flex>

        <Flex direction="column" flex={1}>
          <Text fontSize="sm" color={Colors.textSecondary} mb={1}>
            {label}
          </Text>
          <Text fontSize="28px" fontWeight="700" color={Colors.textPrimary}>
            {value}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default StatsCard;
