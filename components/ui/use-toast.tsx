// This is a simplified version of the use-toast hook
import { useState, useCallback } from "react";

type ToastProps = {
  title: string;
  description?: string;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = useCallback(({ title, description }: ToastProps) => {
    setToasts((currentToasts) => [...currentToasts, { title, description }]);
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.slice(1));
    }, 3000);
  }, []);

  return { toast, toasts };
}
