import { motion } from "framer-motion";

const SkeletonPulse = ({ className }) => (
  <motion.div
    initial={{ opacity: 0.4 }}
    animate={{ opacity: 0.8 }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    style={{ backgroundColor: "var(--skeleton-bg)", borderRadius: "var(--radius-md)" }}
    className={className}
  />
);

export default function OrgSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero Skeleton */}
      <div 
        className="p-6 flex flex-col md:flex-row gap-6 items-center"
        style={{ 
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border-base)",
          borderRadius: "var(--radius-md)"
        }}
      >
        <SkeletonPulse className="w-20 h-20 shrink-0" />
        <div className="flex-1 space-y-3 w-full">
          <SkeletonPulse className="h-7 w-48" />
          <div className="flex gap-4">
            <SkeletonPulse className="h-4 w-24" />
            <SkeletonPulse className="h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <SkeletonPulse className="h-9 w-24" />
          <SkeletonPulse className="h-9 w-24" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="p-4 h-32"
            style={{ 
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-base)",
              borderRadius: "var(--radius-md)"
            }}
          >
            <SkeletonPulse className="h-4 w-20 mb-4" />
            <SkeletonPulse className="h-8 w-28" />
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div 
            className="p-6 space-y-6"
            style={{ 
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-base)",
              borderRadius: "var(--radius-md)"
            }}
          >
            <SkeletonPulse className="h-6 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonPulse key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {[1, 2].map((i) => (
                <div key={i} className="p-6 h-64" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-base)", borderRadius: "var(--radius-md)" }}>
                   <SkeletonPulse className="h-6 w-32 mb-8" />
                   <SkeletonPulse className="h-32 w-full" />
                </div>
             ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div 
            className="p-6 space-y-4"
            style={{ 
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-base)",
              borderRadius: "var(--radius-md)"
            }}
          >
            <SkeletonPulse className="h-6 w-24" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <SkeletonPulse key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
