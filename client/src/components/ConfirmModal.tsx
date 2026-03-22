import { AlertCircle } from "lucide-react";

export function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={22} className="text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white text-center mb-1">
            Delete Ticket
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            {message}
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-sm text-sm font-semibold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-sm text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm shadow-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}