import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@components/ui";

export function CouponListView({ coupons, onAssign, onRevoke }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Active Coupons</h4>
        <Button variant="primary" size="sm" icon={Plus} className="px-4 font-semibold text-xs" onClick={onAssign}>Assign New</Button>
      </div>
      <div className="coupon-list-table">
        <table className="w-full text-sm">
          <thead>
            <tr className="coupon-table-head text-left text-xs font-semibold uppercase tracking-wider">
              <th className="p-4">Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Expiry</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr><td colSpan={4} className="p-10 text-center italic text-muted">No coupons found</td></tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="coupon-table-row last:border-0">
                  <td className="p-4 font-medium text-primary uppercase tracking-wider">{c.code}</td>
                  <td className="p-4 text-secondary">{c.discount}</td>
                  <td className="p-4 text-muted opacity-70">{c.expiry}</td>
                  <td className="p-4 text-right">
                    <Button variant="danger" size="xs" onClick={() => onRevoke(c)} className="px-3">Revoke</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
