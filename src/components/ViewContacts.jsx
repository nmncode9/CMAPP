// ViewContacts.jsx
import { useContactsStore } from "../stores/contactsStore";
import { useMemo, useState } from "react";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function ViewContacts() {
  const contacts = useContactsStore((state) => state.contacts);
  const [rowSelection, setRowSelection] = useState({});

  const columnHelper = createColumnHelper();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            {...{
              checked: table.getIsAllPageRowsSelected(),
              onChange: table.getToggleAllPageRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            {...{
              checked: row.getIsSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
        size: 50,
      }),

      columnHelper.accessor("name", { header: "Name" }),

      // Show only values for phone
      columnHelper.display({
        id: "phone",
        header: "Phone Number",
        cell: ({ row }) =>
          Object.values(row.original.phone || {})
            .filter(Boolean)
            .join(", "),
      }),

      // Show only values for email
      columnHelper.display({
        id: "email",
        header: "Email",
        cell: ({ row }) =>
          Object.values(row.original.email || {})
            .filter(Boolean)
            .join(", "),
      }),

      columnHelper.accessor("address", { header: "Address" }),
      columnHelper.accessor("company", { header: "Company" }),

      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="opacity-0 group-hover:opacity-100 flex gap-2">
            <button title="View">👁️</button>
            <button title="Edit">✏️</button>
            <button title="Delete">🗑️</button>
          </div>
        ),
        size: 100,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: contacts,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <table className="min-w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border-b px-4 py-2 text-left">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="group hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-b px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
