import { useState, useEffect, type ChangeEvent } from 'react';
import {
  Box,
  chakra,
  Input,
  Flex,
  Text,
  Button,
  VStack,
  Spinner,
  Table as ChakraTable,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Colors from '../../constant/color';
import type { Column } from '../../interface/global';
import Tooltip from '../Tooltip/Tooltip';

interface TableAction {
  icon: React.ReactElement;
  label: string;
  onClick: (row: any) => void;
  bg?: string;
  isDisabled?: (row: any) => boolean;
  isVisible?: (row: any) => boolean;
}

interface TableProps {
  data: any[];
  columns: Column[];
  actions?: TableAction[];
  isLoading?: boolean;
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
  onSearch: (search: string) => void;
}

const Table = ({
  data,
  columns,
  actions,
  isLoading = false,
  pagination,
  onPageChange,
  onPerPageChange,
  onSearch,
}: TableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce: panggil onSearch 400ms setelah user berhenti mengetik
  useEffect(() => {
    const timer = setTimeout(() => onSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const { total, page, perPage, totalPages } = pagination;
  const startIndex = (page - 1) * perPage;

  const getPages = () => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <VStack gap={4} align="stretch" w="full">
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Box maxW="280px" w="full">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
            borderRadius="14px"
            bg="gray.50"
            borderColor={Colors.borderPrimary}
            _focus={{
              bg: 'white',
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px rgba(59,130,246,0.25)',
            }}
          />
        </Box>

        <Flex align="center" gap={3}>
          <Text fontSize="xs" color="gray.500">
            Rows per page
          </Text>
          <chakra.select
            value={perPage}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onPerPageChange(Number(e.target.value))
            }
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

      <Box position="relative">
        <Box
          overflowX="auto"
          borderWidth="1px"
          borderColor="#D5E4FB"
          borderRadius="20px"
          bg="#EFF6FF"
          boxShadow={Colors.cardShadow}
          opacity={isLoading ? 0.5 : 1}
          transition="opacity 0.2s"
          pointerEvents={isLoading ? 'none' : 'auto'}
        >
          <ChakraTable.Root variant="outline">
            <ChakraTable.Header>
              <ChakraTable.Row bg="#DDEAFE" borderBottomWidth="1px" borderColor="#BBD2F6">
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
                    zIndex={1}
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
              {data.length > 0 ? (
                data.map((row, i) => (
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
                          {actions.map((action) =>
                            action.isVisible && !action.isVisible(row) ? null : (
                            <Tooltip content={action.label} key={action.label}>
                              <Button
                                aria-label={action.label}
                                size="sm"
                                bg={action.bg || 'blue.500'}
                                color="white"
                                _hover={{ bg: action.bg || 'blue.600' }}
                                onClick={() => action.onClick(row)}
                                disabled={action.isDisabled?.(row)}
                                borderRadius="14px"
                                p={2}
                              >
                                {action.icon}
                              </Button>
                            </Tooltip>
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
                      {isLoading ? 'Memuat data...' : 'Tidak ada data'}
                    </Text>
                  </ChakraTable.Cell>
                </ChakraTable.Row>
              )}
            </ChakraTable.Body>
          </ChakraTable.Root>
        </Box>

        {isLoading && (
          <Flex
            position="absolute"
            inset={0}
            align="center"
            justify="center"
            pointerEvents="none"
          >
            <Spinner size="lg" color="blue.500" />
          </Flex>
        )}
      </Box>

      {/* Pagination info + controls */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
        <Text fontSize="xs" color="gray.500">
          {total > 0
            ? `${startIndex + 1} - ${Math.min(startIndex + perPage, total)} dari ${total}`
            : 'Tidak ada data ditampilkan'}
        </Text>

        <Flex align="center" gap={1}>
          <Button
            aria-label="Prev"
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            minW="34px"
            h="34px"
            borderRadius="12px"
          >
            <FaChevronLeft size={12} />
          </Button>

          {getPages().map((p) => (
            <Button
              key={p}
              size="sm"
              onClick={() => onPageChange(p)}
              bg={p === page ? 'blue.600' : 'transparent'}
              color={p === page ? 'white' : 'gray.600'}
              minW="34px"
              h="34px"
              borderRadius="12px"
              border={p === page ? 'none' : '1px solid'}
              borderColor={p === page ? 'transparent' : 'gray.200'}
              _hover={{ bg: p === page ? 'blue.700' : 'gray.100' }}
            >
              {p}
            </Button>
          ))}

          <Button
            aria-label="Next"
            size="sm"
            variant="ghost"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages || total === 0}
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
