"use client";
import { useEditMode } from "./EditModeContext";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  field: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
};

export default function EditableImage({ field, src, alt, width, height, fill, className, sizes }: Props) {
  const { isEditing, pageKey } = useEditMode();
  const [url, setUrl] = useState(src);
  const [showPicker, setShowPicker] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => setUrl(src), [src]);

  useEffect(() => {
    if (!isEditing) return;
    const handler = async () => {
      if (url === src) return;
      try {
        const res = await fetch(`/api/settings/${pageKey}`, { cache: "no-store" });
        const existing = res.ok ? (await res.json()).value : {};
        const keys = field.split(".");
        let obj = { ...existing };
        let cur: any = obj;
        for (let i = 0; i < keys.length - 1; i++) {
          cur[keys[i]] = cur[keys[i]] || {};
          cur = cur[keys[i]];
        }
        cur[keys[keys.length - 1]] = url;
        await fetch(`/api/settings/${pageKey}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: obj }),
        });
      } catch {}
    };
    window.addEventListener("flora:save", handler as EventListener);
    return () => window.removeEventListener("flora:save", handler as EventListener);
  }, [isEditing, field, pageKey, src, url]);

  if (!isEditing) {
    if (fill) return <Image src={url} alt={alt} fill className={className} sizes={sizes} />;
    return <Image src={url} alt={alt} width={width!} height={height!} className={className} sizes={sizes} />;
  }

  return (
    <div className="relative group cursor-pointer" onClick={() => setShowPicker(true)}>
      {fill ? <Image src={url} alt={alt} fill className={`${className || ""} ring-2 ring-ochre/30`} sizes={sizes} /> : <Image src={url} alt={alt} width={width!} height={height!} className={`${className || ""} ring-2 ring-ochre/30 rounded-lg`} sizes={sizes} />}
      <div className="absolute inset-0 bg-ochre/10 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
        <span className="bg-white text-ink text-xs px-3 py-1 rounded-full shadow">✎ Change image</span>
      </div>
      {showPicker && (
        <div className="absolute inset-0 z-10 bg-white dark:bg-[#16261C] border border-black/10 dark:border-white/10 rounded-xl p-3 shadow-soft flex flex-col gap-2">
          <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="Paste image URL or /media key" className="w-full rounded-full bg-[#F8F6F0] dark:bg-white/5 border border-black/5 dark:border-white/10 px-3 py-2 text-xs outline-none focus:border-ochre" />
          <div className="flex gap-2">
            <button onClick={() => { if (newUrl) setUrl(newUrl); setShowPicker(false); }} className="flex-1 rounded-full bg-ochre text-white py-2 text-xs font-semibold">Use URL</button>
            <button onClick={() => setShowPicker(false)} className="flex-1 rounded-full bg-white dark:bg-white/10 border border-black/5 dark:border-white/10 py-2 text-xs">Cancel</button>
          </div>
          <a href="/admin/media" target="_blank" className="text-xs text-ochre underline text-center">Open Media Manager ↗</a>
        </div>
      )}
    </div>
  );
}