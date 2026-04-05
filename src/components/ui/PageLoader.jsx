import React from "react";
import { Skeleton } from "./Skeleton";

const PageLoader = () => {
  return (
    <div className="ds-page-container ds-animate-fade-in p-8 space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center bg-card rounded-xl p-6 border border-border/50">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-xl bg-muted/30 animate-pulse" />
          <div className="space-y-3">
            <div className="w-48 h-6 rounded-md bg-muted/40 animate-pulse" />
            <div className="w-32 h-3 rounded-md bg-muted/20 animate-pulse" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-24 h-10 rounded-lg bg-muted/30 animate-pulse" />
          <div className="w-24 h-10 rounded-lg bg-muted/50 animate-pulse" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card rounded-2xl p-6 border border-border/50 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-muted/30 animate-pulse" />
              <div className="w-16 h-6 rounded-full bg-muted/20 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="w-1/2 h-4 rounded bg-muted/20 animate-pulse" />
              <div className="w-3/4 h-8 rounded bg-muted/40 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-2xl h-[400px] border border-border/50 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/5 to-transparent animate-shimmer" />
            <div className="w-48 h-6 rounded bg-muted/30 mb-6" />
            <div className="w-full h-64 rounded bg-muted/10" />
          </div>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card rounded-2xl h-[400px] border border-border/50 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/5 to-transparent animate-shimmer" />
            <div className="w-32 h-6 rounded bg-muted/30 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-muted/20 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-3 rounded bg-muted/20" />
                    <div className="w-1/2 h-2 rounded bg-muted/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
