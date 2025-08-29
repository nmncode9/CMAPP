import PaginationRange from "./PaginationRange";
import { Button } from "./ui/button";

export default function PaginationControls({ table, totalRows }) {
  const { pagination } = table.getState();

  return (
    <div className="flex flex-col-reverse md:flex-row justify-end md:justify-between items-start md:items-center gap-2 px-0 sm:px-10 pt-8 pb-16">
      {/* Rows per page selector */}
      <div className="flex items-center space-x-2">
        <span>Rows per page:</span>
        <select
          value={pagination.pageSize}
          onChange={(e) => {
            const value = e.target.value;
            table.setPageSize(value === "all" ? totalRows : Number(value));
            table.setPageIndex(0);
          }}
          className="border rounded p-1"
        >
          {[20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
          <option value="all">Show all</option>
        </select>
      </div>

      {/* Pagination buttons and range */}
      <div className="flex items-baseline justify-end flex-wrap gap-2">
        <PaginationRange
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          total={totalRows}
          className="mr-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          Last
        </Button>
      </div>
    </div>
  );
}
