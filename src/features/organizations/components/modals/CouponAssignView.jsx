import React from "react";
import { Tag, ChevronLeft } from "lucide-react";
import { Button, Select } from "@components/ui";

export function CouponAssignView({ filter, setFilter, available, assigned, onBack, onAdd }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="secondary" size="sm" icon={ChevronLeft} className="text-xs font-semibold" onClick={onBack}>Back</Button>
        <Select 
          className="w-48 text-xs" 
          value={filter} 
          onChange={setFilter} 
          options={[
            { label: "All Coupons", value: "all" }, 
            { label: "Monthly Plan", value: "monthly" }, 
            { label: "Yearly Plan", value: "yearly" }
          ]} 
        />
      </div>
      <div className="grid grid-cols-1 gap-3">
        {available.map((coupon) => {
          const isAssigned = assigned.find((c) => c.code === coupon.code);
          return (
            <div key={coupon.id} className={`coupon-item-card ${isAssigned ? "coupon-item-assigned" : "shadow-sm"}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isAssigned ? "bg-subtle text-muted" : "bg-[var(--primary-soft)] text-[var(--primary)]"}`}>
                  <Tag size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary">{coupon.code}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-secondary">{coupon.discount} Off</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${coupon.type === "Monthly" ? "bg-[var(--info-soft)] text-[var(--info)]" : "bg-[var(--primary-soft)] text-[var(--primary)]"}`}>
                      {coupon.type}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant={isAssigned ? "secondary" : "primary"} 
                size="sm" 
                disabled={isAssigned} 
                className="px-6 font-semibold text-xs" 
                onClick={() => onAdd(coupon)}
              >
                {isAssigned ? "Assigned" : "Assign"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
