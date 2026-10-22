import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-productos', standalone: true, imports: [ReactiveFormsModule, DatePipe, DecimalPipe],
  template: `
  <section class="sec">
    <h2>Catálogo de café</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()" class="form">
      <input formControlName="codigo" placeholder="Código (CAF-011)">
      <input formControlName="nombre" placeholder="Nombre">
      <input formControlName="descripcion" placeholder="Descripción">
      <select formControlName="categoria">
        @for (c of categorias; track c) { <option>{{ c }}</option> }
      </select>
      <input formControlName="origen" placeholder="Origen">
      <input type="number" step="0.01" formControlName="precio" placeholder="Precio S/">
      <input type="number" formControlName="stock" placeholder="Stock">
      <label><input type="checkbox" formControlName="activo"> Activo</label>
      <button class="btn" [disabled]="form.invalid">{{ editandoId ? 'Guardar cambios' : 'Registrar producto' }}</button>
      @if (editandoId) { <button type="button" class="btn ghost" (click)="cancelar()">Cancelar</button> }
    </form>
    @if (error) { <p class="err">{{ error }}</p> }

    <div class="tabs">
      <button [class.on]="!verEliminados" (click)="cambiar(false)">Activos ({{ lista.length }})</button>
      <button [class.on]="verEliminados" (click)="cambiar(true)">Eliminados</button>
    </div>
    <div class="scroll"><table>
      <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Origen</th><th>Precio</th><th>Stock</th><th>Activo</th><th>Creado</th><th></th></tr></thead>
      <tbody>
        @for (p of lista; track p.id) {
          <tr><td>{{ p.codigo }}</td><td>{{ p.nombre }}</td><td>{{ p.categoria }}</td><td>{{ p.origen }}</td>
            <td>S/ {{ p.precio | number:'1.2-2' }}</td><td>{{ p.stock }}</td><td>{{ p.activo ? 'Sí' : 'No' }}</td>
            <td>{{ p.fechaCreacion | date:'dd/MM/yyyy HH:mm' }}</td>
            <td class="acc">
              @if (!verEliminados) { <button (click)="editar(p)">Editar</button><button (click)="eliminar(p)">Eliminar</button> }
              @else { <button (click)="restaurar(p)">Restaurar</button> }
            </td></tr>
        } @empty { <tr><td colspan="9">No hay productos en esta lista.</td></tr> }
      </tbody></table></div>
  </section>`
})
export class ProductosComponent implements OnInit {
  private api = inject(ProductoService);
  private fb = inject(FormBuilder);
  categorias = ['Especial', 'Espresso', 'Filtrado', 'Orgánico', 'Descafeinado'];
  lista: Producto[] = []; verEliminados = false; editandoId: number | null = null; error = '';
  form = this.fb.nonNullable.group({
    codigo: ['', Validators.required], nombre: ['', Validators.required], descripcion: [''],
    categoria: ['Especial', Validators.required], origen: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0.01)]], stock: [0, [Validators.required, Validators.min(0)]],
    activo: [true]
  });

  ngOnInit() { this.cargar(); }
  cargar() { (this.verEliminados ? this.api.eliminados() : this.api.listar()).subscribe(d => this.lista = d); }
  cambiar(v: boolean) { this.verEliminados = v; this.cargar(); }
  guardar() {
    const datos = this.form.getRawValue() as Producto;
    const op = this.editandoId ? this.api.editar(this.editandoId, datos) : this.api.crear(datos);
    op.subscribe({ next: () => { this.cancelar(); this.cargar(); }, error: e => this.error = e.error?.message ?? 'No se pudo guardar. Revisa los campos.' });
  }
  editar(p: Producto) { this.editandoId = p.id!; this.form.patchValue(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  cancelar() { this.editandoId = null; this.error = ''; this.form.reset({ categoria: 'Especial', precio: 0, stock: 0, activo: true }); }
  eliminar(p: Producto) { this.api.eliminar(p.id!).subscribe(() => this.cargar()); }
  restaurar(p: Producto) { this.api.restaurar(p.id!).subscribe(() => this.cargar()); }
}
