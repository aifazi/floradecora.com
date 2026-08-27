import { cookies } from "next/headers";
import MediaManager from "@/components/admin/MediaManager";

async function getMedia() {
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend}/api/media`, { headers: { cookie: cookies().toString() }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminMedia() {
  const media = await getMedia();
  return <MediaManager initial={media} />;
}
