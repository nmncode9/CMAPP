import { useState } from "react";
import DataTable from "./DataTable";
import Filters from "./Filters";
import ContactModal from "./ContactModal";
import ExportButtons from "./ExportButtons";
import { useContactsStore } from "@/stores/contactsStore";

export default function ContactsPage() {

  const [filters, setFilters] = useState({name: "", email: "", phone: "", company: "", type: ""})
  const [tableInstance, setTableInstance] = useState(null);

  const addNewContact = useContactsStore((s) => s.addNewContact);

  
  return (
    <main className="max-w-[1100px] mx-auto">
      <Filters filters={filters} setFilters={setFilters} />
      <div className="flex justify-between">
        <ExportButtons table={tableInstance} />
        <button onClick={addNewContact}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <DataTable filters={filters} setTableInstance={setTableInstance} />
      <ContactModal />
    </main>
  );
}