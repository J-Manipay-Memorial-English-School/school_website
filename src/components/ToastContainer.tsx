import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { useSchoolData } from '../context/SchoolDataContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useSchoolData();

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon =
            toast.type === 'error'
              ? AlertCircle
              : toast.type === 'info'
              ? Info
              : CheckCircle2;
          const borderAccent =
            toast.type === 'error'
              ? 'border-red-300 dark:border-red-800 text-red-700 dark:text-red-300'
              : toast.type === 'info'
              ? 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200'
              : 'border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-3.5 shadow-lg ${borderAccent}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm font-medium text-stone-800 dark:text-stone-100 flex-1 leading-snug">
                {toast.message}
              </p>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors p-0.5 cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
