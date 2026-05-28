// src/components/ui/use-toast.ts

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
};

export function toast({ title, description, variant = "default", duration = 3000 }: ToastProps) {
  if (typeof window === "undefined") return;

  // Find or create toast container
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0";
    document.body.appendChild(container);
  }

  // Create toast element
  const toastEl = document.createElement("div");
  toastEl.className = `p-4 rounded-xl shadow-lg flex flex-col gap-1 transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto border ${
    variant === "destructive"
      ? "bg-red-600 text-white border-red-500"
      : variant === "success"
      ? "bg-emerald-600 text-white border-emerald-500"
      : "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 border-slate-200 dark:border-slate-800"
  }`;

  if (title) {
    const titleEl = document.createElement("div");
    titleEl.className = "font-semibold text-sm";
    titleEl.innerText = title;
    toastEl.appendChild(titleEl);
  }

  if (description) {
    const descEl = document.createElement("div");
    descEl.className = "text-xs opacity-90";
    descEl.innerText = description;
    toastEl.appendChild(descEl);
  }

  container.appendChild(toastEl);

  // Trigger entering animation
  setTimeout(() => {
    toastEl.classList.remove("translate-y-2", "opacity-0");
  }, 10);

  // Remove toast after duration
  setTimeout(() => {
    toastEl.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => {
      toastEl.remove();
      if (container && container.childElementCount === 0) {
        container.remove();
      }
    }, 300);
  }, duration);
}
