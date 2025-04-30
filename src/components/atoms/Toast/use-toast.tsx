import { toast as showToast } from "@/components/ui/use-toast";

interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export const toast = ({ title, description, variant = 'default' }: ToastProps) => {
  showToast({
    variant,
    title,
    description,
  });
}; 