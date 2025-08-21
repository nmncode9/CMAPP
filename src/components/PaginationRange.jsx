import React from "react";

export default function PaginationRange({ pageIndex, pageSize, total }) {
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <p className="text-sm text-muted-foreground mt-2">
      Showing {start}-{end} of {total}
    </p>
  );
}