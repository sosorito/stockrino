import Link from "next/link";
import Image from "next/image";
import { getFeaturedPosts, getLatestPosts, getTrendingPosts } from "@/lib/data/posts";
import { getAllCategories } from "@/lib/data/categories";
import { getSettings } from "@/lib/data/settings";
import { ArticleCard } from "@/components/site/article-card";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { formatDate } from "@/lib/utils";
import {
  ArrowRight,
  TrendingUp,
  Newspaper,
  LineChart,
  Building2,
  BarChart3,
  Landmark,
  Cpu,
  Bitcoin,
  Briefcase,
} from "lucide-react";

export const revalidate = 60;

const CATEGORY_ICONS: Record<string, any> = {
  "stock-market-news": Newspaper,
  "wall-street": Building2,
  "sp-500": BarChart3,
  nasdaq: Cpu,
  "dow-jones": LineChart,
  "company-news": Briefcase,
  earnings: TrendingUp,
  "federal-reserve": Landmark,
  "market-analysis": BarChart3,
  "technology-stocks": Cpu,
  cryptocurrency: Bitcoin,
};

export default async function HomePage() {
  const [featured, latest, trending, categories, settings] = await Promise.all([
    getFeaturedPosts(4),
    getLatestPosts(9),
    getTrendingPosts(5),
    getAllCategories(),
    getSettings(),
  ]);

  const hero = featured[0];
  const heroSide = featured.slice(1, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-navy-950 to-navy-900">
        <div className="container-page py-10 sm:py-14">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-gold-400 text-xs font-bold tracking-widest uppercase">
              Breaking Market Coverage
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {hero && (
              <Link
                href={`/blog/${hero.slug}`}
                className="group relative lg:col-span-2 overflow-hidden rounded-2xl block"
              >
                <div className="relative aspect-[16/9] sm:aspect-[16/8]">
                  <Image
                    src={hero.featuredImage?.url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1400&q=80"}
                    alt={hero.featuredImage?.altText || hero.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  {hero.category && (
                    <span className="inline-block rounded-full bg-gold-500 text-navy-950 text-xs font-bold px-3 py-1 mb-3">
                      {hero.category.name}
                    </span>
                  )}
                  <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight max-w-2xl group-hover:text-gold-300 transition-colors">
                    {hero.title}
                  </h1>
                  <p className="text-navy-200 mt-3 max-w-xl hidden sm:block line-clamp-2">
                    {hero.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 mt-4 text-gold-400 font-semibold text-sm">
                    Read Full Story <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            )}

            <div className="flex flex-col gap-4">
              {heroSide.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-3 bg-white/5 hover:bg-white/10 rounded-xl p-3 transition-colors"
                >
                  <div className="relative h-16 w-24 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={post.featuredImage?.url || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80"}
                      alt={post.featuredImage?.altText || post.title}
                      fill
                      sizes="120px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0">
                    {post.category && (
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-gold-400">
                        {post.category.name}
                      </span>
                    )}
                    <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-gold-300 transition-colors">
                      {post.title}
                    </h3>
                    <span className="text-navy-400 text-xs">
                      {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News + Trending Sidebar */}
      <section className="container-page py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
                <Newspaper size={22} className="text-gold-500" />
                Latest News
              </h2>
              <Link
                href="/blog"
                className="text-sm font-semibold text-gold-600 dark:text-gold-400 hover:underline flex items-center gap-1"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {latest.map((post) => (
                <ArticleCard key={post.id} post={post as any} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2 mb-6">
              <TrendingUp size={22} className="text-gold-500" />
              Trending Now
            </h2>
            <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-5 shadow-card">
              {trending.map((post, idx) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group flex gap-3">
                  <span className="text-2xl font-extrabold text-border w-7 shrink-0 group-hover:text-gold-500 transition-colors">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    {post.category && (
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-gold-600 dark:text-gold-400">
                        {post.category.name}
                      </span>
                    )}
                    <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                      {post.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 p-6 text-center">
              <p className="text-white font-bold mb-1">Never Miss a Market Move</p>
              <p className="text-navy-300 text-sm mb-4">
                Daily insights straight to your inbox.
              </p>
              <NewsletterForm variant="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-surface border-y border-border py-12">
        <div className="container-page">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-6">Explore Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug] || Newspaper;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center text-center gap-2.5 rounded-xl border border-border bg-background p-5 hover:border-gold-400 hover:shadow-card transition-all"
                >
                  <span className="flex items-center justify-center h-11 w-11 rounded-full bg-navy-900 text-gold-400 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                    <Icon size={20} />
                  </span>
                  <span className="text-sm font-semibold">{cat.name}</span>
                  <span className="text-xs text-muted">{cat.postCount} articles</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles (premium layout) */}
      {featured.length > 0 && (
        <section className="container-page py-12">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.slice(0, 4).map((post) => (
              <ArticleCard key={post.id} post={post as any} variant="featured" />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA band */}
      <section className="bg-navy-950 py-14">
        <div className="container-page flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Stay Ahead of the Market
          </h2>
          <p className="text-navy-300 max-w-xl mb-6">
            Join thousands of investors who start their day with {settings.siteName}&apos;s
            free daily briefing on the U.S. stock market.
          </p>
          <NewsletterForm variant="dark" />
        </div>
      </section>
    </div>
  );
}
