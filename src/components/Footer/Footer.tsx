import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import Colors from '../../constant/color';

function Footer(): React.JSX.Element {
  const appVersion = import.meta.env.REACT_APP_VERSION || 'dev';
  return (
    <Flex
      bg={Colors.bgPrimary}
      borderTop={`1px solid ${Colors.borderPrimary}`}
      w="100%"
      px="4"
      py="2"
      minHeight={50}
      gap="2"
      justifyContent={['center', 'center', 'space-between']}
      textAlign={['center', 'center', 'inherit']}
      alignItems="center"
      flexWrap="wrap"
    >
      <footer>
        <Text fontSize="sm">
          <Text as="span" fontWeight="700">
            Copyright ©{new Date().getFullYear()}
          </Text>{' '}
          <Text as="span" fontWeight="700" color={Colors.info}>
            DBO
          </Text>{' '}
          All rights reserved.
        </Text>
      </footer>
      <Text fontWeight="700" fontSize="sm">
        Version {appVersion}
      </Text>
    </Flex>
  );
}

export default Footer;
