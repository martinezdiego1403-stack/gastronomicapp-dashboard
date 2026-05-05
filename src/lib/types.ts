// Auth
export interface LoginRequest {
  NombreUsuario: string;
  Contrasena: string;
}

export interface LoginResponse {
  exitoso: boolean;
  token: string;
  mensaje: string;
  usuario: UsuarioInfo;
  tenant: TenantInfo;
}

export interface UsuarioInfo {
  usuarioID: number;
  nombreUsuario: string;
  nombreCompleto: string;
  rol: string;
  email: string;
}

export interface TenantInfo {
  tenantId: string;
  nombreNegocio: string;
  plan: string;
  activo: boolean;
  diasRestantesTrial: number;
  trialExpirado: boolean;
}

// Productos
export interface Producto {
  productoID: number;
  categoriaID: number;
  nombre: string;
  descripcion: string;
  codigoBarras: string;
  precio: number;
  stockActual: number;
  stockMinimo: number;
  unidadMedida: string;
  activo: boolean;
  categoriaNombre: string;
  tieneBajoStock: boolean;
}

// Categorias
export interface Categoria {
  categoriaID: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  tipoCategoria: string;
}

// Ventas
export interface Venta {
  ventaID: number;
  cajaID: number;
  usuarioID: number;
  usuarioNombre: string;
  fechaVenta: string;
  total: number;
  metodoPago: string;
  observaciones: string;
  detalles: DetalleVenta[];
}

export interface DetalleVenta {
  detalleVentaID: number;
  productoID: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  nombreReceta: string;
  esReceta: boolean;
}

// Reportes
export interface VentaPorDia {
  fecha: string;
  totalVentas: number;
  cantidadVentas: number;
}

export interface ProductoMasVendido {
  nombreProducto: string;
  cantidadVendida: number;
  totalVentas: number;
  display: string;
}

export interface VentaPorMetodoPago {
  metodoPago: string;
  cantidadVentas: number;
  totalVentas: number;
  porcentaje: number;
}

export interface VentaPorCategoria {
  categoria: string;
  cantidadVendida: number;
  totalVentas: number;
  porcentaje: number;
}
