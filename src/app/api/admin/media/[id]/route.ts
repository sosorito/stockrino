import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { updateMedia, deleteMedia, getMediaById } from "@/lib/data/media";

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
  if (media && media.url.includes(".public.blob.vercel-storage.com")) {
    // best-effort: remove the underlying file from Blob storage
    await del(media.url).catch(() => {});
  }
  await deleteMedia(Number(id));
  return NextResponse.json({ ok: true });
}
