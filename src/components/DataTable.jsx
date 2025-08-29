"use client";

import { useState, useMemo, useEffect } from "react";
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

export default function DataTable({ filters, setTableInstance }) {
  const rows = useContactsStore((state) => state.contacts) || [];

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const toText = (v) => (v ?? "").toString().toLowerCase().trim();
      const digitsOnly = (v) => (v ?? "").toString().replace(/\D+/g, "");

      const matchName = !filters.name || toText(row.name).includes(toText(filters.name));
      const matchCompany = !filters.company || toText(row.company).includes(toText(filters.company));
      const matchEmail = !filters.email || Object.values(row.email || {}).some((v) => toText(v).includes(toText(filters.email)));
      const matchPhone = !filters.phone || Object.values(row.phone || {}).some((v) => digitsOnly(v).includes(digitsOnly(filters.phone)));
      const matchType = !filters.type || Object.keys(row.phone || {}).some((k) => toText(k).includes(toText(filters.type)));

      return matchName && matchCompany && matchEmail && matchPhone && matchType;
    });
  }, [rows, filters]);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: filteredRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: { pagination, sorting, rowSelection },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  useEffect(() => {
    setTableInstance?.(table);
  }, [table, setTableInstance]);

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
    <div className="w-full overflow-x-auto md:overflow-x-visible">
      <div className="overflow-hidden rounded-md border">
        <Table className="table-fixed w-full min-w-[700px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const hideOnMobile = header.column.columnDef.meta?.hideOnMobile;

                  return (
                    <TableHead
                      key={header.id}
                      className={`${hideOnMobile ? "hidden md:table-cell" : "truncate"} text-ellipsis overflow-hidden`}
                      style={{ width: header.column.columnDef.size, maxWidth: header.column.columnDef.size }}
                    >
                      {header.isPlaceholder
                        ? null
                        : canSort
                        ? (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="flex items-center gap-1 truncate"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === "asc" && <ArrowUpIcon />}
                            {header.column.getIsSorted() === "desc" && <ArrowDownIcon />}
                          </button>
                        )
                        : flexRender(header.column.columnDef.header, header.getContext())}
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
                  className="group cursor-pointer"
                  onClick={() => useContactsStore.getState().openModal(row.original.id, "view")}
                >
                  {row.getVisibleCells().map((cell) => {
                    const hideOnMobile = cell.column.columnDef.meta?.hideOnMobile;
                    return (
                      <TableCell
                        key={cell.id}
                        className={`${hideOnMobile ? "hidden md:table-cell" : "truncate"} text-ellipsis overflow-hidden whitespace-nowrap`}
                        style={{ width: cell.column.columnDef.size, maxWidth: cell.column.columnDef.size }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
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
      </div>
      <PaginationControls table={table} totalRows={rows.length} />
    </div>
  );
}
