import { useState } from "react";
import DataTable from "./DataTable";
import Filters from "./Filters";
import ContactModal from "./ContactModal";
import ExportButtons from "./ExportButtons";
import { useContactsStore } from "@/stores/contactsStore";
import AddContactSelect from "./AddContactSelect";

export default function ContactsPage() {

  const [filters, setFilters] = useState({name: "", email: "", phone: "", company: "", type: ""})
  const [tableInstance, setTableInstance] = useState(null);

  const addNewContact = useContactsStore((s) => s.addNewContact);

  
  return (
    <main className="max-w-[1100px] mx-auto">
      <Filters filters={filters} setFilters={setFilters} />
      <div className="flex justify-between">
        <ExportButtons table={tableInstance} />
        <AddContactSelect />
      </div>
      <DataTable filters={filters} setTableInstance={setTableInstance} />
      <ContactModal className="h-[80vh] overflow-y-scroll"/>
    </main>
  );
}