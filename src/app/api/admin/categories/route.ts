import { NextRequest, NextResponse } from "next/server";
import { getAllCategories, createCategory } from "@/lib/data/categories";

export async function GET() {
  const categories = await getAllCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }
    const category = await createCategory({
      name: body.name,
      slug: body.slug,
      description: body.description,
    });
    return NextResponse.json({ ok: true, category });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create category." }, { status: 500 });
  }
}
