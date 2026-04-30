import { useState, useMemo, useCallback } from 'react';

interface LocalTableResult<T> {
  paginatedData: T[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export const useLocalTable = <T extends Record<string, any>>(
  data: T[],
): LocalTableResult<T> => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const lower = search.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val ?? '').toLowerCase().includes(lower),
      ),
    );
  }, [data, search]);

  const total = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const paginatedData = filteredData.slice((safePage - 1) * perPage, safePage * perPage);

  const onSearch = useCallback((s: string) => {
    setPage(1);
    setSearch(s);
  }, []);

  const onPageChange = useCallback((p: number) => setPage(p), []);

  const onPerPageChange = useCallback((pp: number) => {
    setPage(1);
    setPerPage(pp);
  }, []);

  return {
    paginatedData,
    pagination: { total, page: safePage, perPage, totalPages },
    onSearch,
    onPageChange,
    onPerPageChange,
  };
};
