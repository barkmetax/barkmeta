import {
  Activity,
  BarChart3,
  Building2,
  Clock,
  Mail,
  MapPin,
  Plus,
  Search,
  Target,
  Trash2,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import {
  addMarket,
  getDashboardData,
  removeMarket,
  useQuery,
} from 'wasp/client/operations';
import { Button } from '../client/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../client/components/ui/card';
import { Input } from '../client/components/ui/input';

const agentConfig = [
  {
    type: 'listing_scanner',
    name: 'Listing Scanner',
    description: 'Scans for new property listings every 6 hours',
    icon: Search,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  {
    type: 'market_analyzer',
    name: 'Market Analyzer',
    description: 'Generates daily market analysis reports',
    icon: BarChart3,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
  },
  {
    type: 'lead_scorer',
    name: 'Lead Scorer',
    description: 'Scores and prioritizes new leads',
    icon: Target,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
  {
    type: 'outreach',
    name: 'Outreach Agent',
    description: 'Automates email/SMS outreach to hot leads',
    icon: Mail,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
];

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery(getDashboardData);
  const [showAddMarket, setShowAddMarket] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleAddMarket = async () => {
    if (!city || !state) return;
    try {
      await addMarket({ city, state, zipCode: zipCode || undefined });
      setCity('');
      setState('');
      setZipCode('');
      setShowAddMarket(false);
    } catch (err: any) {
      alert('Error adding market: ' + err.message);
    }
  };

  const handleRemoveMarket = async (marketId: string) => {
    if (!confirm('Remove this market and all its data?')) return;
    try {
      await removeMarket({ marketId });
    } catch (err: any) {
      alert('Error removing market: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-destructive">Error loading dashboard: {error.message}</div>
      </div>
    );
  }

  const { markets, recentAgentRuns, stats } = data!;

  // Get latest run for each agent type
  const getLatestRun = (agentType: string) => {
    return recentAgentRuns.find((r: any) => r.agentType === agentType);
  };

  const formatTime = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="py-10 lg:mt-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-bold">Agent Dashboard</h1>
            <p className="text-muted-foreground mt-1">Monitor your AI real estate agents</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Active Markets"
            value={stats.activeMarkets}
            icon={MapPin}
            color="text-blue-500"
          />
          <StatsCard
            title="Total Listings"
            value={stats.totalListings}
            icon={Building2}
            color="text-emerald-500"
          />
          <StatsCard
            title="Leads"
            value={stats.totalLeads}
            icon={Users}
            color="text-amber-500"
          />
          <StatsCard
            title="Reports"
            value={stats.totalReports}
            icon={TrendingUp}
            color="text-purple-500"
          />
        </div>

        {/* Agent Cards */}
        <div className="mb-8">
          <h2 className="text-foreground mb-4 text-xl font-semibold">AI Agents</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {agentConfig.map((agent) => {
              const latestRun = getLatestRun(agent.type);
              const Icon = agent.icon;

              return (
                <Card
                  key={agent.type}
                  className={`border-2 ${agent.borderColor} transition-all hover:shadow-md`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${agent.bgColor}`}>
                        <Icon className={`h-5 w-5 ${agent.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-foreground text-sm font-semibold">
                          {agent.name}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-3 text-xs">{agent.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">Status</span>
                        {latestRun ? (
                          <StatusBadge status={latestRun.status} />
                        ) : (
                          <StatusBadge status="idle" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-xs">Last Run</span>
                        <span className="text-foreground flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {latestRun ? formatTime(latestRun.startedAt) : 'Never'}
                        </span>
                      </div>
                      {latestRun && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">Results</span>
                          <span className="text-foreground text-xs font-medium">
                            {latestRun.resultsCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Markets Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground text-xl font-semibold">Your Markets</h2>
            <Button
              size="sm"
              variant="default"
              onClick={() => setShowAddMarket(!showAddMarket)}
            >
              {showAddMarket ? (
                <>
                  <X className="mr-1 h-4 w-4" /> Cancel
                </>
              ) : (
                <>
                  <Plus className="mr-1 h-4 w-4" /> Add Market
                </>
              )}
            </Button>
          </div>

          {showAddMarket && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="flex-1">
                    <label className="text-muted-foreground mb-1 block text-xs font-medium">
                      City *
                    </label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Austin"
                    />
                  </div>
                  <div className="w-24">
                    <label className="text-muted-foreground mb-1 block text-xs font-medium">
                      State *
                    </label>
                    <Input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="TX"
                      maxLength={2}
                    />
                  </div>
                  <div className="w-32">
                    <label className="text-muted-foreground mb-1 block text-xs font-medium">
                      Zip Code
                    </label>
                    <Input
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="78701"
                      maxLength={10}
                    />
                  </div>
                  <Button onClick={handleAddMarket} disabled={!city || !state}>
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {markets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MapPin className="text-muted-foreground mb-3 h-12 w-12" />
                <p className="text-muted-foreground text-center">
                  No markets added yet. Add your first target market to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {markets.map((market: any) => (
                <Card key={market.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="text-foreground font-semibold">
                          {market.city}, {market.state}
                        </h3>
                        {market.zipCode && (
                          <span className="text-muted-foreground text-xs">{market.zipCode}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            market.isActive
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-gray-500/10 text-gray-500'
                          }`}
                        >
                          {market.isActive ? 'Active' : 'Paused'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/80 h-auto p-1"
                          onClick={() => handleRemoveMarket(market.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-muted/50 rounded-md p-2">
                        <p className="text-foreground text-lg font-bold">
                          {market._count?.listings || 0}
                        </p>
                        <p className="text-muted-foreground text-xs">Listings</p>
                      </div>
                      <div className="bg-muted/50 rounded-md p-2">
                        <p className="text-foreground text-lg font-bold">
                          {market._count?.leads || 0}
                        </p>
                        <p className="text-muted-foreground text-xs">Leads</p>
                      </div>
                      <div className="bg-muted/50 rounded-md p-2">
                        <p className="text-foreground text-lg font-bold">
                          {market._count?.reports || 0}
                        </p>
                        <p className="text-muted-foreground text-xs">Reports</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Agent Activity */}
        <div>
          <h2 className="text-foreground mb-4 text-xl font-semibold">Recent Agent Activity</h2>
          {recentAgentRuns.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Activity className="text-muted-foreground mb-3 h-12 w-12" />
                <p className="text-muted-foreground text-center">
                  No agent activity yet. Agents will start running after you add a market.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentAgentRuns.slice(0, 10).map((run: any) => {
                    const agentInfo = agentConfig.find((a) => a.type === run.agentType);
                    const Icon = agentInfo?.icon || Activity;

                    return (
                      <div key={run.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className={`rounded-lg p-2 ${agentInfo?.bgColor || 'bg-muted'}`}>
                            <Icon
                              className={`h-4 w-4 ${agentInfo?.color || 'text-muted-foreground'}`}
                            />
                          </div>
                          <div>
                            <p className="text-foreground text-sm font-medium">
                              {agentInfo?.name || run.agentType}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {formatTime(run.startedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground text-xs">
                            {run.resultsCount} results
                          </span>
                          <StatusBadge status={run.status} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="bg-muted rounded-lg p-3">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <p className="text-foreground text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    running: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Running' },
    completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', label: 'Completed' },
    error: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Error' },
    idle: { bg: 'bg-gray-500/10', text: 'text-gray-500', label: 'Idle' },
  };

  const c = config[status] || config.idle;

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
