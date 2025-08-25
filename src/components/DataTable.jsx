"use client";

import { useState, useMemo } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { columns } from "@/components/Columns";
import { useContactsStore } from "@/stores/contactsStore";
import PaginationControls from "./PaginationControls";

export default function DataTable({filters}) {
  
  const rows = useContactsStore((state) => state.contacts) || [];

  // --- helpers for matching ---
  const toText = (v) => (v ?? "").toString().toLowerCase().trim();
  const digitsOnly = (v) => (v ?? "").toString().replace(/\D+/g, "");

  const matchName = (row, q) =>
    !q || toText(row.name).includes(toText(q));

  const matchCompany = (row, q) =>
    !q || toText(row.company).includes(toText(q));

  const matchEmail = (row, q) => {
    if (!q) return true;
    const needle = toText(q);
    const values = Object.values(row.email || {});
    return values.some((val) => toText(val).includes(needle));
  };

  const matchPhone = (row, q) => {
    if (!q) return true;
    const needle = digitsOnly(q);
    if (!needle) return true; // if user typed non-digits only, don’t block results
    const values = Object.values(row.phone || {});
    return values.some((val) => digitsOnly(val).includes(needle));
  };

  // “type” means the label/key inside phone, e.g. mobile/work/home
  const matchType = (row, q) => {
    if (!q) return true;
    const needle = toText(q);
    const labels = Object.keys(row.phone || {});
    return labels.some((label) => toText(label).includes(needle));
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      matchName(row, filters?.name) &&
      matchEmail(row, filters?.email) &&
      matchPhone(row, filters?.phone) &&
      matchCompany(row, filters?.company) &&
      matchType(row, filters?.type)
    );
  }, [rows, filters]);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination, sorting
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  const ArrowUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3">
      <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06l-2.47-2.47V21a.75.75 0 0 1-1.5 0V4.81L8.78 7.28a.75.75 0 0 1-1.06-1.06l3.75-3.75Z" clipRule="evenodd" />
    </svg>
  );

  const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-3">
      <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();

                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}

                        {header.column.getIsSorted() === "asc" && <ArrowUpIcon />}
                        {header.column.getIsSorted() === "desc" && <ArrowDownIcon />}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="group"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <PaginationControls table={table} totalRows={rows.length}/>
    </div>
  );
}
