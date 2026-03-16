import { NextRequest, NextResponse } from "next/server";

interface AgentConfig {
  id: string;
  name: string;
  enabled: boolean;
}

export async function POST(request: NextRequest) {
  const { agents, website } = await request.json();

  if (!agents || !Array.isArray(agents)) {
    return NextResponse.json(
      { error: "Agents configuration is required" },
      { status: 400 }
    );
  }

  if (!website) {
    return NextResponse.json(
      { error: "Website URL is required" },
      { status: 400 }
    );
  }

  // Simulate agent deployment
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const deployedAgents = (agents as AgentConfig[])
    .filter((a) => a.enabled)
    .map((agent) => ({
      id: agent.id,
      name: agent.name,
      status: "active",
      deployedAt: new Date().toISOString(),
      nextAction: getNextAction(agent.id),
    }));

  return NextResponse.json({
    success: true,
    website,
    deployedAgents,
    message: `Successfully deployed ${deployedAgents.length} agents for ${website}`,
  });
}

function getNextAction(agentId: string): string {
  const actions: Record<string, string> = {
    listing: "Scanning active listings to generate optimized descriptions",
    social: "Analyzing top-performing real estate posts in your market",
    seo: "Running technical SEO audit and keyword research",
    email: "Setting up welcome sequence for new leads",
    neighborhood: "Researching local market data and school ratings",
    ads: "Analyzing competitor ad spend and keyword opportunities",
  };
  return actions[agentId] || "Initializing agent...";
}

export async function GET() {
  // Return current agent statuses
  return NextResponse.json({
    agents: [
      { id: "listing", status: "active", tasksCompleted: 47 },
      { id: "social", status: "working", tasksCompleted: 156 },
      { id: "seo", status: "active", tasksCompleted: 89 },
      { id: "email", status: "working", tasksCompleted: 23 },
      { id: "neighborhood", status: "idle", tasksCompleted: 12 },
      { id: "ads", status: "active", tasksCompleted: 34 },
    ],
  });
}
