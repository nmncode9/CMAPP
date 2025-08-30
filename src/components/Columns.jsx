import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { useContactsStore } from "@/stores/contactsStore";

const columnHelper = createColumnHelper();

function stringWithEmptyLast(rowA, rowB, columnId) {
  const valA = (rowA.getValue(columnId) || "").toString().trim();
  const valB = (rowB.getValue(columnId) || "").toString().trim();

  if (!valA && valB) return 1;
  if (valA && !valB) return -1;
  return valA.localeCompare(valB);
}

export const columns = [
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
        onClick={e => e.stopPropagation()}
        aria-label="Select row"
      />
    ),
    size: 30,
  }),

  columnHelper.accessor(
    (row) =>
      Object.keys(row)
        .filter((key) => key.toLowerCase().includes("name"))
        .map((key) => row[key])
        .filter(Boolean)
        .join(" "),
    { id: "name", header: "Name", enableSorting: true, sortingFn: stringWithEmptyLast, size: 150 }
  ),

  columnHelper.accessor(
    (row) => {
      const phones = row.phone ? Object.values(row.phone).filter(Boolean) : [];
      return phones[0] || "";
    },
    { id: "phone", header: "Phone Number", size: 130 }
  ),

  columnHelper.accessor(
    (row) => {
      const emails = row.email ? Object.values(row.email).filter(Boolean) : [];
      return emails[0] || "";
    },
    { id: "email", header: "Email", enableSorting: true, sortingFn: stringWithEmptyLast, size: 200 }
  ),

  columnHelper.accessor(
    (row) => row.address || "",
    { id: "address", header: "Address", enableSorting: true, sortingFn: stringWithEmptyLast, size: 250 }
  ),

  columnHelper.accessor(
    (row) =>
      Object.keys(row)
        .filter((key) => key.toLowerCase().includes("organization") || key.toLowerCase().includes("company"))
        .map((key) => row[key])
        .filter(Boolean)
        .join(" "),
    { id: "company", header: "Company", enableSorting: true, sortingFn: stringWithEmptyLast, size: 100 }
  ),

  columnHelper.display({
    id: "actions",
    header: "Actions",
    meta: { hideOnMobile: true },
    cell: ({ row }) => {
      const openModal = useContactsStore((s) => s.openModal);
      const deleteContact = useContactsStore((s) => s.deleteContact);
      const contact = row.original;

      return (
        <div className="opacity-0 group-hover:opacity-100 flex gap-2">
          <button title="View" onClick={(e) => { e.stopPropagation(); openModal(contact.id, "view"); }} className="text-[var(--neutral-light)] hover:text-[var(--primary)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
            </svg>
          </button>
          <button title="Edit" onClick={(e) => { e.stopPropagation(); openModal(contact.id, "edit"); }} className="text-[var(--neutral-light)] hover:text-[var(--primary)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
            </svg>
          </button>
          <button title="Delete" onClick={(e) => { e.stopPropagation(); deleteContact(contact.id); }} className="text-[var(--neutral-light)] hover:text-[var(--primary)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      );
    },
  }),
];
