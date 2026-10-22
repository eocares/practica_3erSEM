import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private http = inject(HttpClient);
  private url = '/api/productos';   // Nginx reenvía a la IP privada del backend

  listar(): Observable<Producto[]> { return this.http.get<Producto[]>(this.url); }
  eliminados(): Observable<Producto[]> { return this.http.get<Producto[]>(`${this.url}/eliminados`); }
  crear(p: Producto) { return this.http.post<Producto>(this.url, p); }
  editar(id: number, p: Producto) { return this.http.put<Producto>(`${this.url}/${id}`, p); }
  eliminar(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
  restaurar(id: number) { return this.http.patch<Producto>(`${this.url}/${id}/restaurar`, {}); }
}
