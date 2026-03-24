import { useToast } from "@/hooks/use-toast.js";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast.jsx";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts } = useToast();

  const variantIconMap = {
    default: { Icon: Sparkles, className: "bg-slate-900/10 text-slate-700" },
    success: { Icon: CheckCircle2, className: "bg-emerald-600/15 text-emerald-700" },
    warning: { Icon: AlertTriangle, className: "bg-amber-600/15 text-amber-700" },
    info: { Icon: Info, className: "bg-blue-600/15 text-blue-700" },
    destructive: { Icon: XCircle, className: "bg-red-600/15 text-red-700" },
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const variant = props.variant || "default";
        const { Icon, className } =
          variantIconMap[variant] || variantIconMap.default;

        return (
          <Toast key={id} {...props}>
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-0.5 flex h-9 w-9 items-center justify-center rounded-full",
                  className,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
