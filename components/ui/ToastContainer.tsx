"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToastStore, type Toast } from "@/store/useToastStore";

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((s) => s.dismiss);

  useEffect(() => {
    const t = setTimeout(() => dismiss(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, dismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-strong)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        color: "var(--text-primary)",
        minWidth: "220px",
        maxWidth: "320px",
      }}
    >
      <span className="flex-1 text-sm">{toast.message}</span>
      {toast.undoFn && (
        <button
          onClick={() => {
            toast.undoFn?.();
            dismiss(toast.id);
          }}
          className="text-xs font-bold px-2.5 py-1 rounded-lg shrink-0"
          style={{
            color: "var(--accent-blue)",
            background: "rgba(79,142,247,0.12)",
          }}
        >
          Undo
        </button>
      )}
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div
      className="fixed bottom-24 md:bottom-6 z-[100] flex flex-col items-center gap-2 pointer-events-none"
      style={{ left: 0, right: 0 }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
