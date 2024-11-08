// src/components/ToastContainer.js

import { Alert } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-5 right-5 space-y-2">
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          variant={toast.variant}
          className="w-96"
          icon={toast.variant === "success" ? <CheckCircle2 /> : <AlertCircle />}
        >
          <div>
            <strong>{toast.title}</strong>
            <p>{toast.description}</p>
          </div>
        </Alert>
      ))}
    </div>
  );
}
