import { Skeleton } from "@components/ui";

export default function FormSkeleton() {
  return (
    <div className="create-form">
      <div className="form-section">
        <div className="form-section-header">
          <Skeleton width="20px" height="20px" borderRadius="4px" />
          <div>
            <Skeleton width="180px" height="20px" />
            <Skeleton width="240px" height="14px" style={{ marginTop: 8 }} />
          </div>
        </div>
        <div className="form-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="form-field">
              <Skeleton width="100px" height="14px" />
              <Skeleton
                width="100%"
                height="42px"
                borderRadius="8px"
                style={{ marginTop: 6 }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
