import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowRight } from "lucide-react";
import { Button, OrganizationCard, Card } from "@components/ui";

const MOCK_ORGS = [
  {
    id: 1,
    name: "Stark Industries",
    business_type: "Tech & Defense",
    status: "active",
    plan: "enterprise",
    user_count: 1240,
    joined_date: "Jan 2024"
  },
  {
    id: 2,
    name: "Wayne Enterprises",
    business_type: "Global Conglomerate",
    status: "active",
    plan: "enterprise",
    user_count: 850,
    joined_date: "Feb 2024"
  },
  {
    id: 3,
    name: "Oscorp Corp",
    business_type: "Biotechnology",
    status: "inactive",
    plan: "pro",
    user_count: 420,
    joined_date: "Mar 2024"
  },
  {
    id: 4,
    name: "LexCorp",
    business_type: "Aerospace",
    status: "active",
    plan: "enterprise",
    user_count: 610,
    joined_date: "Apr 2024"
  }
];

export default function OrganizationGrid() {
  const navigate = useNavigate();

  return (
    <Card variant="nx" padding="none" className="flex flex-col h-full overflow-visible">
      {/* Header Section */}
      <div className="p-6 flex items-center justify-between border-b border-base bg-subtle/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center border border-primary-soft shadow-inner">
            <Building2 size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Active Partners</h2>
            <p className="text-[10px] font-black text-secondary uppercase tracking-widest opacity-70">
              Manage ecosystem entities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="soft"
            size="sm"
            onClick={() => navigate("/organizations")}
            className="font-black group"
            icon={ArrowRight}
            rightIcon
          >
            View All
          </Button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-6 bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_ORGS.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </div>
      </div>
    </Card>
  );
}
