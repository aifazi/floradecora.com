"use client";
import { useEditMode } from "./EditModeContext";
import { useEffect, useRef, useState } from "react";
import { queueChange } from "./pending";

type Props = {
  field: string; // e.g. "hero.title"
  settingsKey?: string; // override the page's settings key (e.g. "site_footer")
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  children: string;
  multiline?: boolean;
};

export default function EditableText({ field, settingsKey, as: Tag = "div", className, children, multiline }: Props) {
  const { isEditing, pageKey } = useEditMode();
  const key = settingsKey || pageKey;
  const ref = useRef<HTMLElement>(null);
  const [value, setValue] = useState(children);

  useEffect(() => setValue(children), [children]);

  useEffect(() => {
    if (!isEditing) return;
    const handler = () => {
      const el = ref.current;
      const newValue = el?.innerText ?? value;
      if (newValue === children) return;
      queueChange(key, field, newValue);
      setValue(newValue);
    };
    window.addEventListener("flora:save", handler as EventListener);
    return () => window.removeEventListener("flora:save", handler as EventListener);
  }, [isEditing, field, key, children, value]);

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
