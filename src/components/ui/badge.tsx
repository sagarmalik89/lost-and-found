import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "success" | "outline";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    default: "border-transparent bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100",
    destructive: "border-transparent bg-rose-600 text-white hover:bg-rose-700",
    success: "border-transparent bg-emerald-600 text-white hover:bg-emerald-700",
    outline: "text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
}

export default Badge;
