"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Producto, Venta, VentaPorDia } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function formatMoney(n: number) {
  return `$${n.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`;
}

export default function DashboardPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventasPorDia, setVentasPorDia] = useState<VentaPorDia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hoy = new Date();
    const hace7dias = new Date(hoy);
    hace7dias.setDate(hace7dias.getDate() - 7);

    const fechaInicio = hace7dias.toISOString().split("T")[0];
    const fechaFin = hoy.toISOString().split("T")[0];

    Promise.all([
      api.get<Venta[]>("/ventas/del-dia"),
      api.get<Producto[]>("/productos"),
      api.get<VentaPorDia[]>(
        `/reportes/ventas-por-dia?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      ),
    ])
      .then(([v, p, vpd]) => {
        setVentas(v);
        setProductos(p);
        setVentasPorDia(vpd);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalHoy = ventas.reduce((sum, v) => sum + v.total, 0);
  const stockBajo = productos.filter((p) => p.tieneBajoStock);

  const chartData = ventasPorDia.map((v) => ({
    dia: new Date(v.fecha).toLocaleDateString("es-AR", { weekday: "short", day: "numeric" }),
    total: v.totalVentas,
    cantidad: v.cantidadVentas,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>

        {/* Metricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Ventas de hoy"
            value={loading ? null : formatMoney(totalHoy)}
            sub={`${ventas.length} transacciones`}
          />
          <MetricCard
            title="Productos activos"
            value={loading ? null : `${productos.filter((p) => p.activo).length}`}
            sub="en el menu"
          />
          <MetricCard
            title="Stock bajo"
            value={loading ? null : `${stockBajo.length}`}
            sub="productos por reponer"
            alert={stockBajo.length > 0}
          />
          <MetricCard
            title="Ticket promedio"
            value={
              loading
                ? null
                : ventas.length > 0
                ? formatMoney(totalHoy / ventas.length)
                : "$0"
            }
            sub="promedio de hoy"
          />
        </div>

        {/* Grafico de ventas */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Ventas ultimos 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full bg-zinc-800" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="dia" stroke="#a1a1aa" fontSize={12} />
                  <YAxis stroke="#a1a1aa" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value) => [formatMoney(Number(value)), "Total"]}
                  />
                  <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Productos con stock bajo */}
        {stockBajo.length > 0 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Alertas de stock bajo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stockBajo.slice(0, 5).map((p) => (
                  <div key={p.productoID} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                    <div>
                      <p className="text-sm text-white">{p.nombre}</p>
                      <p className="text-xs text-zinc-500">{p.categoriaNombre}</p>
                    </div>
                    <Badge variant="destructive">
                      Stock: {p.stockActual} / Min: {p.stockMinimo}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

function MetricCard({
  title,
  value,
  sub,
  alert,
}: {
  title: string;
  value: string | null;
  sub: string;
  alert?: boolean;
}) {
  return (
    <Card className={`bg-zinc-900 border-zinc-800 ${alert ? "border-red-500/50" : ""}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {value === null ? (
          <Skeleton className="h-8 w-24 bg-zinc-800" />
        ) : (
          <p className={`text-2xl font-bold ${alert ? "text-red-400" : "text-white"}`}>
            {value}
          </p>
        )}
        <p className="text-xs text-zinc-500 mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}
