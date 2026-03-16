import daBoiAvatar from "../client/static/da-boi.webp";
import { DocsUrl } from "../shared/common";
import type { GridFeature } from "./components/FeaturesGrid";

export const features: GridFeature[] = [
  {
    name: "Listing Scanner Agent",
    description: "Automatically scans for new property listings in your target markets every 6 hours. Never miss a new opportunity.",
    emoji: "🔍",
    href: DocsUrl,
    size: "large",
  },
  {
    name: "Market Analysis Reports",
    description: "Daily AI-generated market reports with price trends, inventory levels, and investment insights.",
    emoji: "📊",
    href: DocsUrl,
    size: "large",
  },
  {
    name: "AI Lead Scoring",
    description: "Automatically score and prioritize leads based on engagement, budget, and market activity.",
    emoji: "🎯",
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "Automated Outreach",
    description: "Send personalized email and SMS follow-ups to warm and hot leads automatically.",
    emoji: "📧",
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "Multi-Market Tracking",
    description: "Monitor multiple zip codes and cities simultaneously with separate agents for each.",
    emoji: "🗺️",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Real-Time Dashboard",
    description: "Track agent status, view pipeline metrics, and monitor your markets from one central hub.",
    emoji: "📈",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Stripe Payments Built-In",
    description: "Subscription billing with Stripe is already wired in. Just add your API keys and go.",
    emoji: "💳",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Auth & Admin Dashboard",
    description: "Full authentication, user management, and admin analytics dashboard out of the box.",
    emoji: "🔐",
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "24/7 Autonomous Operation",
    description: "Your AI agents work around the clock — scanning, analyzing, scoring, and reaching out while you sleep.",
    emoji: "🤖",
    href: DocsUrl,
    size: "medium",
  },
];

export const testimonials = [
  {
    name: "Sarah M.",
    role: "Real Estate Investor",
    avatarSrc: daBoiAvatar,
    socialUrl: "#",
    quote: "This platform finds deals before they even hit the market. My portfolio grew 30% in 6 months.",
  },
  {
    name: "James K.",
    role: "RE/MAX Agent",
    avatarSrc: daBoiAvatar,
    socialUrl: "#",
    quote: "The automated outreach alone saves me 15 hours a week. It's like having a virtual assistant that never takes a break.",
  },
  {
    name: "Linda P.",
    role: "Property Manager",
    avatarSrc: daBoiAvatar,
    socialUrl: "#",
    quote: "Market reports are incredibly detailed. I use them for every client presentation now.",
  },
];

export const faqs = [
  {
    id: 1,
    question: "How does the AI Listing Scanner work?",
    answer: "Our listing scanner agent runs every 6 hours, scanning multiple data sources for new property listings in your configured markets. It automatically adds them to your pipeline for review.",
    href: "#",
  },
  {
    id: 2,
    question: "Can I customize the lead scoring criteria?",
    answer: "Yes! The lead scoring agent uses configurable criteria including budget match, engagement level, and market activity. Enterprise plan users can create fully custom scoring models.",
    href: "#",
  },
  {
    id: 3,
    question: "How many markets can I track?",
    answer: "Starter plan includes 1 market, Pro includes 5 markets, and Enterprise gives you unlimited markets. Each market runs its own set of AI agents independently.",
    href: "#",
  },
  {
    id: 4,
    question: "Is there a free trial?",
    answer: "Yes! Start with a free trial to explore the platform. No credit card required to get started.",
    href: "#",
  },
];

export const footerNavigation = {
  app: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Pricing", href: "/pricing" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

export const examples = [
  {
    name: "Listing Scanner",
    description: "Automatically discover new property listings across your target markets every 6 hours.",
    imageSrc: "",
    href: "#",
  },
  {
    name: "Market Reports",
    description: "AI-generated daily reports with price trends, inventory analysis, and investment insights.",
    imageSrc: "",
    href: "#",
  },
  {
    name: "Lead Pipeline",
    description: "Score, prioritize, and manage leads with AI-powered scoring and automated outreach.",
    imageSrc: "",
    href: "#",
  },
];
