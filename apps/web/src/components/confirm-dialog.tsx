import { cn } from "@servexa-warranty-ai/ui/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@servexa-warranty-ai/ui/components/alert-dialog";
import { Button } from "@servexa-warranty-ai/ui/components/button";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  disabled?: boolean;
  desc: React.JSX.Element | string;
  cancelBtnText?: string;
  confirmText?: React.ReactNode;
  destructive?: boolean;
  handleConfirm: () => void;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function ConfirmDialog(props: ConfirmDialogProps) {
  const {
    title,
    desc,
    children,
    className,
    confirmText,
    cancelBtnText,
    destructive,
    isLoading,
    disabled = false,
    handleConfirm,
    ...actions
  } = props;
  return (
    <AlertDialog {...actions}>
      <AlertDialogContent className={cn(
        "sm:rounded-[calc(var(--radius)+12px)] ring-1 ring-border/10 shadow-2xl overflow-hidden",
        className
      )}>
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle className="text-lg font-semibold tracking-tight">{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-[14px] font-medium text-muted-foreground leading-relaxed mt-1.5">{desc}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelBtnText ?? "Cancel"}
          </AlertDialogCancel>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={disabled || isLoading}
          >
            {confirmText ?? "Continue"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
