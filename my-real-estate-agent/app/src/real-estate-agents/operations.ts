import { HttpError } from 'wasp/server';
import type {
  GetMarkets,
  GetDashboardData,
  GetLeads,
  GetReports,
  AddMarket,
  RemoveMarket,
} from 'wasp/server/operations';

// ─── Queries ────────────────────────────────────────────────────────────────

type GetMarketsResult = {
  id: string;
  zipCode: string | null;
  city: string;
  state: string;
  isActive: boolean;
  createdAt: Date;
  _count: { listings: number; leads: number; reports: number };
};

export const getMarkets: GetMarkets<void, GetMarketsResult[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  return context.entities.Market.findMany({
    where: { userId: context.user.id },
    include: {
      _count: {
        select: { listings: true, leads: true, reports: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  }) as any;
};

type DashboardData = {
  markets: any[];
  recentAgentRuns: any[];
  stats: {
    totalListings: number;
    totalLeads: number;
    totalReports: number;
    activeMarkets: number;
  };
};

export const getDashboardData: GetDashboardData<void, DashboardData> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  const userId = context.user.id;

  const markets = await context.entities.Market.findMany({
    where: { userId },
    include: {
      _count: {
        select: { listings: true, leads: true, reports: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const recentAgentRuns = await context.entities.AgentRun.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
    take: 20,
  });

  const totalListings = await context.entities.Listing.count({
    where: { market: { userId } },
  });
  const totalLeads = await context.entities.Lead.count({
    where: { market: { userId } },
  });
  const totalReports = await context.entities.Report.count({
    where: { market: { userId } },
  });
  const activeMarkets = markets.filter((m) => m.isActive).length;

  return {
    markets,
    recentAgentRuns,
    stats: { totalListings, totalLeads, totalReports, activeMarkets },
  };
};

export const getLeads: GetLeads<void, any[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  return context.entities.Lead.findMany({
    where: { market: { userId: context.user.id } },
    include: { market: true },
    orderBy: { score: 'desc' },
  });
};

export const getReports: GetReports<void, any[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  return context.entities.Report.findMany({
    where: { market: { userId: context.user.id } },
    include: { market: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
};

// ─── Actions ────────────────────────────────────────────────────────────────

type AddMarketInput = {
  city: string;
  state: string;
  zipCode?: string;
};

export const addMarket: AddMarket<AddMarketInput, any> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  return context.entities.Market.create({
    data: {
      userId: context.user.id,
      city: args.city,
      state: args.state,
      zipCode: args.zipCode || null,
      isActive: true,
    },
  });
};

export const removeMarket: RemoveMarket<{ marketId: string }, void> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  const market = await context.entities.Market.findUnique({
    where: { id: args.marketId },
  });

  if (!market || market.userId !== context.user.id) {
    throw new HttpError(403, 'Not authorized to remove this market');
  }

  // Delete related records first
  await context.entities.Lead.deleteMany({ where: { marketId: args.marketId } });
  await context.entities.Report.deleteMany({ where: { marketId: args.marketId } });
  await context.entities.Listing.deleteMany({ where: { marketId: args.marketId } });
  await context.entities.Market.delete({ where: { id: args.marketId } });
};
