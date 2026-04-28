import { Flex, Text, HStack } from '@chakra-ui/react';
import React from 'react';
import Colors from '../../constant/color';

interface FooterProps {
  name?: string;
  appVersion?: string;
}

function Footer({
  name = 'App Name',
  appVersion = 'dev',
}: FooterProps): React.JSX.Element {
  return (
    <Flex
      bg={Colors.white}
      borderTop={`1px solid ${Colors.borderPrimary}`}
      w="100%"
      px={6}
      py={4}
      minH="60px"
      justifyContent={{ base: 'center', md: 'space-between' }}
      alignItems="center"
      flexWrap="wrap"
      gap={4}
    >
      <HStack gap={1} justify={{ base: 'center', md: 'flex-start' }}>
        <Text
          fontSize="sm"
          color={Colors.textSecondary}
          fontWeight="500"
        >
          © {new Date().getFullYear()}
        </Text>
        <Text
          as="span"
          fontSize="sm"
          fontWeight="600"
          color={Colors.primary}
        >
          {name}
        </Text>
      </HStack>

      <HStack gap={4} justify="center">
        <Text 
          fontSize="xs" 
          color={Colors.textMuted}
          fontWeight="500"
        >
          Version {appVersion}
        </Text>
      </HStack>
    </Flex>
  );
}

export default Footer;
