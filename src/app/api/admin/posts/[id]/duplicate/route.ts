import { NextRequest, NextResponse } from "next/server";
import { duplicatePost } from "@/lib/data/posts";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await duplicatePost(Number(id));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, post });
}
