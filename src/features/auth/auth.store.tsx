import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "./auth.types";
import { bootstrapAuth } from "./auth.bootstrap";
import { registerLogoutHandler } from "@/lib/api";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, access: string) => void;
  clearAuth: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuth = (user: User, access: string) => {
    setUser(user);
    setAccessTokenState(access);
  };

  const clearAuth = () => {
    setUser(null);
    setAccessTokenState(null);
    localStorage.removeItem("refresh_token");
  };

  useEffect(() => {
    registerLogoutHandler(() => {
      clearAuth();
      window.location.href = "/login";
    });
  }, []);

  // 🔥 BOOTSTRAP SESSION ON APP LOAD
  useEffect(() => {
    async function init() {
      await bootstrapAuth(setAuth, clearAuth);
      setLoading(false);
    }

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, setAuth, clearAuth, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
}
