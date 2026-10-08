import { NextRequest } from "next/server";
import { bounceToCoolify } from "@/lib/coolify-relay";

export async function GET(req: NextRequest) {
  return bounceToCoolify(req);
}
