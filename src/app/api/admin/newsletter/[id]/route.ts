import { NextRequest, NextResponse } from "next/server";
import { deleteSubscriber } from "@/lib/data/newsletter";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteSubscriber(Number(id));
  return NextResponse.json({ ok: true });
}
