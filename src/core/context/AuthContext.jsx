import { createContext, useContext, useState, useCallback } from "react";
import sessionService from "@session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(sessionService.getUser() || {
    id: "dev-bypass",
    first_name: "Super",
    last_name: "Admin",
    email: "admin@nexo.com",
    role: "super-admin"
  });
  const [token, setToken] = useState(sessionService.getAccessToken() || "dev-bypass-token");
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Temporary bypass for password recovery


  const login = useCallback((loginData) => {
    const accessToken = loginData?.access_token;
    const userData = loginData?.user;
    const expiresIn = loginData?.expires_in;

    if (!accessToken || !userData) {
      console.error("Invalid login data provided to context");
      return;
    }

    sessionService.setAuthData({
      access_token: accessToken,
      expires_in: expiresIn,
      user: userData,
    });

    setUser(userData);
    setToken(accessToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    sessionService.clearAuthData();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const updateUser = useCallback(
    (updatedUserData) => {
      setUser((prev) => {
        const newUser = { ...prev, ...updatedUserData };
        sessionService.setAuthData({
          access_token: token,
          user: newUser,
        });
        return newUser;
      });
    },
    [token],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
