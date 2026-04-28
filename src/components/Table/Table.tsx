import { useState, useMemo } from 'react';
import { Box, Input, Flex, Text, Button, VStack } from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Colors from '../../constant/color';
import type { Column } from '../../interface';

interface TableProps {
  data: Record<string, any>[];
  columns: Column[];
}

const Table = ({ data, columns }: TableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const pageSize = 10;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) =>
      columns.some((col) =>
        String(row[col.key] ?? '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    );
  }, [data, searchTerm, columns]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;

  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const getPages = () => {
    const pages: number[] = [];
    const max = 5;

    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + max - 1);

    if (end - start < max - 1) {
      start = Math.max(1, end - max + 1);
    }

    for (let i = start; i <= end; i++) pages.push(i);

    return pages;
  };

  return (
    <VStack gap={6} align="stretch">
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        w="260px"
      />

      {/* //NOTE - Table */}
      <Box>
        <Flex
          borderBottom="1px solid"
          borderColor={Colors.borderPrimary}
          pb={3}
        >
          {columns.map((col) => (
            <Box key={col.key} flex="1" fontSize="xs">
              {col.header}
            </Box>
          ))}
        </Flex>

        <VStack align="stretch" mt={2}>
          {paginatedData.map((row, i) => (
            <Flex key={i} py={3}>
              {columns.map((col) => (
                <Box key={col.key} flex="1">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? '')}
                </Box>
              ))}
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* //NOTE - Pagination */}
      <Flex justify="space-between" align="center" mt={2}>
        <Text fontSize="xs" color={Colors.textSecondary}>
          {startIndex + 1} - {Math.min(startIndex + pageSize, totalItems)} of{' '}
          {totalItems}
        </Text>

        <Flex align="center" gap={1}>
          <Button
            size="sm"
            variant="ghost"
            borderRadius="full"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            _hover={{ bg: Colors.bgPrimary }}
          >
            <FaChevronLeft />
          </Button>

          {getPages().map((p) => {
            const isActive = p === currentPage;

            return (
              <Button
                key={p}
                size="sm"
                borderRadius="full"
                minW="32px"
                px={3}
                fontWeight={isActive ? '600' : '400'}
                bg={isActive ? Colors.primary : 'transparent'}
                color={isActive ? 'white' : Colors.textPrimary}
                border={isActive ? 'none' : `1px solid ${Colors.borderPrimary}`}
                onClick={() => setCurrentPage(p)}
                _hover={{
                  bg: isActive ? Colors.primary : Colors.bgPrimary,
                }}
                _active={{
                  transform: 'scale(0.96)',
                }}
                transition="all 0.2s ease"
                boxShadow={isActive ? 'sm' : 'none'}
              >
                {p}
              </Button>
            );
          })}

          <Button
            size="sm"
            variant="ghost"
            borderRadius="full"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            _hover={{ bg: Colors.bgPrimary }}
          >
            <FaChevronRight />
          </Button>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default Table;
