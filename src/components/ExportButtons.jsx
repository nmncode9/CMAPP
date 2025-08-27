import { Button } from "./ui/button";
import { writeFile, utils } from "xlsx";

export default function ExportButtons({ table }) {
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
      data[`E-mail ${i+1} - Label`] = type;
      data[`E-mail ${i+1} - Value`] = value;
    });

    phones.forEach(([type, value], i) => {
      data[`Phone ${i+1} - Label`] = type;
      data[`Phone ${i+1} - Value`] = value;
    });

    return data;
  };

  const exportToCsv = (selectedOnly = false) => {
    const rows = selectedOnly
      ? table.getSelectedRowModel().rows
      : table.getRowModel().rows;
    const data = rows.map(r => transformRow(r.original));
    const ws = utils.json_to_sheet(data, { header: COLUMNS });
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Contacts");
    writeFile(wb, selectedOnly ? "contacts-selected.xlsx" : "contacts-all.xlsx");
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button onClick={() => exportToCsv(true)}>Export Selected</Button>
      <Button onClick={() => exportToCsv(false)}>Export All</Button>
    </div>
  );
}
