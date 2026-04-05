import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const queryKeys = {
  auth: {
    user: ["auth", "user"],
    session: ["auth", "session"],
  },
  organizations: {
    all: ["organizations"],
    list: (params) => ["organizations", "list", params],
    detail: (id) => ["organizations", "detail", id],
  },
  admins: {
    all: ["admins"],
    list: (params) => ["admins", "list", params],
    detail: (id) => ["admins", "detail", id],
  },
  requests: {
    all: ["requests"],
    list: (params) => ["requests", "list", params],
  },
  users: {
    all: ["users"],
    list: (params) => ["users", "list", params],
  },
  logs: {
    all: ["logs"],
    list: (params) => ["logs", "list", params],
  },
  dashboard: {
    stats: ["dashboard", "stats"],
  },
  settings: {
    system: ["settings", "system"],
  },
  notifications: {
    all: ["notifications"],
    list: (params) => ["notifications", "list", params],
    count: ["notifications", "count"],
  },
  payments: {
    all: ["payments"],
    list: (params) => ["payments", "list", params],
    stats: ["payments", "stats"],
  },
};
