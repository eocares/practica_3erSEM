export interface Producto {
  id?: number; codigo: string; nombre: string; descripcion: string; categoria: string; origen: string;
  precio: number; stock: number; activo: boolean;
  fechaCreacion?: string; fechaActualizacion?: string | null; fechaEliminacion?: string | null; fechaRestauracion?: string | null;
}
