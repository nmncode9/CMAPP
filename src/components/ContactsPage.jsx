import { useState } from "react";
import DataTable from "./DataTable";
import Filters from "./Filters";
import ContactModal from "./ContactModal";
import ExportButtons from "./ExportButtons";

export default function ContactsPage() {

  const [filters, setFilters] = useState({name: "", email: "", phone: "", company: "", type: ""})
  const [tableInstance, setTableInstance] = useState(null);

  
  return (
    <main className="max-w-[1100px] mx-auto">
      <Filters filters={filters} setFilters={setFilters} />
      <ExportButtons table={tableInstance} />
      <DataTable filters={filters} setTableInstance={setTableInstance} />
      <ContactModal />
    </main>
  );
}