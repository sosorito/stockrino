import { NextRequest, NextResponse } from "next/server";
import { updateCategory, deleteCategory } from "@/lib/data/categories";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const category = await updateCategory(Number(id), {
      name: body.name,
      slug: body.slug,
      description: body.description,
    });
    return NextResponse.json({ ok: true, category });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update category." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteCategory(Number(id));
  return NextResponse.json({ ok: true });
}
