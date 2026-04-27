import { Flex, Text } from '@chakra-ui/react';
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
      bg={Colors.bgPrimary}
      borderTop={`1px solid ${Colors.borderPrimary}`}
      w="100%"
      px={4}
      py={3}
      minH="50px"
      justifyContent={{ base: 'center', md: 'space-between' }}
      alignItems="center"
      flexWrap="wrap"
      gap={2}
    >
      <Text
        fontSize="sm"
        textAlign={{ base: 'center', md: 'left' }}
        color="gray.600"
      >
        © {new Date().getFullYear()}{' '}
        <Text as="span" fontWeight="600" color={Colors.info}>
          {name}
        </Text>
      </Text>

      <Text fontSize="sm" fontWeight="600" color="gray.600">
        Version: {appVersion}
      </Text>
    </Flex>
  );
}

export default Footer;
