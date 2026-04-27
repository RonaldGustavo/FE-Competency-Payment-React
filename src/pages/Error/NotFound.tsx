import { Heading, Text, Button, VStack, Flex, Box } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import Colors from '../../constant/color'

function NotFound () {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-b, blue.50, white)"
      px={6}
    >
      <Box
        bg="white"
        p={{ base: 6, md: 10 }}
        borderRadius="xl"
        boxShadow="lg"
        textAlign="center"
        maxW="md"
        w="full"
      >
        <VStack gap={5}>
          <Heading
            fontSize={{ base: '5xl', md: '6xl' }}
            fontWeight="extrabold"
            color={Colors.info}
            lineHeight="1"
          >
            404
          </Heading>

          <Heading size="md" color="gray.700">
            Halaman tidak ditemukan
          </Heading>

          <Text fontSize="sm" color="gray.500">
            Halaman yang Anda cari tidak tersedia.
            Silakan kembali ke halaman utama untuk melanjutkan.
          </Text>

          <Link to="/">
            <Button
              colorScheme="blue"
              size="md"
              px={8}
              borderRadius="lg"
            >
              Kembali ke Beranda
            </Button>
          </Link>
        </VStack>
      </Box>
    </Flex>
  )
}

export default NotFound