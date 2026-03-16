"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const steps = [
  { label: "Website", description: "Enter your website" },
  { label: "Analyze", description: "AI scans your site" },
  { label: "Configure", description: "Pick your agents" },
  { label: "Launch", description: "Deploy your team" },
];

const agentOptions = [
  { id: "listing", name: "Listing Description Agent", icon: "📝", description: "AI-written MLS descriptions" },
  { id: "social", name: "Social Media Agent", icon: "📱", description: "Instagram, Facebook, TikTok posts" },
  { id: "seo", name: "SEO Agent", icon: "🔍", description: "Local search optimization" },
  { id: "email", name: "Email Campaign Agent", icon: "📧", description: "Lead nurturing campaigns" },
  { id: "neighborhood", name: "Neighborhood Content Agent", icon: "🏘️", description: "Area guides & market reports" },
  { id: "ads", name: "Ad Copy Agent", icon: "📢", description: "Google & Meta ad copy" },
];

interface AnalysisResult {
  siteName: string;
  issues: string[];
  opportunities: string[];
  score: number;
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <Onboarding />
    </Suspense>
  );
}

function Onboarding() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [website, setWebsite] = useState(searchParams.get("website") || "");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<string[]>(
    agentOptions.map((a) => a.id)
  );
  const [deploying, setDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);

  useEffect(() => {
    if (searchParams.get("website") && currentStep === 0) {
      handleAnalyze();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyze = async () => {
    if (!website) return;
    setCurrentStep(1);
    setAnalyzing(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website }),
      });
      const data = await res.json();
      setAnalysis(data);
    } catch {
      setAnalysis({
        siteName: new URL(website.startsWith("http") ? website : `https://${website}`).hostname,
        issues: [
          "No structured data for listings detected",
          "Missing local SEO signals",
          "No blog or content strategy found",
        ],
        opportunities: [
          "High potential for local search ranking",
          "Social media presence can be built quickly",
          "Email list could drive repeat engagement",
        ],
        score: 34,
      });
    }

    setAnalyzing(false);
    setCurrentStep(2);
  };

  const handleDeploy = async () => {
    setCurrentStep(3);
    setDeploying(true);

    for (let i = 0; i <= 100; i += 2) {
      await new Promise((r) => setTimeout(r, 60));
      setDeployProgress(i);
    }

    setDeploying(false);
    router.push("/dashboard");
  };

  const toggleAgent = (id: string) => {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              LP
            </div>
            <span className="font-bold text-xl text-gray-900">ListingPilot</span>
          </Link>
        </div>
      </nav>

      {/* Progress steps */}
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-4">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    i <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < currentStep ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span className={`text-xs mt-2 ${i <= currentStep ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 ${i < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Step 0: Enter website */}
        {currentStep === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Enter your real estate website
            </h2>
            <p className="text-gray-500 mb-6">
              We&apos;ll analyze your site and recommend the best marketing strategy.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAnalyze();
              }}
            >
              <input
                type="url"
                placeholder="https://yourrealestatsite.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg mb-4"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
              >
                Analyze My Site
              </button>
            </form>
          </div>
        )}

        {/* Step 1: Analyzing */}
        {currentStep === 1 && analyzing && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Analyzing your website...
            </h2>
            <p className="text-gray-500">
              Our AI is scanning your site for SEO, content, and marketing opportunities.
            </p>
          </div>
        )}

        {/* Step 2: Configure agents */}
        {currentStep === 2 && analysis && (
          <div className="space-y-6">
            {/* Analysis results */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Site Analysis: {analysis.siteName}
                  </h2>
                  <p className="text-gray-500">
                    Here&apos;s what we found and how we can help.
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${
                      analysis.score < 40
                        ? "text-red-500"
                        : analysis.score < 70
                        ? "text-amber-500"
                        : "text-green-500"
                    }`}
                  >
                    {analysis.score}/100
                  </div>
                  <div className="text-xs text-gray-400">Marketing Score</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-red-600 text-sm mb-3">
                    Issues Found
                  </h3>
                  <ul className="space-y-2">
                    {analysis.issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-red-400 mt-0.5">!</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-green-600 text-sm mb-3">
                    Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {analysis.opportunities.map((opp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">+</span>
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Agent selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Select Your AI Agents
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                All agents are included in your plan. Toggle any you don&apos;t need.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {agentOptions.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => toggleAgent(agent.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedAgents.includes(agent.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{agent.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {agent.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {agent.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={handleDeploy}
                disabled={selectedAgents.length === 0}
                className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deploy {selectedAgents.length} Agent
                {selectedAgents.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Deploying */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center text-3xl">
              {deploying ? "🚀" : "✅"}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {deploying
                ? "Deploying your AI marketing team..."
                : "Your agents are live!"}
            </h2>
            <p className="text-gray-500 mb-6">
              {deploying
                ? "Setting up your personalized marketing agents."
                : "Redirecting to your dashboard..."}
            </p>
            {deploying && (
              <div className="max-w-md mx-auto">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-100"
                    style={{ width: `${deployProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">{deployProgress}%</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
