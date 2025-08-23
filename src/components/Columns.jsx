import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

const columnHelper = createColumnHelper();

// Generic sorting function for all applicable headers
function stringWithEmptyLast(rowA, rowB, columnId) {
  const valA = (rowA.getValue(columnId) || "").toString().trim();
  const valB = (rowB.getValue(columnId) || "").toString().trim();

  if (!valA && valB) return 1;   // empty goes last
  if (valA && !valB) return -1;  // non-empty first
  return valA.localeCompare(valB); // alphabetically
}

export const columns = [
  // --- Select All / Row Selection Column ---
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 50,
  }),

  // --- Name column: concatenate all fields containing "name" ---
  columnHelper.accessor(
    (row) =>
      Object.keys(row)
        .filter((key) => key.toLowerCase().includes("name"))
        .map((key) => row[key])
        .filter(Boolean)
        .join(" "),
    { id: "name", header: "Name", enableSorting: true, sortingFn: stringWithEmptyLast, }
  ),

  // --- Phone column: show first number ---
  columnHelper.accessor(
    (row) => {
      const phones = row.phone ? Object.values(row.phone).filter(Boolean) : [];
      return phones[0] || "";
    },
    { id: "phone", header: "Phone Number" }
  ),

  // --- Email column: show first email ---
  columnHelper.accessor(
    (row) => {
      const emails = row.email ? Object.values(row.email).filter(Boolean) : [];
      return emails[0] || "";
    },
    { id: "email",
      header: "Email",
      enableSorting: true,
      sortingFn: stringWithEmptyLast,
    }
  ),

  // --- Address column: concatenate all Address 1 - ... fields ---
  columnHelper.accessor(
    (row) =>
      Object.keys(row)
        .filter((key) => key.trim().toLowerCase().startsWith("address 1 -"))
        .map((key) => row[key])
        .filter(Boolean)
        .join(", "),
    { id: "address", header: "Address", enableSorting: true, sortingFn: stringWithEmptyLast,}
  ),

  // --- Company column: concatenate all fields containing "organization" or "company" ---
  columnHelper.accessor(
    (row) =>
      Object.keys(row)
        .filter(
          (key) =>
            key.toLowerCase().includes("organization") ||
            key.toLowerCase().includes("company")
        )
        .map((key) => row[key])
        .filter(Boolean)
        .join(" "),
    { id: "company", header: "Company", enableSorting: true, sortingFn: stringWithEmptyLast, }
  ),

  // --- Actions column ---
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
  }),
];
