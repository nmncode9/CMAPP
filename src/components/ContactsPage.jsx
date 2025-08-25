import { useState } from "react";
import DataTable from "./DataTable";
import Filters from "./Filters";

export default function ContactsPage() {

  const [filters, setFilters] = useState({name: "", email: "", phone: "", company: "", type: ""})

  return (
    <main>
      <Filters filters={filters} setFilters={setFilters}/>
      <DataTable filters={filters} />
    </main>
  )
}