import type React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorWithRetryProps {
  message: string;
  onRetry: () => void;
}

const ErrorWithRetry: React.FC<ErrorWithRetryProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-red-50 border border-red-200 rounded-md">
      <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
      <p className="text-red-700 mb-4">{message}</p>
      <Button onClick={onRetry} variant="outline">
        Retry
      </Button>
    </div>
  );
};

export default ErrorWithRetry;
