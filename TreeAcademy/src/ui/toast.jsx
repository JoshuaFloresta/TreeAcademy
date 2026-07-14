import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = React.forwardRef(({ className, ...props }, ref) => <ToastPrimitive.Viewport ref={ref} className={cn("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className)} {...props} />);
const Toast = React.forwardRef(({ className, variant, ...props }, ref) => <ToastPrimitive.Root ref={ref} className={cn("group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out", variant === "destructive" ? "border-destructive bg-destructive text-destructive-foreground" : "bg-background text-foreground", className)} {...props} />);
const ToastTitle = React.forwardRef(({ className, ...props }, ref) => <ToastPrimitive.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />);
const ToastDescription = React.forwardRef(({ className, ...props }, ref) => <ToastPrimitive.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />);
const ToastClose = React.forwardRef(({ className, ...props }, ref) => <ToastPrimitive.Close ref={ref} className={cn("absolute right-2 top-2 rounded-md p-1 opacity-60 hover:opacity-100", className)} {...props}><X className="h-4 w-4" /></ToastPrimitive.Close>);
const ToastAction = React.forwardRef(({ className, ...props }, ref) => <ToastPrimitive.Action ref={ref} className={cn("inline-flex h-8 items-center rounded-md border px-3 text-sm font-medium", className)} {...props} />);

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction };
