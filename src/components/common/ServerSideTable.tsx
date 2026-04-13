import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ServerSideColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface ServerSideTableProps<T> {
  data: T[];
  columns: ServerSideColumn<T>[];
  page: number;
  pageSize: number;
  total: number;
  search?: string;
  onSearchChange?: (value: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  searchPlaceholder?: string;
  toolbarContent?: ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
  showRowNumber?: boolean;
}

function ServerSideTable<T>({
  data,
  columns,
  page,
  pageSize,
  total,
  search = "",
  onSearchChange,
  onPageChange,
  onPageSizeChange,
  searchPlaceholder = "Search...",
  toolbarContent,
  emptyMessage = "No data found",
  isLoading = false,
  showRowNumber = true,
}: ServerSideTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasRows = data.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          {onSearchChange ? (
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full md:max-w-sm"
            />
          ) : null}
          {toolbarContent}
        </div>

        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-full md:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {showRowNumber ? (
                <TableHead className="w-14 text-center">#</TableHead>
              ) : null}
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showRowNumber ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : hasRows ? (
              data.map((row, index) => (
                <TableRow key={index}>
                  {showRowNumber ? (
                    <TableCell className="text-center text-muted-foreground">
                      {(page - 1) * pageSize + index + 1}
                    </TableCell>
                  ) : null}
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showRowNumber ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
        <div className="text-muted-foreground">
          Showing {hasRows ? (page - 1) * pageSize + 1 : 0}-
          {Math.min(page * pageSize, total)} of {total} rows
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <div className="min-w-20 text-center text-muted-foreground">
            Page {page} / {totalPages}
          </div>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ServerSideTable;
