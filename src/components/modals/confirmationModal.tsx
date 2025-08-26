import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import type { ReactNode } from "react";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alter-dialog";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
//   confirmVariant?: "default" | "destructive"; // optional
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationModal = ({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
//   confirmVariant = "default",
  onConfirm,
  onClose,
}: ConfirmationModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            // className={`${
            //   confirmVariant === "destructive"
            //     ? "bg-red-600 hover:bg-red-700"
            //     : ""
            // }`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
