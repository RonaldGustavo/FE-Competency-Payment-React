import React from 'react';
import moment from 'moment';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './config/store';
import Routes from './routes';

moment.locale('id');

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <ChakraProvider value={defaultSystem}>
        <Routes />
      </ChakraProvider>
    </Provider>
  );
}

export default App;
