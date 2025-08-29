import { useContactsStore } from "@/stores/contactsStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";

export default function AddContactSelect() {
  const addNewContact = useContactsStore((s) => s.addNewContact);
  const addRawFiles = useContactsStore((s) => s.addRawFiles);

  const [selectedAction, setSelectedAction] = useState("Add Contact");

  const handleSelect = (val) => {
    if (val === "add") addNewContact();
    if (val === "upload") {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      input.onchange = (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        addRawFiles(files);
        // No navigate here, user is already on ContactsPage
      };
      input.click();
    }
    setSelectedAction("Add Contact"); // always reset label like ExportButtons
  };

  return (
    <Select value={selectedAction} onValueChange={handleSelect}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Add Contact">Add Contacts</SelectItem>
        <SelectItem value="add">Add a Contact</SelectItem>
        <SelectItem value="upload">Upload a List</SelectItem>
      </SelectContent>
    </Select>
  );
}
