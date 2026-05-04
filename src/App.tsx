import React from 'react';
import moment from 'moment';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import Routes from './routes';

moment.locale('id');

function App(): React.JSX.Element {
  return (
      <ChakraProvider value={defaultSystem}>
        <Routes />
      </ChakraProvider>
  );
}

export default App;
