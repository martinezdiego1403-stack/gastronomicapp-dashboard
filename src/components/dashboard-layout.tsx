"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/productos", label: "Productos", icon: "🍔" },
  { href: "/ventas", label: "Ventas", icon: "🛒" },
  { href: "/reportes", label: "Reportes", icon: "📈" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, usuario, tenant, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-4">
          <h1 className="text-lg font-bold text-white">GastronomiApp</h1>
          <p className="text-xs text-zinc-400 mt-1">{tenant?.nombreNegocio}</p>
          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
            {tenant?.plan}
          </span>
        </div>

        <Separator className="bg-zinc-800" />

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <Separator className="bg-zinc-800" />

        <div className="p-4">
          <p className="text-sm text-zinc-400">{usuario?.nombreCompleto}</p>
          <p className="text-xs text-zinc-500">{usuario?.rol}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-full text-zinc-400 hover:text-red-400"
            onClick={() => { logout(); router.push("/login"); }}
          >
            Cerrar sesion
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
