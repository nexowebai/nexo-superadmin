import { StatsGrid, StatsCard } from "@components/ui";

export const OrgDetailSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Hero Skeleton */}
    <div className="p-8 bg-surface border border-base rounded-lg h-40">
      <div className="flex flex-col md:flex-row gap-8 items-center h-full">
        <div className="w-24 h-24 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-4 w-full">
          <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
          <div className="flex gap-4">
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20" />
          </div>
        </div>
      </div>
    </div>

    {/* Stats Skeleton */}
    <StatsGrid columns={4} className="mb-6">
      {[1, 2, 3, 4].map(i => <StatsCard key={i} loading variant="nx" />)}
    </StatsGrid>

    {/* Info & Sidebar Row Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-64 bg-surface border border-base rounded-lg" />
        <div className="h-20 bg-surface border border-base rounded-lg" />
      </div>
      <div className="lg:col-span-1">
        <div className="h-80 bg-surface border border-base rounded-lg" />
      </div>
    </div>

    {/* Triple Chart Row Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="h-80 bg-surface border border-base rounded-lg" />
      <div className="h-80 bg-surface border border-base rounded-lg" />
      <div className="h-80 bg-surface border border-base rounded-lg" />
    </div>

    {/* Master Trend Skeleton */}
    <div className="h-96 bg-surface border border-base rounded-lg" />
  </div>
);

export default OrgDetailSkeleton;
