# Tostaduría Andina — Maestro (producto) + Transaccional (venta)

Stack: **SQL Server 2022 · Spring Boot 3 (Java 17) · Angular 18**, cada capa en su propio contenedor y su propia EC2.

```
Internet ──80──> [EC2-FRONT nginx+Angular] ──8080 (IP privada)──> [EC2-BACK Spring Boot] ──1433 (IP privada)──> [EC2-DB SQL Server]
```

## 1. Despliegue en AWS (RCO)

Crear 3 EC2 (Ubuntu 22.04, misma VPC) con Docker instalado (`sudo apt install -y docker.io`). Anotar las **IP privadas**: `IP_DB`, `IP_BACK`.

**Security Groups** (clave: se referencia el SG de origen, no `0.0.0.0/0`)

| SG | Puerto | Origen | Público |
|----|--------|--------|---------|
| sg-front | 80 (HTTP) | 0.0.0.0/0 | Sí |
| sg-front | 22 (SSH) | tu IP /32 | No |
| sg-back | 8080 | sg-front | **No** |
| sg-db | 1433 | sg-back | **No** |
| sg-back / sg-db | 22 | tu IP /32 o sg-front (bastión) | No |

**Orden de arranque**

```bash
# EC2-DB
cd db && docker build -t cafe-db .
docker run -d --name cafe-db --restart always -p 1433:1433 -e MSSQL_SA_PASSWORD='Cafe_Pass123!' cafe-db

# EC2-BACK   (IP_DB = IP privada de la EC2-DB)
cd backend && docker build -t cafe-back .
docker run -d --name cafe-back --restart always -p 8080:8080 -e DB_HOST=IP_DB -e DB_PASSWORD='Cafe_Pass123!' cafe-back

# EC2-FRONT  (IP_BACK = IP privada de la EC2-BACK)
cd frontend && docker build -t cafe-front .
docker run -d --name cafe-front --restart always -p 80:80 -e BACKEND_HOST=IP_BACK cafe-front
```

El navegador **solo** conoce la EC2-FRONT: Nginx reenvía `/api/*` a `http://IP_BACK:8080`, por eso el backend no necesita ser público.
Verificación: `http://IP_PUBLICA_FRONT/productos` carga la lista; `telnet IP_PUBLICA_BACK 8080` y `telnet IP_PUBLICA_DB 1433` deben fallar.
Swagger (solo por túnel SSH o desde sg-front): `http://IP_BACK:8080/swagger-ui.html`.

Prueba local: `docker compose -f docker-compose.local.yml up --build` → http://localhost

## 2. Base de datos (PBD) — decisiones de diseño físico

| Tabla | Tipo | Rol |
|-------|------|-----|
| `producto` | **Maestro** | Catálogo estable que cambia poco; 13 columnas (12 funcionales + `id`) |
| `venta` | **Transaccional** | Hechos que crecen con el tiempo; referencia al maestro |

- **Cadena**: `VARCHAR(n)` con límite según el dato (código 20, nombre 100, descripción 255). `codigo` es `UNIQUE` (clave natural).
- **Número entero**: `INT` en `stock` y `cantidad`, con `CHECK (>= 0 / > 0)`.
- **Decimal**: `DECIMAL(10,2)` en precios y `DECIMAL(12,2)` en `total`; nunca `FLOAT` para dinero.
- **Booleano**: `BIT` en `activo` y `pagado`, con `DEFAULT`.
- **Fecha**: `DATETIME2` en auditoría y `fecha_venta`.
- **Relación**: `venta.producto_id → producto.id` (1:N) con `FOREIGN KEY` e índice `ix_venta_producto`.
- **Auditoría (4 campos)**: `fecha_creacion`, `fecha_actualizacion`, `fecha_eliminacion`, `fecha_restauracion`. Eliminación **lógica** para no romper la FK con ventas históricas.
- Cada tabla trae 10 registros de prueba (`db/init.sql`).

**CRUD del maestro** (demo con Swagger o Postman): `POST /api/productos` · `GET /api/productos` · `PUT /api/productos/{id}` · `DELETE /api/productos/{id}` · `GET /api/productos/eliminados` · `PATCH /api/productos/{id}/restaurar`.
**Transaccional**: `POST /api/ventas` valida stock, calcula `total` con el precio vigente y descuenta stock en una sola transacción.

## 3. Backend (TSW)
Paquetes `model · repository · service · rest` en `pe.edu.cafeteria`. Swagger en `/swagger-ui.html`.

## 4. Frontend (PFE)
Arquitectura por features: `core/` (modelos y servicios), `shared/` (navbar, footer), `features/landing`, `features/productos`.
Landing: Navbar, Hero, Servicios, Nosotros, CTA, Contacto y Footer. `ProductoService` consume la API; la vista lista los registros y permite crear, editar, eliminar y restaurar.
> Si tu docente exige exactamente la estructura del repositorio de referencia, mueve las carpetas manteniendo las rutas de importación.

## 5. GitFlow y Conventional Commits (ADS)
Repositorios `cafeteria-backend` y `cafeteria-frontend` (o uno con carpetas).

```bash
git init && git checkout -b main && git commit --allow-empty -m "chore: init repo"
git checkout -b develop
git checkout -b feature/<integrante>-producto-crud develop   # una por integrante y por capa (be / fe)
# ...trabajo...
git commit -m "feat(producto): add soft delete endpoint"
git checkout develop && git merge --no-ff feature/<integrante>-producto-crud
git checkout -b release/1.0.0 develop && git checkout main && git merge --no-ff release/1.0.0 && git tag v1.0.0
```
Formato de commit: `tipo(alcance): descripción` — `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
Ejemplos: `feat(be): add venta service with stock validation` · `feat(fe): add productos list and form` · `docs: add aws deployment guide`.
Cada integrante agrega **su propio maestro + transaccional** con la misma estructura (copiar el patrón producto/venta).
