import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface DataTableProps {
  data: any[];
  columns: string[];
}

export const DataTable = ({ data, columns }: DataTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [page, setPage] = useState(1);
  const rowsPerPage = 50;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setPage(1); // Reset page on search

    const filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search data..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
        <div className="text-sm text-[#E2E2E0]/70">
          Showing {filteredData.length} records
        </div>
      </div>
      <div className="rounded-md border max-h-[600px] overflow-auto relative">
        <Table>
          <TableHeader className="sticky top-0 bg-[#12484C] z-10 shadow-sm">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="whitespace-nowrap font-bold">{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index} className="hover:bg-[#0E2931]/50">
                {columns.map((column) => (
                  <TableCell key={column} className="whitespace-nowrap truncate max-w-[200px]" title={String(row[column])}>
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm border rounded-md hover:bg-[#0E2931] disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-[#E2E2E0]/80">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 text-sm border rounded-md hover:bg-[#0E2931] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};