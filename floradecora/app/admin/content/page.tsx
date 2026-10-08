import ContentEditor from "@/components/admin/ContentEditor";
import { CONTENT_SECTIONS } from "@/lib/content-schema";
import { CONTENT_DEFAULTS } from "@/lib/content-defaults";
import { getContent } from "@/lib/content";

export default async function AdminContent() {
  const initial: Record<string, unknown> = {};
  await Promise.all(
    CONTENT_SECTIONS.map(async (section) => {
      initial[section.key] = await getContent(section.key, CONTENT_DEFAULTS[section.key] ?? {});
    })
  );
  return <ContentEditor initial={initial} />;
}
