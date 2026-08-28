import { NextRequest, NextResponse } from "next/server";
import { updateMedia, deleteMedia, getMediaById } from "@/lib/data/media";
import fs from "fs/promises";
import path from "path";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const updated = await updateMedia(Number(id), {
    title: body.title,
    altText: body.altText,
    caption: body.caption,
  });
  return NextResponse.json({ ok: true, media: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const media = await getMediaById(Number(id));
  if (media) {
    const filePath = path.join(process.cwd(), "public", media.url);
    fs.unlink(filePath).catch(() => {});
  }
  await deleteMedia(Number(id));
  return NextResponse.json({ ok: true });
}
