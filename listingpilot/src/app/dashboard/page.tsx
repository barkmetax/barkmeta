"use client";

import { useState } from "react";
import Link from "next/link";

interface AgentStatus {
  id: string;
  name: string;
  icon: string;
  status: "active" | "working" | "idle";
  lastAction: string;
  tasksCompleted: number;
  color: string;
}

const initialAgents: AgentStatus[] = [
  {
    id: "listing",
    name: "Listing Description Agent",
    icon: "📝",
    status: "active",
    lastAction: "Generated 3 MLS descriptions for new listings",
    tasksCompleted: 47,
    color: "blue",
  },
  {
    id: "social",
    name: "Social Media Agent",
    icon: "📱",
    status: "working",
    lastAction: "Scheduling Instagram carousel for 123 Oak Street",
    tasksCompleted: 156,
    color: "pink",
  },
  {
    id: "seo",
    name: "SEO Agent",
    icon: "🔍",
    status: "active",
    lastAction: "Optimized meta tags for 5 listing pages",
    tasksCompleted: 89,
    color: "green",
  },
  {
    id: "email",
    name: "Email Campaign Agent",
    icon: "📧",
    status: "working",
    lastAction: "Sending market update to 234 subscribers",
    tasksCompleted: 23,
    color: "purple",
  },
  {
    id: "neighborhood",
    name: "Neighborhood Content Agent",
    icon: "🏘️",
    status: "idle",
    lastAction: "Published area guide for Westlake Hills",
    tasksCompleted: 12,
    color: "amber",
  },
  {
    id: "ads",
    name: "Ad Copy Agent",
    icon: "📢",
    status: "active",
    lastAction: "Created Google Ads copy for 2 luxury listings",
    tasksCompleted: 34,
    color: "cyan",
  },
];

const recentActivity = [
  { time: "2 min ago", agent: "📱", action: "Posted property video to Instagram Reels", type: "social" },
  { time: "15 min ago", agent: "📝", action: "Generated listing description for 456 Elm Drive", type: "listing" },
  { time: "32 min ago", agent: "🔍", action: "Updated sitemap with 3 new listing pages", type: "seo" },
  { time: "1 hr ago", agent: "📧", action: "Sent price drop alert to 89 interested buyers", type: "email" },
  { time: "2 hr ago", agent: "🏘️", action: "Published school district guide for Cedar Park", type: "content" },
  { time: "3 hr ago", agent: "📢", action: "A/B tested 4 ad headlines, winner: +23% CTR", type: "ads" },
  { time: "4 hr ago", agent: "📱", action: "Scheduled 5 Facebook posts for this week", type: "social" },
  { time: "5 hr ago", agent: "🔍", action: "Fixed 12 broken internal links", type: "seo" },
];

export default function Dashboard() {
  const [agents] = useState<AgentStatus[]>(initialAgents);
  const [activeTab, setActiveTab] = useState<"overview" | "activity">("overview");

  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);
  const activeCount = agents.filter((a) => a.status !== "idle").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar + main */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 min-h-screen flex-col">
          <div className="p-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                LP
              </div>
              <span className="font-bold text-lg text-gray-900">ListingPilot</span>
            </Link>
          </div>
          <nav className="flex-1 px-4">
            <div className="space-y-1">
              {[
                { label: "Dashboard", icon: "📊", active: true },
                { label: "Agents", icon: "🤖", active: false },
                { label: "Listings", icon: "🏠", active: false },
                { label: "Analytics", icon: "📈", active: false },
                { label: "Settings", icon: "⚙️", active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                    item.active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
          <div className="p-4 m-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white">
            <p className="font-semibold text-sm">Pro Plan</p>
            <p className="text-blue-200 text-xs mt-1">$99/mo - All agents active</p>
            <div className="mt-3 h-1.5 bg-blue-500/30 rounded-full">
              <div className="h-full w-3/4 bg-white/80 rounded-full" />
            </div>
            <p className="text-blue-200 text-xs mt-1">22 days remaining</p>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 lg:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back! 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Your AI marketing team is hard at work.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
            >
              + Add Listing
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Active Agents", value: `${activeCount}/6`, icon: "🤖", trend: "" },
              { label: "Tasks Completed", value: totalTasks.toString(), icon: "✅", trend: "+12% this week" },
              { label: "Leads Generated", value: "148", icon: "👥", trend: "+23% this week" },
              { label: "Est. Value", value: "$12,400", icon: "💰", trend: "from marketing efforts" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                {stat.trend && (
                  <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
                )}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
            {(["overview", "activity"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Agent cards */}
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{agent.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {agent.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              agent.status === "working"
                                ? "bg-amber-400 animate-pulse"
                                : agent.status === "active"
                                ? "bg-green-400"
                                : "bg-gray-300"
                            }`}
                          />
                          <span className="text-xs text-gray-500 capitalize">
                            {agent.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      {agent.tasksCompleted} tasks
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{agent.lastAction}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition"
                  >
                    <span className="text-xl">{item.agent}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{item.action}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
