"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UsuarioInfo, TenantInfo } from "./types";

interface AuthState {
  token: string | null;
  usuario: UsuarioInfo | null;
  tenant: TenantInfo | null;
  isAuthenticated: boolean;
  login: (token: string, usuario: UsuarioInfo, tenant: TenantInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<UsuarioInfo | null>(null);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    const savedUser = localStorage.getItem("usuario");
    const savedTenant = localStorage.getItem("tenant");
    if (saved && savedUser) {
      setToken(saved);
      setUsuario(JSON.parse(savedUser));
      if (savedTenant) setTenant(JSON.parse(savedTenant));
    }
  }, []);

  const login = (t: string, u: UsuarioInfo, te: TenantInfo) => {
    localStorage.setItem("token", t);
    localStorage.setItem("usuario", JSON.stringify(u));
    localStorage.setItem("tenant", JSON.stringify(te));
    setToken(t);
    setUsuario(u);
    setTenant(te);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("tenant");
    setToken(null);
    setUsuario(null);
    setTenant(null);
  };

  return (
    <AuthContext.Provider value={{ token, usuario, tenant, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
