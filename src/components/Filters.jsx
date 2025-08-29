import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Filters({ filters, setFilters }) {

  function resetFields(e) {
    e.preventDefault();
    setFilters({ name: "", email: "", phone: "", company: "", type: "" });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="my-16 w-full">
      <form className="sm:justify-center md:mx-auto w-full flex md:justify-between flex-wrap gap-2">
        <Input
          type="text"
          name="name"
          placeholder="Name"
          aria-label="Filter by name"
          value={filters.name}
          onChange={handleChange}
          className="flex-1 min-w-[150px]"
        />
        <Input
          type="text"
          name="email"
          placeholder="Email"
          aria-label="Filter by email"
          value={filters.email}
          onChange={handleChange}
          className="flex-1 min-w-[150px]"
        />
        <Input
          type="text"
          name="phone"
          placeholder="Phone Number"
          aria-label="Filter by phone number"
          value={filters.phone}
          onChange={handleChange}
          className="flex-1 min-w-[150px]"
        />
        <Input
          type="text"
          name="company"
          placeholder="Company"
          aria-label="Filter by company"
          value={filters.company}
          onChange={handleChange}
          className="flex-1 min-w-[150px]"
        />
        <Input
          type="text"
          name="type"
          placeholder="Contact type"
          aria-label="Filter by contact type"
          value={filters.type}
          onChange={handleChange}
          className="flex-1 min-w-[150px]"
        />
      </form>

      <Button
        onClick={resetFields}
        className="mt-4"
        type="button"
      >
        Reset
      </Button>
    </div>
  );
}
