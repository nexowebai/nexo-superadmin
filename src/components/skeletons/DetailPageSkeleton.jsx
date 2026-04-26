import { Skeleton } from "../ui/Skeleton/Skeleton";

export function DetailPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton width="120px" height="16px" />

      <div className="bg-surface border border-base rounded-md p-6 flex items-center gap-6">
        <Skeleton width="72px" height="72px" borderRadius="var(--radius-md)" />
        <div className="flex-1 space-y-3">
          <Skeleton width="260px" height="28px" />
          <div className="flex gap-3">
            <Skeleton
              width="90px"
              height="20px"
              borderRadius="var(--radius-md)"
            />
            <Skeleton
              width="70px"
              height="20px"
              borderRadius="var(--radius-md)"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton
            width="110px"
            height="40px"
            borderRadius="var(--radius-md)"
          />
          <Skeleton
            width="110px"
            height="40px"
            borderRadius="var(--radius-md)"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface border border-base rounded-md p-5 space-y-3"
          >
            <Skeleton
              width="44px"
              height="44px"
              borderRadius="var(--radius-md)"
            />
            <Skeleton width="60px" height="24px" />
            <Skeleton width="80px" height="12px" />
          </div>
        ))}
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 340px" }} /* allowed-inline */>
        <div className="bg-surface border border-base rounded-md p-6 space-y-5">
          <Skeleton width="160px" height="20px" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton
                width="32px"
                height="32px"
                borderRadius="var(--radius-md)"
              />
              <div className="flex-1 space-y-2">
                <Skeleton width="60px" height="10px" />
                <Skeleton width="140px" height="14px" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-surface border border-base rounded-md p-6 space-y-4">
          <Skeleton width="120px" height="20px" />
          <Skeleton
            width="100%"
            height="40px"
            borderRadius="var(--radius-md)"
          />
          <Skeleton
            width="100%"
            height="40px"
            borderRadius="var(--radius-md)"
          />
          <Skeleton
            width="100%"
            height="40px"
            borderRadius="var(--radius-md)"
          />
        </div>
      </div>
    </div>
  );
}
