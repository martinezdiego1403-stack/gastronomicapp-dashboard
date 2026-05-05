"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { ProductoMasVendido, VentaPorMetodoPago, VentaPorCategoria } from "@/lib/types";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

function formatMoney(n: number) {
  return `$${n.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`;
}

const COLORS = ["#10b981", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4"];

export default function ReportesPage() {
  const [topProductos, setTopProductos] = useState<ProductoMasVendido[]>([]);
  const [porMetodo, setPorMetodo] = useState<VentaPorMetodoPago[]>([]);
  const [porCategoria, setPorCategoria] = useState<VentaPorCategoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hoy = new Date();
    const hace30dias = new Date(hoy);
    hace30dias.setDate(hace30dias.getDate() - 30);

    const fechaInicio = hace30dias.toISOString().split("T")[0];
    const fechaFin = hoy.toISOString().split("T")[0];
    const params = `fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

    Promise.all([
      api.get<ProductoMasVendido[]>(`/reportes/productos-mas-vendidos?${params}&cantidad=8`),
      api.get<VentaPorMetodoPago[]>(`/reportes/ventas-por-metodo-pago?${params}`),
      api.get<VentaPorCategoria[]>(`/reportes/ventas-por-categoria?${params}`),
    ])
      .then(([tp, pm, pc]) => {
        setTopProductos(tp);
        setPorMetodo(pm);
        setPorCategoria(pc);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Reportes (ultimos 30 dias)</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top productos */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Productos mas vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full bg-zinc-800" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProductos} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis type="number" stroke="#a1a1aa" fontSize={12} />
                    <YAxis
                      dataKey="nombreProducto"
                      type="category"
                      stroke="#a1a1aa"
                      fontSize={11}
                      width={120}
                      tick={{ fill: "#a1a1aa" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="cantidadVendida" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Ventas por metodo de pago */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Metodos de pago</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full bg-zinc-800" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={porMetodo}
                      dataKey="totalVentas"
                      nameKey="metodoPago"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent, x, y }) => (
                        <text x={x} y={y} fill="#d4d4d8" fontSize={12} textAnchor="middle">
                          {`${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        </text>
                      )}
                    >
                      {porMetodo.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      formatter={(value) => formatMoney(Number(value))}
                    />
                    <Legend wrapperStyle={{ color: "#a1a1aa" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Ventas por categoria */}
          <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Ventas por categoria</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full bg-zinc-800" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={porCategoria}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="categoria" stroke="#a1a1aa" fontSize={12} />
                    <YAxis stroke="#a1a1aa" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      formatter={(value) => formatMoney(Number(value))}
                    />
                    <Bar dataKey="totalVentas" fill="#a855f7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
