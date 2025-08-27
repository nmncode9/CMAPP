import { useState } from "react";
import { writeFile, utils } from "xlsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContactsStore } from "@/stores/contactsStore"; 

export default function ExportButtons({ table }) {
  if (!table) return null;

  const contacts = useContactsStore((s) => s.contacts); // full list from store
  const [selectedFormat, setSelectedFormat] = useState(""); 
  const [allFormat, setAllFormat] = useState(""); 

  const BASE_COLUMNS = [
    "First Name","Middle Name","Last Name","Phonetic First Name","Phonetic Middle Name","Phonetic Last Name","Name Prefix","Name Suffix",
    "Nickname","File As","Organization Name","Organization Title","Organization Department","Birthday","Notes","Photo","Labels",
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

  const doExport = (rows, filename, format) => {
    const data = rows.map(transformRow);
    const dynamicColumns = Array.from(
      new Set([
        ...BASE_COLUMNS,
        ...data.flatMap(d => Object.keys(d).filter(k => !BASE_COLUMNS.includes(k))),
      ])
    );
    const ws = utils.json_to_sheet(data, { header: dynamicColumns });
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Contacts");
    writeFile(wb, `${filename}.${format}`);
  };

  const exportSelected = (format) => {
    const rows = table.getSelectedRowModel().rows.map(r => r.original);
    doExport(rows, "contacts-selected", format);
    setSelectedFormat(""); // reset dropdown
  };

  const exportAll = (format) => {
    doExport(contacts, "contacts-all", format); // bypass table → use store
    setAllFormat(""); // reset dropdown
  };

  return (
    <div className="flex gap-2 mb-4">
      {/* Export Selected */}
      <Select value={selectedFormat} onValueChange={exportSelected}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Export Selected" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="xlsx">XLS</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>

      {/* Export All */}
      <Select value={allFormat} onValueChange={exportAll}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Export All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="xlsx">XLS</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
