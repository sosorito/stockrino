export interface PostCardData {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: string | null;
  createdAt: string;
  status: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  viewCount?: number;
  category: { id: number; name: string; slug: string } | null;
  featuredImage: { url: string; altText: string | null } | null;
  author?: { name: string } | null;
  tags?: { id: number; name: string; slug: string }[];
}
