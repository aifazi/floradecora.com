import { notFound } from "next/navigation";
import { EditModeProvider } from "@/components/editor/EditModeContext";
import EditBar from "@/components/editor/EditBar";
import EditableText from "@/components/editor/EditableText";

async function getPage(slug: string) {
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  try {
    const res = await fetch(`${backend}/api/pages/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  if (!page) return { title: "Page not found" };
  return { title: `${page.title} | Flora Decora` };
}

export default async function GenericPage({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);
  if (!page || !page.published) return notFound();

  const blocks = Array.isArray(page.blocks) ? page.blocks : [];

  return (
    <EditModeProvider pageKey={`page_${params.slug}`}>
      <EditBar />
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-16">
        <EditableText field="title" as="h1" className="font-display text-4xl md:text-5xl">
          {page.title}
        </EditableText>
        <div className="mt-8 space-y-6">
          {blocks.map((b: any, i: number) => (
            <div key={i} className="rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 p-6">
              <div className="text-xs font-mono text-ink/40">{b.type}</div>
              <EditableText field={`blocks.${i}.data`} as="div" className="mt-2">
                {typeof b.data === "string" ? b.data : JSON.stringify(b.data, null, 2)}
              </EditableText>
            </div>
          ))}
        </div>
      </div>
    </EditModeProvider>
  );
}