"use client";
import { useState, useMemo, useRef, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import { POSTS } from "@/lib/blog";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const results = useMemo(() => {
    if (q.length < 2) return [];
    const lower = q.toLowerCase();
    const projects = PROJECTS.filter((p) => p.title.toLowerCase().includes(lower) || p.type.toLowerCase().includes(lower)).map((p) => ({ href: `/projects/${p.slug}`, label: p.title, type: "Project" }));
    const posts = POSTS.filter((p) => p.title.toLowerCase().includes(lower)).map((p) => ({ href: `/blog/${p.slug}`, label: p.title, type: "Post" }));
    return [...projects, ...posts].slice(0, 6);
  }, [q]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setActive(-1); }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => { setActive(-1); }, [q]);

  function onKeyDown(e: KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) { setOpen(true); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((prev) => { const next = Math.min(prev + 1, results.length - 1); resultRefs.current[next]?.focus(); return next; }); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((prev) => { const next = Math.max(prev - 1, 0); resultRefs.current[next]?.focus(); return next; }); }
    else if (e.key === "Escape") { setOpen(false); setActive(-1); inputRef.current?.focus(); }
    else if (e.key === "Enter" && active >= 0) { resultRefs.current[active]?.click(); }
  }

  return (
    <div ref={ref} className="relative max-w-md w-full">
      <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => { if (results.length > 0) setOpen(true); }} onKeyDown={onKeyDown} placeholder="Search projects, posts..." role="combobox" aria-expanded={open && results.length > 0} aria-controls="search-results" aria-activedescendant={active >= 0 ? `search-option-${active}` : undefined} className="w-full rounded-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-5 py-3 text-sm outline-none focus:border-ochre" />
      {open && results.length > 0 && (
        <div id="search-results" role="listbox" className="absolute top-full mt-2 w-full rounded-2xl bg-white dark:bg-forest border border-black/10 dark:border-white/10 shadow-soft p-2 z-20">
          {results.map((r, i) => (
            <Link key={r.href} id={`search-option-${i}`} href={r.href} ref={(el) => { resultRefs.current[i] = el; }} role="option" aria-selected={active === i} onClick={() => { setQ(""); setOpen(false); }} className={`flex items-center justify-between px-4 py-2 rounded-xl text-sm ${active === i ? "bg-cream dark:bg-white/10" : "hover:bg-cream dark:hover:bg-white/5"}`}>
              <span className="dark:text-white">{r.label}</span><span className="text-xs opacity-50">{r.type}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
