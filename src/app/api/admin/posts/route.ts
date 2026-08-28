import { NextRequest, NextResponse } from "next/server";
import { createPost, getAllPostsAdmin } from "@/lib/data/posts";
import { getSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const result = await getAllPostsAdmin({
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 15,
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status") || undefined,
    categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
  });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    const post = await createPost({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      featuredImageId: body.featuredImageId ?? null,
      categoryId: body.categoryId ?? null,
      authorId: session?.userId ?? null,
      status: body.status || "draft",
      isTrending: !!body.isTrending,
      isFeatured: !!body.isFeatured,
      scheduledAt: body.scheduledAt || null,
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      seoKeywords: body.seoKeywords,
      canonicalUrl: body.canonicalUrl,
      ogTitle: body.ogTitle,
      ogDescription: body.ogDescription,
      ogImageId: body.ogImageId ?? null,
      tagNames: body.tagNames || [],
    });

    return NextResponse.json({ ok: true, post });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create post." }, { status: 500 });
  }
}
