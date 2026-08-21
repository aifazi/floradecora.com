"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Project, ProjectType } from "@/lib/projects";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import HoverBloom from "@/components/HoverBloom";

const TYPES: (ProjectType | "All")[] = ["All", "Photo", "AI Render", "Site Plan"];

export default function ProjectFilter({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectType | "All">("All");
  const filtered = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.type === filter)), [filter, projects]);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-5 py-2 text-sm font-medium border transition-all ${filter === t ? "bg-ink text-white border-ink dark:bg-white dark:text-ink" : "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-ink/20"}`}
          >
            {t} {t !== "All" && <span className="opacity-50 text-xs">({projects.filter((p) => p.type === t).length})</span>}
          </button>
        ))}
      </div>
      <Stagger className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <StaggerItem key={p.slug} className="group">
            <Link href={`/projects/${p.slug}`}>
              <HoverBloom className="rounded-[1.6rem] bg-white dark:bg-white/5 p-2 shadow-card hover:shadow-glow border border-black/5 dark:border-white/10 h-full">
                <div className="relative aspect-[4/3] rounded-[1.2rem] overflow-hidden bg-ink">
                  <Image src={p.img} alt={p.title} fill className="object-cover group-hover:scale-[1.06] transition-transform duration-700" sizes="380px" quality={70} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium">{p.type}</span>
                  <span className="absolute top-3 right-3 rounded-full bg-forest/90 backdrop-blur px-3 py-1 text-xs font-medium text-white">{p.year}</span>
                  <span className="absolute bottom-3 left-3 text-white/90 text-xs tracking-wide bg-black/30 backdrop-blur px-2 py-1 rounded-full">{p.location}</span>
                </div>
                <div className="px-3 py-4">
                  <h3 className="font-display text-[15px] leading-tight dark:text-white">{p.title}</h3>
                  <p className="text-xs text-ink/50 dark:text-white/50 mt-1">{p.area} • {p.client}</p>
                  <span className="mt-3 inline-flex text-xs text-ochre-dark dark:text-ochre-light gap-1 group-hover:gap-2 transition-all">View case study →</span>
                </div>
              </HoverBloom>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
      {filtered.length === 0 && <p className="mt-8 text-center text-ink/50">No projects in this category.</p>}
    </>
  );
}
