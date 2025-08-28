import { useState } from "react";
import DataTable from "./DataTable";
import Filters from "./Filters";
import ContactModal from "./ContactModal";
import ExportButtons from "./ExportButtons";
import AddContactSelect from "./AddContactSelect";
import ScrollControls from "./ScrollControls";
import UndoRedo from "./UndoRedo";

export default function ContactsPage() {

  const [filters, setFilters] = useState({name: "", email: "", phone: "", company: "", type: ""})
  const [tableInstance, setTableInstance] = useState(null);



  
  return (
    <main className="max-w-[1100px] mx-auto ">
      <Filters filters={filters} setFilters={setFilters} />
      <div className="flex justify-between">
        <ExportButtons table={tableInstance} />
        <div className="flex space-x-2 items-stretch">
          <AddContactSelect />
          <UndoRedo />
        </div>
      </div>
      <DataTable filters={filters} setTableInstance={setTableInstance} />
      <div className="fixed right-6 bottom-6 flex flex-col gap-2">
        <ScrollControls />
      </div>
      <ContactModal className="h-[80vh] overflow-y-scroll"/>
    </main>
  );
}