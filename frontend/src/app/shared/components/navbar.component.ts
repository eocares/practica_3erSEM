import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar', standalone: true, imports: [RouterLink],
  template: `
  <header class="nav"><a routerLink="/" class="brand">Tostaduría Andina</a>
    <nav><a routerLink="/" fragment="servicios">Servicios</a><a routerLink="/" fragment="nosotros">Nosotros</a>
      <a routerLink="/" fragment="contacto">Contacto</a><a routerLink="/productos" class="btn">Gestionar catálogo</a></nav></header>`
})
export class NavbarComponent {}
