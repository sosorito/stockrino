/* eslint-disable no-console */
import { db, sqlite } from "../src/db";
import {
  adminUsers,
  categories,
  posts,
  tags,
  postTags,
  media,
  settings,
} from "../src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { slugify, makeExcerpt } from "../src/lib/utils";

const DEFAULT_CATEGORIES = [
  { name: "Stock Market News", description: "Daily headlines and breaking updates from across the U.S. stock market." },
  { name: "Wall Street", description: "News and analysis from Wall Street's biggest banks, funds, and traders." },
  { name: "S&P 500", description: "Coverage of the S&P 500 index, its constituents, and index-level trends." },
  { name: "Nasdaq", description: "Nasdaq Composite and Nasdaq-100 news, tech-heavy market coverage." },
  { name: "Dow Jones", description: "Dow Jones Industrial Average moves and blue-chip stock coverage." },
  { name: "Company News", description: "Corporate news, leadership changes, and business developments." },
  { name: "Earnings", description: "Quarterly earnings reports, guidance, and analyst reactions." },
  { name: "Federal Reserve", description: "Federal Reserve policy, interest rate decisions, and Fed commentary." },
  { name: "Market Analysis", description: "In-depth analysis, technical charts, and market outlooks." },
  { name: "Technology Stocks", description: "News on major technology and growth stocks." },
  { name: "Cryptocurrency", description: "Bitcoin, Ethereum, and broader crypto market updates." },
];

// A stock-market-themed royalty-free-style image pool (Unsplash source, safe for demo use)
const IMAGES = [
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80",
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80",
  "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=80",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
  "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&q=80",
  "https://images.unsplash.com/photo-1508385082359-f38ae991e8f2?w=1200&q=80",
  "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&q=80",
  "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=1200&q=80",
  "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=1200&q=80",
  "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&q=80",
];

interface DemoPost {
  title: string;
  category: string;
  tags: string[];
  image: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  content: string;
}

const paragraphs = (arr: string[]) => arr.map((p) => `<p>${p}</p>`).join("\n");

const DEMO_POSTS: DemoPost[] = [
  {
    title: "S&P 500 Closes at Record High as Tech and Financial Stocks Rally",
    category: "S&P 500",
    tags: ["S&P 500", "Wall Street", "Markets"],
    image: IMAGES[0],
    isFeatured: true,
    isTrending: true,
    content: paragraphs([
      "The S&P 500 climbed to a fresh record close on Thursday, powered by broad-based gains in technology and financial shares as investors grew more confident that the Federal Reserve is nearing the end of its tightening cycle.",
      "The benchmark index rose 1.2% to close at a new all-time high, with all eleven sectors finishing in positive territory. Trading volume was above the 20-day average, suggesting conviction behind the move rather than a low-volume drift higher.",
      "\"This is a broad rally, not just a handful of mega-cap names doing the heavy lifting,\" said one market strategist. \"When you see financials, industrials, and tech all participating, that's typically a healthier signal for the market.\"",
      "Bank stocks led the charge after several regional lenders posted better-than-expected net interest margins, easing concerns about credit quality heading into the back half of the year. Meanwhile, semiconductor names extended their year-to-date gains on continued optimism around AI-related capital spending.",
      "Looking ahead, traders will be watching next week's inflation data closely, as another soft reading could reinforce the case for a more dovish path from policymakers.",
    ]),
  },
  {
    title: "Dow Jones Industrial Average Gains 300 Points on Strong Retail Earnings",
    category: "Dow Jones",
    tags: ["Dow Jones", "Retail", "Earnings"],
    image: IMAGES[1],
    isFeatured: true,
    content: paragraphs([
      "The Dow Jones Industrial Average advanced roughly 300 points, or about 0.8%, on Wednesday after a wave of major retailers reported quarterly results that topped Wall Street estimates.",
      "Consumer spending has remained resilient despite persistently elevated borrowing costs, a trend that showed up clearly in same-store sales figures released this morning. Several blue-chip retailers raised their full-year guidance, citing steady demand and improving inventory management.",
      "Industrial and consumer staples components of the Dow also contributed to the day's gains, while a handful of healthcare names lagged on regulatory headlines.",
      "Analysts note that the strength in retail earnings offers an encouraging signal about the health of the American consumer heading into the crucial holiday shopping season.",
    ]),
  },
  {
    title: "Nasdaq Composite Slips as Chipmakers Pull Back After Recent Surge",
    category: "Nasdaq",
    tags: ["Nasdaq", "Semiconductors", "Technology Stocks"],
    image: IMAGES[2],
    isTrending: true,
    content: paragraphs([
      "The tech-heavy Nasdaq Composite fell 0.9% on Tuesday, snapping a five-day winning streak, as semiconductor stocks retreated following a sharp run-up over the past month.",
      "Chip stocks had rallied hard on optimism around AI infrastructure spending, leaving valuations stretched by several measures. Wednesday's pullback appeared to be a routine bout of profit-taking rather than a shift in the underlying growth narrative.",
      "\"Investors aren't losing conviction in the AI theme, they're just recalibrating after such a fast move higher,\" one portfolio manager noted. \"Pullbacks like this are healthy and, frankly, overdue.\"",
      "Software and internet names were mixed, with a few large-cap platforms posting modest gains that partially offset losses in hardware-oriented names.",
    ]),
  },
  {
    title: "Federal Reserve Holds Interest Rates Steady, Signals Data-Dependent Path Ahead",
    category: "Federal Reserve",
    tags: ["Federal Reserve", "Interest Rates", "Monetary Policy"],
    image: IMAGES[3],
    isFeatured: true,
    isTrending: true,
    content: paragraphs([
      "The Federal Reserve left its benchmark interest rate unchanged on Wednesday, matching market expectations, while reiterating that future decisions will depend heavily on incoming inflation and labor market data.",
      "In prepared remarks, the Fed Chair emphasized that policymakers are in no rush to cut rates until they see more convincing and sustained evidence that inflation is moving back toward the central bank's 2% target.",
      "The post-meeting statement removed language suggesting further tightening was likely, a subtle but notable shift that some traders interpreted as a step toward a more neutral stance.",
      "Fed funds futures continued to price in the possibility of rate cuts later in the year, though the exact timing remains a subject of debate among economists.",
      "Equity markets initially wobbled following the announcement before recovering into the close, as investors digested the nuance in the Fed's updated economic projections.",
    ]),
  },
  {
    title: "Apple Shares Jump After Reporting Record Services Revenue",
    category: "Earnings",
    tags: ["Apple", "Earnings", "Technology Stocks"],
    image: IMAGES[4],
    isTrending: true,
    content: paragraphs([
      "Shares of the iPhone maker rose more than 4% in after-hours trading after the company reported quarterly results that beat Wall Street's revenue and earnings-per-share estimates, driven largely by record-setting services revenue.",
      "The services segment, which includes the App Store, subscriptions, and payment services, grew at a double-digit pace year-over-year and now represents a growing share of total company revenue, a trend analysts view favorably given its higher margins.",
      "Hardware revenue was roughly in line with expectations, with management noting steady demand across its product lineup despite a challenging macro backdrop in some international markets.",
      "During the earnings call, executives pointed to continued investment in artificial intelligence features across the company's ecosystem as a key growth driver going forward.",
    ]),
  },
  {
    title: "Bitcoin Tops Key Resistance Level as Institutional Inflows Accelerate",
    category: "Cryptocurrency",
    tags: ["Bitcoin", "Cryptocurrency", "ETF"],
    image: IMAGES[5],
    content: paragraphs([
      "Bitcoin pushed through a closely watched resistance level this week, extending its year-to-date gains as spot exchange-traded funds continued to see steady net inflows from institutional investors.",
      "Trading volumes across major exchanges picked up meaningfully, and on-chain data shows a rise in the number of large wallet addresses accumulating the asset over the past month.",
      "Ethereum and several other major tokens also posted gains, though the broader crypto market remains highly sensitive to macroeconomic headlines, particularly signals from the Federal Reserve on interest rate policy.",
      "Analysts caution that volatility remains elevated and encourage investors to size crypto positions according to their own risk tolerance.",
    ]),
  },
  {
    title: "Regional Banks Rally After Stress Test Results Ease Investor Concerns",
    category: "Wall Street",
    tags: ["Banks", "Wall Street", "Financials"],
    image: IMAGES[6],
    content: paragraphs([
      "Shares of several regional banks rose sharply after the latest round of stress test results showed the sector remains well-capitalized even under adverse economic scenarios.",
      "The results helped ease lingering investor concerns that have weighed on the group since last year's turmoil in the regional banking sector, with several names posting their best single-day gains in months.",
      "Analysts noted that stronger capital buffers should give banks more flexibility to return capital to shareholders through dividends and buybacks in the coming quarters.",
      "The broader financial sector outperformed the market on the day, with large money-center banks also participating in the rally.",
    ]),
  },
  {
    title: "Oil Prices Climb on Supply Concerns, Energy Stocks Outperform",
    category: "Market Analysis",
    tags: ["Energy", "Oil", "Market Analysis"],
    image: IMAGES[7],
    content: paragraphs([
      "Crude oil prices rose more than 2% on Thursday amid growing concerns about global supply disruptions, lifting shares of major U.S. energy producers along with the broader sector.",
      "The move higher in oil prices comes as several major producing nations signaled they may extend existing output cuts, tightening the global supply picture heading into the winter months.",
      "Energy was the best-performing sector in the S&P 500 for the session, with exploration and production companies leading gains.",
      "Strategists note that a sustained rise in energy prices could complicate the inflation outlook, a dynamic the Federal Reserve will likely be watching closely.",
    ]),
  },
  {
    title: "Microsoft Unveils New AI-Powered Enterprise Tools, Shares Hit New High",
    category: "Company News",
    tags: ["Microsoft", "Artificial Intelligence", "Company News"],
    image: IMAGES[8],
    isFeatured: true,
    content: paragraphs([
      "Microsoft shares climbed to a fresh 52-week high after the company announced a suite of new artificial intelligence tools aimed at enterprise customers, deepening its push to monetize generative AI across its product lineup.",
      "The announcement builds on the company's existing partnership in the AI space and comes as competition intensifies among major technology firms to capture enterprise AI spending.",
      "Analysts at several major brokerages raised their price targets on the stock following the announcement, citing the potential for accelerating cloud revenue growth tied to AI adoption.",
      "Company executives said early customer feedback on the new tools has been positive, though they cautioned that meaningful revenue contribution will take time to materialize.",
    ]),
  },
  {
    title: "Small-Cap Stocks Lag as Investors Rotate Back Into Mega-Cap Tech",
    category: "Market Analysis",
    tags: ["Small Caps", "Market Analysis", "Rotation"],
    image: IMAGES[9],
    content: paragraphs([
      "The Russell 2000, a widely followed gauge of small-cap stocks, underperformed the broader market this week as investors rotated capital back into large, established technology companies.",
      "The divergence highlights an ongoing debate among market participants about whether small-cap stocks, which tend to be more sensitive to interest rates and the domestic economy, are due for a sustained period of outperformance.",
      "Some strategists argue that a more dovish Federal Reserve stance later this year could serve as a catalyst for small-cap stocks, which have lagged their large-cap peers for much of the current cycle.",
      "For now, however, flows continue to favor mega-cap technology names with strong balance sheets and clearer paths to AI-driven earnings growth.",
    ]),
  },
  {
    title: "Consumer Price Index Rises Less Than Expected, Boosting Rate-Cut Hopes",
    category: "Stock Market News",
    tags: ["Inflation", "Federal Reserve", "Economy"],
    image: IMAGES[10],
    isTrending: true,
    content: paragraphs([
      "The latest Consumer Price Index report showed inflation rose less than economists had forecast last month, fueling renewed optimism that the Federal Reserve could begin cutting interest rates sooner than previously anticipated.",
      "Core inflation, which excludes volatile food and energy prices, also came in below expectations on a month-over-month basis, marking a second consecutive month of encouraging data.",
      "Stocks rallied broadly following the report's release, with rate-sensitive sectors such as real estate and small-cap equities among the top performers of the session.",
      "Treasury yields fell sharply as bond traders priced in a higher probability of rate cuts in the coming months, a shift that also weighed on the U.S. dollar.",
    ]),
  },
  {
    title: "Amazon Beats Earnings Estimates on Strong Cloud and Advertising Growth",
    category: "Earnings",
    tags: ["Amazon", "Earnings", "Cloud Computing"],
    image: IMAGES[11],
    content: paragraphs([
      "Amazon reported quarterly earnings that comfortably exceeded analyst expectations, driven by accelerating growth in its cloud computing division and a resurgent advertising business.",
      "Amazon Web Services grew at its fastest pace in several quarters, easing concerns about slowing enterprise cloud spending that had weighed on the stock earlier in the year.",
      "The company's advertising segment also posted strong double-digit growth, cementing its position as one of the largest ad platforms in the world alongside the biggest search and social media companies.",
      "Shares rose in extended trading following the report, with several analysts highlighting improving operating margins as a key positive takeaway from the quarter.",
    ]),
  },
];

async function main() {
  console.log("Seeding Stockrino demo data...");

  // ---- Admin user ----
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@stockrino.com";
  const adminUsername = process.env.SEED_ADMIN_USERNAME || "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Stockrino@123";

  const existingAdmin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, adminEmail),
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await db.insert(adminUsers).values({
      name: "Stockrino Admin",
      username: adminUsername,
      email: adminEmail,
      passwordHash,
    });
    console.log(`Created admin user -> email: ${adminEmail} / username: ${adminUsername} / password: ${adminPassword}`);
  } else {
    console.log("Admin user already exists, skipping.");
  }

  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, adminEmail),
  });

  // ---- Categories ----
  const categoryIdByName = new Map<string, number>();
  for (const cat of DEFAULT_CATEGORIES) {
    const slug = slugify(cat.name);
    let row = await db.query.categories.findFirst({
      where: eq(categories.slug, slug),
    });
    if (!row) {
      const [created] = await db
        .insert(categories)
        .values({ name: cat.name, slug, description: cat.description })
        .returning();
      row = created;
    }
    categoryIdByName.set(cat.name, row.id);
  }
  console.log(`Ensured ${DEFAULT_CATEGORIES.length} categories.`);

  // ---- Settings ----
  const existingSettings = await db.query.settings.findFirst({
    where: eq(settings.id, 1),
  });
  if (!existingSettings) {
    await db.insert(settings).values({
      id: 1,
      siteName: "Stockrino",
      tagline:
        "A modern platform for USA Stock Market news, updates, analysis, and financial insights.",
      description:
        "Stockrino delivers daily USA stock market news, breaking updates, earnings coverage, and expert analysis on the S&P 500, Nasdaq, Dow Jones, Federal Reserve policy, and more.",
      contactEmail: "contact@stockrino.com",
      socialTwitter: "https://twitter.com/stockrino",
      socialFacebook: "https://facebook.com/stockrino",
      socialLinkedin: "https://linkedin.com/company/stockrino",
      seoDefaultTitle: "Stockrino - USA Stock Market News, Analysis & Insights",
      seoDefaultDescription:
        "Stay ahead with Stockrino's daily USA stock market news, S&P 500, Nasdaq, Dow Jones, earnings, and Federal Reserve coverage.",
      seoDefaultKeywords:
        "stock market news, USA stock market, S&P 500, Nasdaq, Dow Jones, Wall Street, earnings, Federal Reserve, stock analysis",
      siteUrl: process.env.SITE_URL || "http://localhost:3000",
    });
    console.log("Created default settings.");
  }

  // ---- Demo posts ----
  const existingDemoCount = sqlite
    .prepare(`SELECT COUNT(*) as c FROM posts WHERE is_demo = 1`)
    .get() as { c: number };

  if (existingDemoCount.c > 0) {
    console.log(`Demo posts already present (${existingDemoCount.c}), skipping post seeding.`);
  } else {
    let i = 0;
    const now = Date.now();
    for (const demo of DEMO_POSTS) {
      const catId = categoryIdByName.get(demo.category) ?? null;

      // stagger publish dates over the last ~12 days so "latest" ordering looks realistic
      const publishedAt = new Date(now - i * 22 * 60 * 60 * 1000).toISOString();

      const [img] = await db
        .insert(media)
        .values({
          filename: `demo-${slugify(demo.title)}.jpg`,
          url: demo.image,
          title: demo.title,
          altText: demo.title,
          caption: "",
          mimeType: "image/jpeg",
        })
        .returning();

      const slug = slugify(demo.title);
      const excerpt = makeExcerpt(demo.content, 170);

      const [post] = await db
        .insert(posts)
        .values({
          title: demo.title,
          slug,
          excerpt,
          content: demo.content,
          featuredImageId: img.id,
          authorId: admin?.id ?? null,
          categoryId: catId,
          status: "published",
          isTrending: !!demo.isTrending,
          isFeatured: !!demo.isFeatured,
          isDemo: true,
          publishedAt,
          createdAt: publishedAt,
          updatedAt: publishedAt,
          seoTitle: demo.title,
          seoDescription: excerpt,
          seoKeywords: demo.tags.join(", "),
          ogTitle: demo.title,
          ogDescription: excerpt,
          ogImageId: img.id,
        })
        .returning();

      for (const tagName of demo.tags) {
        const tagSlug = slugify(tagName);
        let tag = await db.query.tags.findFirst({ where: eq(tags.slug, tagSlug) });
        if (!tag) {
          const [createdTag] = await db
            .insert(tags)
            .values({ name: tagName, slug: tagSlug })
            .returning();
          tag = createdTag;
        }
        await db.insert(postTags).values({ postId: post.id, tagId: tag.id }).onConflictDoNothing();
      }

      i += 1;
    }

    // Add one scheduled and one draft demo post so admin UI has examples of every status
    const draftContent = paragraphs([
      "This is a draft article used to demonstrate the Draft status in the Stockrino admin panel.",
      "Replace this content with your own reporting before publishing.",
    ]);
    await db.insert(posts).values({
      title: "[Draft Example] Tesla Deliveries Preview: What Analysts Expect Next Quarter",
      slug: slugify("draft-example-tesla-deliveries-preview"),
      excerpt: makeExcerpt(draftContent),
      content: draftContent,
      authorId: admin?.id ?? null,
      categoryId: categoryIdByName.get("Company News") ?? null,
      status: "draft",
      isDemo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const scheduledContent = paragraphs([
      "This is a scheduled demo article showing how Stockrino automatically publishes content at a future date and time.",
      "Once the scheduled time passes, this post will automatically move to Published without any manual action.",
    ]);
    const scheduledFor = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await db.insert(posts).values({
      title: "[Scheduled Example] Weekly Market Outlook: What to Watch Next Week",
      slug: slugify("scheduled-example-weekly-market-outlook"),
      excerpt: makeExcerpt(scheduledContent),
      content: scheduledContent,
      authorId: admin?.id ?? null,
      categoryId: categoryIdByName.get("Market Analysis") ?? null,
      status: "scheduled",
      scheduledAt: scheduledFor,
      isDemo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log(`Seeded ${DEMO_POSTS.length} demo posts + 1 draft example + 1 scheduled example.`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    sqlite.close();
  });
