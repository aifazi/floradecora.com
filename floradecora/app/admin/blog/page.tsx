import { cookies } from "next/headers";
import BlogManager from "@/components/admin/BlogManager";
async function getPosts() {
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend}/api/posts?all=true`, { headers: { cookie: cookies().toString() }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}
export default async function AdminBlog() {
  const posts = await getPosts();
  return <BlogManager initial={posts} />;
}
