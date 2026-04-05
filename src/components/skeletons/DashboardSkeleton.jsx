import { Skeleton } from "../ui/Skeleton/Skeleton";
import { StatsRowSkeleton } from "./PageSkeletons";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <StatsRowSkeleton count={4} />

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 380px" }}>
        <div className="space-y-6">
          <div className="bg-surface border border-base rounded-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton width="180px" height="22px" />
              <Skeleton
                width="120px"
                height="32px"
                borderRadius="var(--radius-md)"
              />
            </div>
            <Skeleton
              width="100%"
              height="240px"
              borderRadius="var(--radius-md)"
            />
          </div>

          <div className="bg-surface border border-base rounded-md p-6 space-y-4">
            <Skeleton width="160px" height="22px" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-bg-elevated rounded-md p-4 space-y-3"
                >
                  <Skeleton width="120px" height="16px" />
                  <Skeleton width="80px" height="24px" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-base rounded-md p-6 space-y-4">
            <Skeleton width="140px" height="20px" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton
                  width="32px"
                  height="32px"
                  borderRadius="var(--radius-md)"
                />
                <div className="flex-1 space-y-2">
                  <Skeleton width="80%" height="14px" />
                  <Skeleton width="50%" height="12px" />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface border border-base rounded-md p-6 space-y-4">
            <Skeleton width="160px" height="20px" />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton width="8px" height="8px" circle />
                <Skeleton width="70%" height="14px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
