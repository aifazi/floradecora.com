"use client";
import { useState } from "react";

export function CrudModal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[1.6rem] bg-white dark:bg-[#16261C] border border-black/10 dark:border-white/10 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 grid place-items-center">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-ink/60 dark:text-white/60 block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-ochre focus:ring-2 focus:ring-ochre/20 ${props.className || ""}`} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-ochre focus:ring-2 focus:ring-ochre/20 ${props.className || ""}`} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-ochre ${props.className || ""}`} />;
}
