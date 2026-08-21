"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import { POSTS } from "@/lib/blog";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    if (q.length < 2) return [];
    const lower = q.toLowerCase();
    const projects = PROJECTS.filter((p) => p.title.toLowerCase().includes(lower) || p.type.toLowerCase().includes(lower)).map((p) => ({ href: `/projects/${p.slug}`, label: p.title, type: "Project" }));
    const posts = POSTS.filter((p) => p.title.toLowerCase().includes(lower)).map((p) => ({ href: `/blog/${p.slug}`, label: p.title, type: "Post" }));
    return [...projects, ...posts].slice(0, 6);
  }, [q]);
  return (
    <div className="relative max-w-md w-full">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects, posts..." className="w-full rounded-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 px-5 py-3 text-sm outline-none focus:border-ochre" />
      {results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-2xl bg-white dark:bg-forest border border-black/10 dark:border-white/10 shadow-soft p-2 z-20">
          {results.map((r) => (
            <Link key={r.href} href={r.href} onClick={() => setQ("")} className="flex items-center justify-between px-4 py-2 rounded-xl hover:bg-cream dark:hover:bg-white/5 text-sm">
              <span className="dark:text-white">{r.label}</span><span className="text-xs opacity-50">{r.type}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
