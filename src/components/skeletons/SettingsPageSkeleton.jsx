import { Skeleton } from "../ui/Skeleton/Skeleton";

export function SettingsPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex gap-3">
        <Skeleton width="160px" height="44px" borderRadius="var(--radius-md)" />
        <Skeleton width="160px" height="44px" borderRadius="var(--radius-md)" />
        <Skeleton width="160px" height="44px" borderRadius="var(--radius-md)" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-base rounded-md p-6 space-y-5">
            <Skeleton width="140px" height="20px" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-base last:border-0"
              >
                <div className="space-y-2">
                  <Skeleton width="120px" height="14px" />
                  <Skeleton width="200px" height="12px" />
                </div>
                <Skeleton
                  width="48px"
                  height="26px"
                  borderRadius="var(--radius-full)"
                />
              </div>
            ))}
          </div>
          <div className="bg-surface border border-base rounded-md p-6 space-y-5">
            <Skeleton width="180px" height="20px" />
            <Skeleton
              width="100%"
              height="200px"
              borderRadius="var(--radius-md)"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-surface border border-base rounded-md p-6 space-y-4">
            <Skeleton width="100px" height="20px" />
            <Skeleton
              width="100%"
              height="380px"
              borderRadius="var(--radius-md)"
            />
          </div>
          <div className="bg-surface border border-base rounded-md p-6 space-y-3">
            <Skeleton width="80px" height="20px" />
            <Skeleton
              width="100%"
              height="80px"
              borderRadius="var(--radius-md)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
