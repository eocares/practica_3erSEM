import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing', standalone: true, imports: [RouterLink],
  template: `
  <section class="hero">
    <h1>Del cafetal a tu taza, con el nombre del productor.</h1>
    <p>Tostamos cada lote en Lima y registramos su origen, precio y stock en un solo catálogo.</p>
    <a routerLink="/productos" class="btn">Ver catálogo</a>
  </section>
  <section id="servicios" class="sec"><h2>Servicios</h2>
    <div class="grid">
      <article><h3>Venta de café en grano</h3><p>Especial, espresso, filtrado, orgánico y descafeinado.</p></article>
      <article><h3>Suministro a cafeterías</h3><p>Pedidos recurrentes con precio por volumen.</p></article>
      <article><h3>Catas guiadas</h3><p>Sesiones de degustación por origen para equipos y clientes.</p></article>
    </div></section>
  <section id="nosotros" class="sec alt"><h2>Nosotros</h2>
    <p class="narrow">Somos un equipo de tostadores que trabaja con cooperativas de Cusco, Cajamarca, Junín, Amazonas, San Martín y Puno. Compramos por lote y tostamos por pedido.</p></section>
  <section class="cta"><h2>¿Tienes una cafetería?</h2><p>Escríbenos y te armamos una propuesta de suministro.</p><a href="#contacto" class="btn">Pedir propuesta</a></section>
  <section id="contacto" class="sec"><h2>Contacto</h2>
    <p>ventas&#64;tostaduriaandina.pe · +51 1 555 0123 · Av. Larco 1200, Miraflores, Lima</p></section>`
})
export class LandingComponent {}
