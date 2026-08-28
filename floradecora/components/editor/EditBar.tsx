"use client";
import { useEditMode } from "./EditModeContext";
import { useState } from "react";

export default function EditBar() {
  const { isEditing, setIsEditing, isAdmin } = useEditMode();
  const [saving, setSaving] = useState(false);

  if (!isAdmin) return null;

  const handleSave = async () => {
    setSaving(true);
    // Dispatch save event for Editable components to persist
    window.dispatchEvent(new CustomEvent("flora:save"));
    // Give components 800ms to save, then exit edit mode
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
    }, 900);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] flex justify-center pointer-events-none">
      <div className="mt-3 pointer-events-auto flex items-center gap-2 rounded-full bg-white dark:bg-[#16261C] border border-black/10 dark:border-white/10 shadow-soft px-2 py-1.5">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-full bg-ochre text-white px-5 py-2 text-xs font-semibold tracking-[0.14em] uppercase hover:bg-ochre-light transition-colors"
          >
            ✎ Edit page
          </button>
        ) : (
          <>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-700">Editing</span>
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-full bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 px-4 py-2 text-xs font-medium hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-ochre text-white px-5 py-2 text-xs font-semibold hover:bg-ochre-light disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </>
        )}
        <span className="hidden sm:inline text-[10px] text-ink/40 dark:text-white/40 px-2">Odoo-style • Click text or image to edit</span>
      </div>
    </div>
  );
}