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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    const filtered = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search data..."
        value={searchTerm}
        onChange={handleSearch}
        className="max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.slice(0, 10).map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>{row[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};