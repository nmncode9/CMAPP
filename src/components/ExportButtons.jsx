import { writeFile, utils } from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { useContactsStore } from "@/stores/contactsStore";

export default function ExportButtons({ table }) {
  const allContacts = useContactsStore((s) => s.contacts);
  const [selectedExport, setSelectedExport] = useState("Export Selected");
  const [allExport, setAllExport] = useState("Export All");

  if (!table) return null;


  const COLUMNS = [
    "First Name","Middle Name","Last Name","Phonetic First Name","Phonetic Middle Name","Phonetic Last Name","Name Prefix","Name Suffix",
    "Nickname","File As","Organization Name","Organization Title","Organization Department","Birthday","Notes","Photo","Labels",
    "E-mail 1 - Label","E-mail 1 - Value","E-mail 2 - Label","E-mail 2 - Value",
    "Phone 1 - Label","Phone 1 - Value","Phone 2 - Label","Phone 2 - Value",
    "Address 1 - Label","Address 1 - Formatted","Address 1 - Street","Address 1 - City","Address 1 - PO Box",
    "Address 1 - Region","Address 1 - Postal Code","Address 1 - Country","Address 1 - Extended Address",
    "Website 1 - Label","Website 1 - Value"
  ];

  const transformRow = (row) => {
    const [firstName, ...lastParts] = row.name?.split(" ") || [];
    const lastName = lastParts.join(" ");
    const emails = Object.entries(row.email || {});
    const phones = Object.entries(row.phone || {});
    const data = {
      "First Name": firstName || "",
      "Last Name": lastName || "",
      "Organization Name": row.company || "",
      "Address 1 - Formatted": row.address || "",
    };

    emails.forEach(([type, value], i) => {
      data[`E-mail ${i + 1} - Label`] = type;
      data[`E-mail ${i + 1} - Value`] = value;
    });

    phones.forEach(([type, value], i) => {
      data[`Phone ${i + 1} - Label`] = type;
      data[`Phone ${i + 1} - Value`] = value;
    });

    return data;
  };

  // CSV sanitization function, to avoid Excel treating the cell as a formula
  const sanitizeForCSV = (value) => {
    if (typeof value !== "string") return value;
    if (/^[=+\-@]/.test(value)) { // if field starts with =, +, -, or @
      return '\u200C' + value; // prevent Excel formula parsing, u200c is a zero-width character that is often ignored
    }
    return value;
  };

  const exportData = (rows, filename, format) => {
    const data = rows.map((r) => transformRow(r));
    const ws = utils.json_to_sheet(data, { header: COLUMNS });
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Contacts");

    if (format === "csv") {
      // sanitize sheet values
      Object.keys(ws).forEach((cell) => {
        if (cell[0] === "!") return;
        ws[cell].v = sanitizeForCSV(ws[cell].v);
      });
      writeFile(wb, filename, { bookType: "csv" });
    } else {
      writeFile(wb, filename);
    }
  };

  const handleExportSelected = (format) => {
    const rows = table.getSelectedRowModel().rows.map((r) => r.original);
    if (rows.length === 0) return;
    exportData(rows, `contacts-selected.${format}`, format);
    setSelectedExport("Export Selected"); // reset label
  };

  const handleExportAll = (format) => {
    exportData(allContacts, `contacts-all.${format}`, format);
    setAllExport("Export All"); // reset label
  };

  return (
    <div className="flex gap-2">
      {/* Export Selected */}
      <Select
        value={selectedExport}
        onValueChange={(val) => {
          if (val === "csv" || val === "xlsx") {
            handleExportSelected(val);
          }
        }}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Export Selected">Export Selected</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="xlsx">XLS</SelectItem>
        </SelectContent>
      </Select>

      {/* Export All */}
      <Select
        value={allExport}
        onValueChange={(val) => {
          if (val === "csv" || val === "xlsx") {
            handleExportAll(val);
          }
        }}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Export All">Export All</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="xlsx">XLS</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
