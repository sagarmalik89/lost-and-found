"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Simple Tabs implementation using HTML details/summary for demo purposes
export function Tabs({ defaultValue, className, children }) {
  return (
    <div className={cn("space-y-2", className)}>{children}</div>
  );
}

export function TabsList({ className, children }) {
  return (
    <div className={cn("flex border-b", className)}>{children}</div>
  );
}

export function TabsTrigger({ value, children }) {
  return (
    <button
      type="button"
      className="px-4 py-2 -mb-px border-b border-transparent hover:border-gray-300"
      data-value={value}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }) {
  // In a real app you'd conditionally render based on the selected tab.
  // Here we just render the content directly.
  return <div className="p-4">{children}</div>;
}
