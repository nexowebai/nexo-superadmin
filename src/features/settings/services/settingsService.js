import api from "@api";

export const settingsService = {
  getSettings: () => api.get("/system/settings"),
  updateSettings: (data) => api.put("/system/settings", data),
};

export default settingsService;
