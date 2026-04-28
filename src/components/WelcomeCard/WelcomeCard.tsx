import React from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import Colors from '../../constant/color';

interface WelcomeCardProps {
  userName: string;
  userRole: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ userName, userRole }) => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <Box
      bg={`linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.info} 100%)`}
      borderRadius="16px"
      p={8}
      color={Colors.white}
      mb={8}
    >
      <Flex direction="column" gap={2}>
        <Heading size="lg">
          {greeting}, {userName}! 👋
        </Heading>
        <Text fontSize="md" opacity={0.95}>
          Welcome back to your payment dashboard. Here's your activity overview.
        </Text>
      </Flex>
    </Box>
  );
};

export default WelcomeCard;
