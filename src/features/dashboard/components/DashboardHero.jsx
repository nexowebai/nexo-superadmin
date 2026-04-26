import React, { useState, useEffect } from "react";
import { useAuth } from "@context";
import { Sparkles, Calendar } from "lucide-react";
import { DateRangePicker } from "@components/ui";

const DashboardHero = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Extract first name
  const firstName = user?.name ? user.name.split(" ")[0] : "Admin";

  return (
    <div className="dashboard-hero mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={12} />
              <span>Super Admin Console</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-wider">
              <Calendar size={12} />
              <span>
                {formattedDate} • {formattedTime}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
            Hello, <span className="text-[var(--primary)]">{firstName}</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Global system overview and organization performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <DateRangePicker
            align="end"
            onChange={(range) => console.log("Date Range Changed:", range)}
            className="min-w-[240px]"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
