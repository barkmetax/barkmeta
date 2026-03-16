import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { website } = await request.json();

  if (!website) {
    return NextResponse.json({ error: "Website URL is required" }, { status: 400 });
  }

  let hostname: string;
  try {
    hostname = new URL(
      website.startsWith("http") ? website : `https://${website}`
    ).hostname;
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Simulate analysis delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate realistic-looking analysis based on the domain
  const score = Math.floor(Math.random() * 40) + 20; // 20-60 range (most sites score low)

  const issuePool = [
    "No structured data (schema.org) for property listings",
    "Missing Open Graph tags for social sharing",
    "No blog or content marketing strategy detected",
    "Page load speed is below recommended threshold",
    "Missing local business schema markup",
    "No Google Business Profile integration detected",
    "Missing alt tags on property images",
    "No email capture or lead magnet found",
    "Mobile responsiveness issues on listing pages",
    "No sitemap.xml found for search engines",
  ];

  const opportunityPool = [
    "Strong domain authority — SEO gains will compound quickly",
    "Local market has low competition for key search terms",
    "Social media profiles exist but are underutilized",
    "Email marketing could increase lead conversion by 30-40%",
    "Neighborhood content would rank well in this market",
    "Google Ads for this area show high intent at low CPC",
    "Video content has high engagement in this market segment",
    "Zillow and Realtor.com referral traffic can be captured",
  ];

  // Pick random issues and opportunities
  const shuffled = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5);
  const issues = shuffled(issuePool).slice(0, 3 + Math.floor(Math.random() * 2));
  const opportunities = shuffled(opportunityPool).slice(0, 3 + Math.floor(Math.random() * 2));

  return NextResponse.json({
    siteName: hostname,
    score,
    issues,
    opportunities,
  });
}
