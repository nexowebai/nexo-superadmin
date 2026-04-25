import { useEffect } from "react";
import { useLayout } from "@context";
import { PageContainer } from "@components/layout/DashboardLayout";
import { StatsCard, StatsGrid } from "@components/common";
import { usePayments } from "../hooks/usePayments";
import { RevenueVelocityChart } from "../components/RevenueVelocityChart";
import { SubscriptionDensityChart } from "../components/SubscriptionDensityChart";
import { PaymentTable } from "../components/PaymentTable";
import { PaymentDetailModal } from "../components/PaymentDetailModal";

import "./PaymentsPage.css";

function PaymentsPage() {
  const { setHeaderProps } = useLayout();
  const {
    loading,
    search,
    setSearch,
    status,
    setStatus,
    plan,
    setPlan,
    selectedPayment,
    setSelectedPayment,
    chartView,
    setChartView,
    usageView,
    setUsageView,
    handleRefresh,
    filteredPayments,
    stats,
  } = usePayments();

  useEffect(() => {
    setHeaderProps({
      title: "Payments & Invoices",
      action: null,
    });

    return () => setHeaderProps({ title: "", action: null });
  }, [setHeaderProps]);

  return (
    <PageContainer className="payments-v2 pb-12">
      <div className="payments-container-nx">
        {/* 1. Operational Telemetry */}
        <div className="mb-8">
          <StatsGrid columns={4}>
            {stats.map((stat, i) => (
              <StatsCard key={i} {...stat} loading={loading} />
            ))}
          </StatsGrid>
        </div>

        {/* 2. Analytical Intelligence Layer */}
        <div className="analytics-grid-nx mb-8">
          <RevenueVelocityChart
            chartView={chartView}
            setChartView={setChartView}
          />
          <SubscriptionDensityChart
            usageView={usageView}
            setUsageView={setUsageView}
          />
        </div>

        {/* 3. Transactional Audit Layer */}
        <PaymentTable
          data={filteredPayments}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          status={status}
          setStatus={setStatus}
          plan={plan}
          setPlan={setPlan}
          onRefresh={handleRefresh}
          onViewDetail={setSelectedPayment}
        />

        {/* 4. Detail Audit Inspector */}
        <PaymentDetailModal
          payment={selectedPayment}
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      </div>
    </PageContainer>
  );
}

export default PaymentsPage;
