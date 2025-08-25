import { Button } from "./ui/button";

export default function Filters({filters, setFilters}) {


  function resetFields(e) {
    e.preventDefault();
    setFilters({name: "", email: "", phone: "", company: "", type: ""})
  }
  
  function handleChange(e) {
    const {name, value} = e.target;
    setFilters((prev) => ({...prev, [name]: value}))
  }

  return (
    <form className="w-full flex gap-2 justify-center p-16">
      <input
       type="text"
       name="name"
       placeholder="Name"
       className="border-2 rounded-md pl-3"
       value={filters.name}
       onChange={handleChange} />
      <input
       type="text"
       name="email"
       placeholder="Email"
       className="border-2 rounded-md pl-3"
       value={filters.email}
       onChange={handleChange} />
      <input
       type="text"
       name="phone"
       placeholder="Phone Number"
       className="border-2 rounded-md pl-3"
       value={filters.phone}
       onChange={handleChange} />
      <input
       type="text"
       name="company"
       placeholder="Company"
       className="border-2 rounded-md pl-3"
       value={filters.company}
       onChange={handleChange} />
      <input
       type="text"
       name="type"
       placeholder="Contact type"
       className="border-2 rounded-md pl-3"
       value={filters.type}
       onChange={handleChange} />
      <Button
       onClick={resetFields}
       type="button" >Reset</Button>
    </form>
  )
}