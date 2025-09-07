
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-6 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              className="h-8 flex-1" 
              style={{ 
                animationDelay: `${(rowIndex * columns + colIndex) * 100}ms` 
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface ChartSkeletonProps {
  height?: string;
  showLegend?: boolean;
}

export function ChartSkeleton({ height = "h-64", showLegend = true }: ChartSkeletonProps) {
  return (
    <div className="space-y-4">
      {showLegend && (
        <div className="flex space-x-4 justify-center">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="w-16 h-4" />
            </div>
          ))}
        </div>
      )}
      
      <div className={cn("relative", height)}>
        {/* Chart area with shimmer */}
        <Skeleton className="w-full h-full rounded-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </Skeleton>
        
        {/* Axis lines */}
        <div className="absolute bottom-4 left-4 right-4 h-px bg-border" />
        <div className="absolute top-4 bottom-4 left-4 w-px bg-border" />
      </div>
    </div>
  );
}

interface CardSkeletonProps {
  showHeader?: boolean;
  lines?: number;
}

export function CardSkeleton({ showHeader = true, lines = 3 }: CardSkeletonProps) {
  return (
    <div className="border rounded-lg p-6 space-y-4 shimmer-card">
      {showHeader && (
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className="h-4" 
            style={{ 
              width: `${Math.random() * 40 + 60}%`,
              animationDelay: `${i * 150}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      
      <div className="flex space-x-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} showHeader={false} lines={2} />
        ))}
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton showLegend={false} />
      </div>
      
      {/* Table */}
      <TableSkeleton rows={8} columns={5} />
    </div>
  );
}
