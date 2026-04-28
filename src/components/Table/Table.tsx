import { useState, useMemo, useEffect, type ChangeEvent } from 'react';
import {
  Box,
  chakra,
  Input,
  Flex,
  Text,
  Button,
  VStack,
  Table as ChakraTable,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Colors from '../../constant/color';
import type { Column } from '../../interface';

interface TableAction {
  icon: React.ReactElement;
  label: string;
  onClick: (row: any) => void;
  colorScheme?: string;
  isDisabled?: (row: any) => boolean;
}

interface TableProps {
  data: any[];
  columns: Column[];
  actions?: TableAction[];
}

const Table = ({ data, columns, actions }: TableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const lower = searchTerm.toLowerCase();
    return data.filter((row) =>
      columns.some((col) =>
        String(row[col.key] ?? '').toLowerCase().includes(lower)
      )
    );
  }, [data, searchTerm, columns]);

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + pageSize
  );

  const getPages = () => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <VStack gap={4} align="stretch" w="full">
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Box maxW="280px" w="full">
          <Input
            placeholder="Cari data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
            borderRadius="14px"
            bg="gray.50"
            borderColor={Colors.borderPrimary}
            _focus={{ bg: 'white', borderColor: 'blue.400', boxShadow: '0 0 0 1px rgba(59,130,246,0.25)' }}
          />
        </Box>

        <Flex align="center" gap={3}>
          <Text fontSize="xs" color="gray.500">
            Rows per page
          </Text>
          <chakra.select
            value={pageSize}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setPageSize(Number(e.target.value))}
            style={{
              width: '110px',
              borderRadius: '14px',
              backgroundColor: '#F8FAFC',
              borderColor: Colors.borderPrimary,
              borderStyle: 'solid',
              borderWidth: '1px',
              padding: '10px 12px',
            }}
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </chakra.select>
        </Flex>
      </Flex>

      <Box
        overflowX="auto"
        borderWidth="1px"
        borderColor="#D5E4FB"
        borderRadius="20px"
        bg="#EFF6FF"
        boxShadow={Colors.cardShadow}
      >
        <ChakraTable.Root variant="outline">
          <ChakraTable.Header>
            <ChakraTable.Row
              bg="#DDEAFE"
              borderBottomWidth="1px"
              borderColor="#BBD2F6"
            >
              {columns.map((col) => (
                <ChakraTable.ColumnHeader
                  key={col.key}
                  py={4}
                  px={5}
                  fontSize="sm"
                  fontWeight="700"
                  color="#1E3A8A"
                  letterSpacing="wide"
                >
                  {col.header}
                </ChakraTable.ColumnHeader>
              ))}

              {actions && (
                <ChakraTable.ColumnHeader
                  py={4}
                  px={5}
                  textAlign="center"
                  fontSize="sm"
                  fontWeight="700"
                  color="#1E3A8A"
                  position="sticky"
                  right={0}
                  bg="#DDEAFE"
                  zIndex={3}
                  borderLeft="1px solid"
                  borderColor="#BBD2F6"
                  boxShadow="-4px 0 10px -6px rgba(0, 0, 0, 0.08)"
                >
                  Action
                </ChakraTable.ColumnHeader>
              )}
            </ChakraTable.Row>
          </ChakraTable.Header>

          <ChakraTable.Body>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <ChakraTable.Row
                  key={i}
                  _odd={{ bg: 'white' }}
                  _even={{ bg: '#F7FBFF' }}
                  _hover={{ bg: '#D7E8FF' }}
                  transition="background-color 0.2s ease"
                >
                  {columns.map((col) => (
                    <ChakraTable.Cell
                      key={col.key}
                      py={4}
                      px={5}
                      fontSize="sm"
                      color="#253858"
                      borderBottom="1px solid"
                      borderColor="#E2E8F0"
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </ChakraTable.Cell>
                  ))}

                  {actions && (
                    <ChakraTable.Cell
                      py={4}
                      px={5}
                      textAlign="center"
                      position="sticky"
                      right={0}
                      zIndex={2}
                      bg={i % 2 === 0 ? '#F7FBFF' : 'white'}
                      borderLeft="1px solid"
                      borderColor="#BBD2F6"
                    >
                      <Flex gap={2} justify="center">
                        {actions.map((action) => (
                          <Button
                            key={action.label}
                            aria-label={action.label}
                            size="sm"
                            variant="ghost"
                            colorScheme={action.colorScheme || 'blue'}
                            onClick={() => action.onClick(row)}
                            disabled={action.isDisabled?.(row)}
                            borderRadius="12px"
                            _hover={{ bg: `${action.colorScheme || 'blue'}.50` }}
                            p={2}
                          >
                            {action.icon}
                          </Button>
                        ))}
                      </Flex>
                    </ChakraTable.Cell>
                  )}
                </ChakraTable.Row>
              ))
            ) : (
              <ChakraTable.Row>
                <ChakraTable.Cell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  textAlign="center"
                  py={12}
                >
                  <Text fontSize="sm" color="gray.500">
                    Tidak ada data
                  </Text>
                </ChakraTable.Cell>
              </ChakraTable.Row>
            )}
          </ChakraTable.Body>
        </ChakraTable.Root>
      </Box>

      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Text fontSize="xs" color="gray.500">
          {totalItems > 0
            ? `${startIndex + 1} - ${Math.min(startIndex + pageSize, totalItems)} dari ${totalItems}`
            : 'Tidak ada data ditampilkan'}
        </Text>

        <Flex align="center" gap={1}>
          <Button
            aria-label="Prev"
            size="sm"
            variant="ghost"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            minW="34px"
            h="34px"
            borderRadius="12px"
          >
            <FaChevronLeft size={12} />
          </Button>

          {getPages().map((page) => (
            <Button
              key={page}
              size="sm"
              onClick={() => setCurrentPage(page)}
              bg={page === currentPage ? 'blue.600' : 'transparent'}
              color={page === currentPage ? 'white' : 'gray.600'}
              minW="34px"
              h="34px"
              borderRadius="12px"
              border={page === currentPage ? 'none' : '1px solid'}
              borderColor={page === currentPage ? 'transparent' : 'gray.200'}
              _hover={{ bg: page === currentPage ? 'blue.700' : 'gray.100' }}
            >
              {page}
            </Button>
          ))}

          <Button
            aria-label="Next"
            size="sm"
            variant="ghost"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalItems === 0}
            minW="34px"
            h="34px"
            borderRadius="12px"
          >
            <FaChevronRight size={12} />
          </Button>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default Table;
