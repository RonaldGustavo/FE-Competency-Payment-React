import { Box, Heading, Text, Button, Center } from '@chakra-ui/react';
import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error has occurred.';
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data || errorMessage;
  }

  return (
    <Center height="100vh" bg="red.50">
      <Box
        textAlign="center"
        maxW="lg"
        p={6}
        borderRadius="md"
        bg="white"
        boxShadow="lg"
      >
        <Heading as="h1" size="xl" color="red.600" mb={4}>
          Error
        </Heading>
        <Text fontSize="md" color="gray.700" mb={6}>
          {errorMessage}
        </Text>
        <Link to="/">
          <Button colorScheme="red">Beranda</Button>
        </Link>
      </Box>
    </Center>
  );
}

export default ErrorPage;
