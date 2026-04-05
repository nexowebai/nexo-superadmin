import { useState, useMemo, useCallback } from "react";
import { MOCK_PAYMENTS, MOCK_PAYMENT_STATS } from "../constants/paymentData";
import notify from "@utils/notify";

export function usePayments() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [chartView, setChartView] = useState("revenue");
  const [usageView, setUsageView] = useState("usage");

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      notify.success("Transactions synchronized");
    }, 800);
  }, []);

  const filteredPayments = useMemo(() => {
    return MOCK_PAYMENTS.filter((payment) => {
      if (status && payment.status !== status) return false;
      if (plan && payment.plan.toLowerCase() !== plan) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          payment.organization_name.toLowerCase().includes(searchLower) ||
          payment.org_code.toLowerCase().includes(searchLower) ||
          payment.invoice_id.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [search, status, plan]);

  return {
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
    stats: MOCK_PAYMENT_STATS,
  };
}
