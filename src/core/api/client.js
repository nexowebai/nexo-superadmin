import axios from "axios";
import { toast } from "sonner";
import { APP_CONFIG } from "../config/app";
import { sessionService } from "../auth/sessionService";

const { baseUrl, timeout } = APP_CONFIG.api;

const apiClient = axios.create({
  baseURL: `${baseUrl}/api`,
  timeout: timeout,
  headers: { "Content-Type": "application/json" },
});

let isRedirecting = false;

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionService.getAccessToken();
    const url = config.url || "";
    const isLogin = url.indexOf("/login") !== -1;

    if (token && !isLogin) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const response = error.response;
    const errorData = response ? response.data : null;
    const errorObj = errorData ? errorData.error : null;
    const errorMessage = (errorObj ? errorObj.message : null) || (errorData ? errorData.message : null) || "";

    if (
      errorMessage.toLowerCase().indexOf("invalid token") !== -1 ||
      errorMessage.toLowerCase().indexOf("token expired") !== -1 ||
      errorMessage.toLowerCase().indexOf("jwt expired") !== -1 ||
      (response && response.status === 401)
    ) {
      const config = error.config;
      const configUrl = config ? config.url : "";
      const isLoginRequest = configUrl.indexOf("/login") !== -1;
      const token = sessionService.getAccessToken();

      if (token && (token.indexOf("mock") !== -1 || token.indexOf("sb_") === 0)) {
        console.warn("Suppressing 401 for mock/preview token");
        return Promise.reject(errorData || error);
      }

      if (!isLoginRequest && token && !isRedirecting) {
        isRedirecting = true;
        sessionService.handleSessionExpired(toast);
        return Promise.reject({ handled: true, message: "Session expired" });
      }
    }

    return Promise.reject(errorData || error);
  },
);

export default apiClient;
