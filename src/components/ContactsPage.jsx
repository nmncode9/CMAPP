import { useState } from "react";
import DataTable from "./DataTable";
import Filters from "./Filters";

export default function ContactsPage() {

  const [filters, setFilters] = useState({name: "", email: "", phone: "", company: "", type: ""})

  return (
    <main className="max-w-[1100px] mx-auto">
      <Filters filters={filters} setFilters={setFilters}/>
      <DataTable filters={filters} />
    </main>
  )
}