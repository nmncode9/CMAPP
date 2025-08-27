import { Button } from "./ui/button";
import { writeFile, utils } from "xlsx";

export default function ExportButtons({ table }) {
  if (!table) return null;

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

    // add emails
    emails.forEach(([type, value], i) => {
      data[`E-mail ${i + 1} - Label`] = type;
      data[`E-mail ${i + 1} - Value`] = value;
    });

    // add phones
    phones.forEach(([type, value], i) => {
      data[`Phone ${i + 1} - Label`] = type;
      data[`Phone ${i + 1} - Value`] = value;
    });

    return data;
  };

  const exportToCsv = (selectedOnly = false) => {
    const rows = selectedOnly
      ? table.getSelectedRowModel().rows
      : table.getRowModel().rows;

    const data = rows.map((r) => transformRow(r.original));

    // dynamically include any extra email/phone columns beyond the base
    const dynamicColumns = Array.from(
      new Set([
        ...BASE_COLUMNS,
        ...data.flatMap(d => Object.keys(d).filter(k => !BASE_COLUMNS.includes(k))),
      ])
    );

    const ws = utils.json_to_sheet(data, { header: dynamicColumns });
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
