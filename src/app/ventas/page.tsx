"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { Venta } from "@/lib/types";

function formatMoney(n: number) {
  return `$${n.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`;
}

const metodoPagoColor: Record<string, string> = {
  Efectivo: "bg-green-500/20 text-green-400",
  Tarjeta: "bg-blue-500/20 text-blue-400",
  Transferencia: "bg-purple-500/20 text-purple-400",
};

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Venta[]>("/ventas/del-dia")
      .then(setVentas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = ventas.reduce((sum, v) => sum + v.total, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Ventas del dia</h2>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-400">{formatMoney(total)}</p>
            <p className="text-xs text-zinc-500">{ventas.length} ventas</p>
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Historial de hoy</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-zinc-800" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400">#</TableHead>
                    <TableHead className="text-zinc-400">Hora</TableHead>
                    <TableHead className="text-zinc-400">Vendedor</TableHead>
                    <TableHead className="text-zinc-400">Metodo</TableHead>
                    <TableHead className="text-zinc-400">Items</TableHead>
                    <TableHead className="text-zinc-400 text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ventas.map((v) => (
                    <TableRow key={v.ventaID} className="border-zinc-800">
                      <TableCell className="text-zinc-500">{v.ventaID}</TableCell>
                      <TableCell className="text-white">
                        {new Date(v.fechaVenta).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="text-zinc-400">{v.usuarioNombre}</TableCell>
                      <TableCell>
                        <Badge className={metodoPagoColor[v.metodoPago] || "bg-zinc-700 text-zinc-300"}>
                          {v.metodoPago}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {v.detalles?.length || 0} items
                      </TableCell>
                      <TableCell className="text-right text-white font-medium">
                        {formatMoney(v.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {ventas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                        No hay ventas hoy
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
