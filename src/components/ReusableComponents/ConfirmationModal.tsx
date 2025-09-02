
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, X, Ban } from "lucide-react";
import type{ ReactNode } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "success" | "danger" | "warning" | "info";
  isLoading?: boolean;
  icon?: ReactNode;
  entityName?: string;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",
  isLoading = false,
  icon,
  entityName
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          iconBg: "bg-green-100 dark:bg-green-900/30",
          iconColor: "text-green-600 dark:text-green-400",
          confirmBg: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
          borderColor: "border-green-500/30"
        };
      case "danger":
        return {
          iconBg: "bg-red-100 dark:bg-red-900/30",
          iconColor: "text-red-600 dark:text-red-400",
          confirmBg: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          borderColor: "border-red-500/30"
        };
      case "warning":
        return {
          iconBg: "bg-orange-100 dark:bg-orange-900/30",
          iconColor: "text-orange-600 dark:text-orange-400",
          confirmBg: "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500",
          borderColor: "border-orange-500/30"
        };
      case "info":
      default:
        return {
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          iconColor: "text-blue-600 dark:text-blue-400",
          confirmBg: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
          borderColor: "border-blue-500/30"
        };
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case "success":
        return <Check size={24} />;
      case "danger":
        return <X size={24} />;
      case "warning":
        return <Ban size={24} />;
      case "info":
      default:
        return <AlertTriangle size={24} />;
    }
  };

  const styles = getTypeStyles();
  const displayIcon = icon || getDefaultIcon();

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCancel}
      >
        <motion.div
          className={`bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full border ${styles.borderColor} shadow-2xl`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon and Title Section */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-full ${styles.iconBg} ${styles.iconColor} shrink-0`}>
              {displayIcon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>{message}</p>
                {entityName && (
                  <p className="mt-2 font-medium text-gray-800 dark:text-gray-200">
                    Name: <span className="text-blue-600 dark:text-blue-400">{entityName}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${styles.confirmBg}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;