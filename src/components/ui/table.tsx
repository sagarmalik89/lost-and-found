import React from "react";

export function Table({ className = "", ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className={`w-full caption-bottom text-sm ${className}`} {...props} />
    </div>
  );
}

export function TableHeader({ className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 ${className}`} {...props} />;
}

export function TableBody({ className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`divide-y divide-slate-200 dark:divide-slate-800 ${className}`} {...props} />;
}

export function TableFooter({ className = "", ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot className={`bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 font-medium ${className}`} {...props} />;
}

export function TableRow({ className = "", ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800 ${className}`}
      {...props}
    />
  );
}

export function TableHead({ className = "", ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400 [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
}

export function TableCell({ className = "", ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 text-slate-700 dark:text-slate-300 ${className}`}
      {...props}
    />
  );
}
