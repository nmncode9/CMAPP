import { useState } from "react";
import DataTable from "./DataTable";
import Filters from "./Filters";
import ContactModal from "./ContactModal";

export default function ContactsPage() {

  const [filters, setFilters] = useState({name: "", email: "", phone: "", company: "", type: ""})

  return (
    <main className="max-w-[1100px] mx-auto">
      <Filters filters={filters} setFilters={setFilters}/>
      <DataTable filters={filters} />
      <ContactModal />
    </main>
  )
}