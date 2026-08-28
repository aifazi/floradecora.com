"use client";
import { useEditMode } from "./EditModeContext";
import { useEffect, useRef, useState } from "react";

type Props = {
  field: string; // e.g. "hero.title"
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  children: string;
  multiline?: boolean;
};

export default function EditableText({ field, as: Tag = "div", className, children, multiline }: Props) {
  const { isEditing, pageKey } = useEditMode();
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState(children);

  useEffect(() => setValue(children), [children]);

  useEffect(() => {
    if (!isEditing) return;
    const handler = async () => {
      const el = ref.current;
      const newValue = el?.innerText ?? value;
      if (newValue === children) return;
      try {
        // Load existing page JSON, merge field, save via SiteSetting
        const res = await fetch(`/api/settings/${pageKey}`, { cache: "no-store" });
        const existing = res.ok ? (await res.json()).value : {};
        const keys = field.split(".");
        let obj = { ...existing };
        let cur: any = obj;
        for (let i = 0; i < keys.length - 1; i++) {
          cur[keys[i]] = cur[keys[i]] || {};
          cur = cur[keys[i]];
        }
        cur[keys[keys.length - 1]] = newValue;
        await fetch(`/api/settings/${pageKey}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: obj }),
        });
        setValue(newValue);
      } catch {}
    };
    window.addEventListener("flora:save", handler as EventListener);
    return () => window.removeEventListener("flora:save", handler as EventListener);
  }, [isEditing, field, pageKey, children, value]);

  if (!isEditing) {
    // @ts-ignore
    return <Tag className={className}>{value}</Tag>;
  }

  // @ts-ignore
  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => setValue((e.target as HTMLElement).innerText)}
      className={`${className || ""} outline-none ring-2 ring-ochre/30 rounded-lg px-1 -mx-1 focus:ring-ochre bg-ochre/5 dark:bg-ochre/10 cursor-text`}
      data-field={field}
    >
      {value}
    </Tag>
  );
}