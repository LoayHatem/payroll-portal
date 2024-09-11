import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TableLoaderProps {
  rows?: number;
  columns?: number;
}

const TableLoader: React.FC<TableLoaderProps> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex mb-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} className="h-8 w-full mr-2" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex mb-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-12 w-full mr-2"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableLoader;