
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="table-glass glass-scrollbar w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm rtl-table", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      "bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-glass border-b border-cyan-500/30 relative",
      "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px",
      "after:bg-gradient-to-r after:from-transparent after:via-cyan-400 after:to-transparent",
      className
    )} 
    {...props} 
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 font-medium relative",
      "before:absolute before:top-0 before:left-0 before:right-0 before:h-px",
      "before:bg-gradient-to-r before:from-transparent before:via-cyan-400/60 before:to-transparent",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-slate-700/30 transition-all duration-300",
      "hover:bg-gradient-to-r hover:from-cyan-500/5 hover:via-transparent hover:to-cyan-500/5",
      "hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]",
      "data-[state=selected]:bg-cyan-500/10 data-[state=selected]:border-cyan-500/40",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-right align-middle font-semibold text-cyan-400 border-b border-cyan-500/20",
      "text-shadow-[0_0_5px_rgba(0,255,255,0.5)] [&:has([role=checkbox])]:pr-0 relative",
      "hover:text-cyan-300 transition-colors duration-200",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle text-right text-slate-200 [&:has([role=checkbox])]:pr-0",
      "transition-colors duration-200 group-hover:text-slate-100",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-slate-400 text-right", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
