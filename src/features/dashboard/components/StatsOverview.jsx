import { motion } from "framer-motion";
import { StatsCard, StatsGrid } from "@components/common";
import { CardSkeleton } from "@components/ui/Card/Card";

const StatsOverview = ({ loading, metrics }) => {
    return (
        <StatsGrid>
            {loading
                ? [1, 2, 3, 4].map(i => <CardSkeleton key={i} height={120} />)
                : metrics.map(metric => (
                    <StatsCard
                        key={metric.key}
                        icon={metric.icon}
                        title={metric.label}
                        value={metric.value}
                        trend={metric.trend}
                        color={metric.color}
                        delay={metric.delay}
                    />
                ))}
        </StatsGrid>
    );
};

export default StatsOverview;
