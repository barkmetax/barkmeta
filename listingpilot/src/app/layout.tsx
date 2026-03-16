import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ListingPilot — AI Marketing Agent for Real Estate",
  description:
    "Enter your listings and ListingPilot deploys AI agents to get you leads. SEO, social media, email campaigns, and listing descriptions — all on autopilot for $99/month.",
  keywords: ["real estate marketing", "AI agent", "listing marketing", "real estate SEO", "automated marketing"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
