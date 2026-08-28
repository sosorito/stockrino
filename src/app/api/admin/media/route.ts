import { NextRequest, NextResponse } from "next/server";
import { getAllMedia } from "@/lib/data/media";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search") || undefined;
  const media = await getAllMedia(search);
  return NextResponse.json({ media });
}
