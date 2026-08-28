"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type EditModeContextType = {
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  isAdmin: boolean;
  pageKey: string;
};

const EditModeContext = createContext<EditModeContextType | null>(null);

export function EditModeProvider({ children, pageKey = "page_home" }: { children: ReactNode; pageKey?: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (u?.role === "admin") setIsAdmin(true);
      })
      .catch(() => {});
  }, []);

  return (
    <EditModeContext.Provider value={{ isEditing, setIsEditing, isAdmin, pageKey }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const ctx = useContext(EditModeContext);
  if (!ctx) throw new Error("useEditMode must be inside EditModeProvider");
  return ctx;
}