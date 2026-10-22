import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'productos', loadComponent: () => import('./features/productos/productos.component').then(m => m.ProductosComponent) },
  { path: '**', redirectTo: '' }
];
