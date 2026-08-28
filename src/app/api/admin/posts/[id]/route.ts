import { NextRequest, NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/lib/data/posts";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await getPostById(Number(id));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updatePost(Number(id), {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      featuredImageId: body.featuredImageId,
      categoryId: body.categoryId,
      status: body.status,
      isTrending: body.isTrending,
      isFeatured: body.isFeatured,
      scheduledAt: body.scheduledAt,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      seoKeywords: body.seoKeywords,
      canonicalUrl: body.canonicalUrl,
      ogTitle: body.ogTitle,
      ogDescription: body.ogDescription,
      ogImageId: body.ogImageId,
      tagNames: body.tagNames,
    });

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, post: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update post." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deletePost(Number(id));
  return NextResponse.json({ ok: true });
}
