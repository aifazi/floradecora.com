import { NextRequest } from "next/server";
import { forwardWebhook } from "@/lib/coolify-relay";

export async function POST(req: NextRequest) {
  return forwardWebhook(req, "/webhooks/source/github/events");
}
