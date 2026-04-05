import { DollarSign, TrendingUp, Clock, XCircle } from "lucide-react";

export const MOCK_PAYMENTS = [
  {
    id: "PAY-001",
    organization_name: "Acme Foundation",
    org_code: "ACM001",
    amount: 2499,
    currency: "USD",
    status: "completed",
    payment_method: "Credit Card",
    card_last4: "4242",
    plan: "Enterprise",
    plan_type: "yearly",
    invoice_id: "INV-2026-001",
    created_at: "2026-01-02T10:30:00Z",
    paid_at: "2026-01-02T10:31:00Z",
  },
  {
    id: "PAY-002",
    organization_name: "Global Health Initiative",
    org_code: "GHI002",
    amount: 999,
    currency: "USD",
    status: "completed",
    payment_method: "Bank Transfer",
    plan: "Professional",
    plan_type: "yearly",
    invoice_id: "INV-2026-002",
    created_at: "2026-01-01T14:20:00Z",
    paid_at: "2026-01-01T16:45:00Z",
  },
  {
    id: "PAY-003",
    organization_name: "EduTech Solutions",
    org_code: "ETS003",
    amount: 99,
    currency: "USD",
    status: "pending",
    payment_method: "Credit Card",
    plan: "Basic",
    plan_type: "monthly",
    invoice_id: "INV-2026-003",
    created_at: "2026-01-03T09:00:00Z",
  },
  {
    id: "PAY-004",
    organization_name: "Research Labs Inc",
    org_code: "RLI004",
    amount: 249,
    currency: "USD",
    status: "failed",
    payment_method: "Credit Card",
    card_last4: "1234",
    plan: "Professional",
    plan_type: "monthly",
    invoice_id: "INV-2026-004",
    created_at: "2025-12-28T11:15:00Z",
    error_message: "Card declined - insufficient funds",
  },
];

export const MOCK_PAYMENT_STATS = [
  {
    title: "Total Revenue",
    value: "$125,680",
    icon: DollarSign,
    trend: 12.5,
    color: "var(--primary)",
  },
  {
    title: "Active Subs",
    value: "1,420",
    icon: TrendingUp,
    trend: 8.4,
    color: "var(--info)",
  },
  {
    title: "Pending",
    value: "$3,850",
    icon: Clock,
    trend: -2.1,
    color: "var(--warning)",
  },
  {
    title: "Failed",
    value: "12",
    icon: XCircle,
    trend: 5.4,
    color: "var(--error)",
  },
];

export const REVENUE_DATA = [
  { name: "Jan", revenue: 12500, expenses: 3400 },
  { name: "Feb", revenue: 15000, expenses: 4398 },
  { name: "Mar", revenue: 18000, expenses: 5800 },
  { name: "Apr", revenue: 21780, expenses: 4908 },
  { name: "May", revenue: 25890, expenses: 6800 },
  { name: "Jun", revenue: 32390, expenses: 7800 },
];

export const PLAN_DISTRIBUTION = [
  { name: "Basic", baseLimit: 10, avgUsage: 8, extraCost: 0 },
  { name: "Pro", baseLimit: 20, avgUsage: 16, extraCost: 0 },
  { name: "Enterprise", baseLimit: 50, avgUsage: 45, extraCost: 50 },
];

export const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

export const PLAN_OPTIONS = [
  { value: "", label: "All Plans" },
  { value: "basic", label: "Basic" },
  { value: "professional", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
];
