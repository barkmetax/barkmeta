"use client";

import { useState } from "react";
import Link from "next/link";

const agents = [
  {
    name: "Listing Description Agent",
    description: "Writes MLS-optimized, compelling listing descriptions that highlight key features and drive showings.",
    icon: "📝",
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Social Media Agent",
    description: "Creates and schedules posts for Instagram, Facebook, and TikTok with property highlights and virtual tours.",
    icon: "📱",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "SEO Agent",
    description: "Optimizes your website for local real estate searches so buyers find you first on Google.",
    icon: "🔍",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Email Campaign Agent",
    description: "Nurtures your leads with personalized market updates, new listings, and price drop alerts.",
    icon: "📧",
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "Neighborhood Content Agent",
    description: "Generates area guides, school reports, and market analysis that establish you as the local expert.",
    icon: "🏘️",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Ad Copy Agent",
    description: "Creates high-converting Google and Meta ad copy for your listings and brand.",
    icon: "📢",
    color: "from-cyan-500 to-teal-600",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "RE/MAX Agent, Austin TX",
    quote: "I went from spending $1,200/mo on marketing to $99. My lead volume actually increased by 40%.",
    avatar: "SM",
  },
  {
    name: "James Park",
    role: "Keller Williams, Seattle WA",
    quote: "The listing descriptions alone are worth it. I used to spend 30 minutes per listing — now it's instant.",
    avatar: "JP",
  },
  {
    name: "Maria Rodriguez",
    role: "Independent Broker, Miami FL",
    quote: "My social media went from dead to getting 5-10 DMs per week from potential buyers.",
    avatar: "MR",
  },
];

export default function Home() {
  const [website, setWebsite] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              LP
            </div>
            <span className="font-bold text-xl text-gray-900">ListingPilot</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#agents" className="hover:text-gray-900 transition">Agents</a>
            <a href="#pricing" className="hover:text-gray-900 transition">Pricing</a>
            <a href="#testimonials" className="hover:text-gray-900 transition">Testimonials</a>
          </div>
          <Link
            href="/onboarding"
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              AI-Powered Real Estate Marketing
            </div>
          </div>
          <h1 className="animate-fade-in-up stagger-1 text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Your AI Marketing
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Team for $99/mo
            </span>
          </h1>
          <p className="animate-fade-in-up stagger-2 text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter your website and ListingPilot deploys a team of AI agents to
            write your listing descriptions, manage social media, optimize SEO,
            and generate leads — on autopilot.
          </p>

          {/* CTA Input */}
          <div className="animate-fade-in-up stagger-3 max-w-xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (website) {
                  window.location.href = `/onboarding?website=${encodeURIComponent(website)}`;
                }
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="url"
                placeholder="Enter your website URL..."
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="flex-1 px-5 py-4 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition animate-pulse-glow whitespace-nowrap"
              >
                Deploy Agents
              </button>
            </form>
            <p className="mt-3 text-sm text-gray-400">
              Free analysis — no credit card required
            </p>
          </div>

          {/* Social proof */}
          <div className="animate-fade-in-up stagger-4 mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {["SM", "JP", "MR", "KL", "AT"].map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium ring-2 ring-white"
                >
                  {initials}
                </div>
              ))}
            </div>
            <span>
              <strong className="text-gray-900">2,400+</strong> agents using
              ListingPilot
            </span>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-4">The Problem</h3>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Marketing costs are killing your commission</h2>
              <ul className="space-y-4">
                {[
                  "Marketing hire: $50,000-$80,000/year",
                  "SEO agency: $2,000-$5,000/month",
                  "Content writer: $1,000-$3,000/month",
                  "Social media manager: $1,500-$4,000/month",
                  "Email marketing: $500-$1,500/month",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <span className="text-red-400 mt-1">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-2xl font-bold text-red-600">
                Total: $60,000 — $160,000/year
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-4">The Solution</h3>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">ListingPilot does it all for $99/mo</h2>
              <ul className="space-y-4">
                {[
                  "AI listing descriptions in seconds",
                  "Automated social media across all platforms",
                  "Local SEO optimization on autopilot",
                  "Personalized email campaigns to your leads",
                  "Neighborhood content that builds authority",
                  "Ad copy that converts browsers to buyers",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <span className="text-green-500 mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-2xl font-bold text-green-600">
                Total: $99/month ($1,188/year)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              6 AI Agents Working For You 24/7
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Each agent specializes in a different marketing channel, working
              together to maximize your reach and leads.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${agent.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}
                >
                  {agent.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {agent.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {agent.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple Pricing. Massive Value.
          </h2>
          <p className="text-xl text-gray-500 mb-12">
            Everything you need to dominate your market.
          </p>
          <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white">
              <p className="text-blue-200 text-sm font-medium mb-2">
                ALL-IN-ONE PLAN
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">$99</span>
                <span className="text-blue-200">/month</span>
              </div>
              <p className="text-blue-200 mt-2 text-sm">
                Cancel anytime. No contracts.
              </p>
            </div>
            <div className="p-8">
              <ul className="space-y-4 text-left mb-8">
                {[
                  "All 6 AI marketing agents",
                  "Unlimited listing descriptions",
                  "Automated social media posting",
                  "Local SEO optimization",
                  "Email campaign automation",
                  "Neighborhood content generation",
                  "Ad copy for Google & Meta",
                  "Analytics dashboard",
                  "Priority support",
                ].map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <svg
                      className="w-5 h-5 text-blue-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/onboarding"
                className="block w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition text-center"
              >
                Start Free Trial
              </Link>
              <p className="text-gray-400 text-sm mt-3">
                7-day free trial. No credit card needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Agents Love ListingPilot
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-gray-100 bg-white"
              >
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {t.name}
                    </p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Stop Overpaying for Marketing
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Join 2,400+ real estate agents who replaced their entire marketing
            stack with ListingPilot.
          </p>
          <Link
            href="/onboarding"
            className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-md flex items-center justify-center text-white font-bold text-xs">
              LP
            </div>
            <span className="font-semibold text-gray-900">ListingPilot</span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; 2026 ListingPilot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
