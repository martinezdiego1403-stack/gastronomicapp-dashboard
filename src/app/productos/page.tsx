"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Producto } from "@/lib/types";

function formatMoney(n: number) {
  return `$${n.toLocaleString("es-AR", { minimumFractionDigits: 0 })}`;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Producto[]>("/productos")
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoriaNombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Productos</h2>
          <Badge variant="outline" className="text-zinc-400">
            {productos.length} productos
          </Badge>
        </div>

        <Input
          placeholder="Buscar por nombre o categoria..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-sm bg-zinc-900 border-zinc-800 text-white"
        />

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Lista de productos</CardTitle>
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
                    <TableHead className="text-zinc-400">Nombre</TableHead>
                    <TableHead className="text-zinc-400">Categoria</TableHead>
                    <TableHead className="text-zinc-400 text-right">Precio</TableHead>
                    <TableHead className="text-zinc-400 text-right">Stock</TableHead>
                    <TableHead className="text-zinc-400 text-right">Min.</TableHead>
                    <TableHead className="text-zinc-400">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtrados.map((p) => (
                    <TableRow key={p.productoID} className="border-zinc-800">
                      <TableCell className="text-white font-medium">{p.nombre}</TableCell>
                      <TableCell className="text-zinc-400">{p.categoriaNombre}</TableCell>
                      <TableCell className="text-right text-white">{formatMoney(p.precio)}</TableCell>
                      <TableCell className="text-right text-white">
                        {p.stockActual} {p.unidadMedida}
                      </TableCell>
                      <TableCell className="text-right text-zinc-500">{p.stockMinimo}</TableCell>
                      <TableCell>
                        {p.tieneBajoStock ? (
                          <Badge variant="destructive">Bajo</Badge>
                        ) : (
                          <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                            OK
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtrados.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-zinc-500 py-8">
                        No se encontraron productos
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
