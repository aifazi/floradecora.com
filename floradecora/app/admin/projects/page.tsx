import { cookies } from "next/headers";
import ProjectsManager from "@/components/admin/ProjectsManager";

async function getProjects() {
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend}/api/projects`, { headers: { cookie: cookies().toString() }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminProjects() {
  const projects = await getProjects();
  return <ProjectsManager initial={projects} />;
}
