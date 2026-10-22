IF DB_ID('cafeteria') IS NULL CREATE DATABASE cafeteria;
GO
USE cafeteria;
GO
-- MAESTRO: producto (cafe en grano). Eliminacion logica via fecha_eliminacion.
IF OBJECT_ID('venta') IS NOT NULL DROP TABLE venta;
IF OBJECT_ID('producto') IS NOT NULL DROP TABLE producto;
GO
CREATE TABLE producto (
  id                   INT IDENTITY(1,1) CONSTRAINT pk_producto PRIMARY KEY,
  codigo               VARCHAR(20)   NOT NULL CONSTRAINT uq_producto_codigo UNIQUE,
  nombre               VARCHAR(100)  NOT NULL,
  descripcion          VARCHAR(255)  NULL,
  categoria            VARCHAR(50)   NOT NULL,
  origen               VARCHAR(60)   NOT NULL,
  precio               DECIMAL(10,2) NOT NULL CONSTRAINT ck_producto_precio CHECK (precio > 0),
  stock                INT           NOT NULL CONSTRAINT df_producto_stock DEFAULT 0 CONSTRAINT ck_producto_stock CHECK (stock >= 0),
  activo               BIT           NOT NULL CONSTRAINT df_producto_activo DEFAULT 1,
  fecha_creacion       DATETIME2     NOT NULL CONSTRAINT df_producto_fc DEFAULT SYSDATETIME(),
  fecha_actualizacion  DATETIME2     NULL,
  fecha_eliminacion    DATETIME2     NULL,
  fecha_restauracion   DATETIME2     NULL
);
-- TRANSACCIONAL: venta (1 producto : N ventas)
CREATE TABLE venta (
  id              INT IDENTITY(1,1) CONSTRAINT pk_venta PRIMARY KEY,
  producto_id     INT           NOT NULL CONSTRAINT fk_venta_producto FOREIGN KEY REFERENCES producto(id),
  cliente         VARCHAR(100)  NOT NULL,
  cantidad        INT           NOT NULL CONSTRAINT ck_venta_cantidad CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL,
  total           DECIMAL(12,2) NOT NULL,
  pagado          BIT           NOT NULL CONSTRAINT df_venta_pagado DEFAULT 0,
  fecha_venta     DATETIME2     NOT NULL CONSTRAINT df_venta_fecha DEFAULT SYSDATETIME()
);
CREATE INDEX ix_venta_producto ON venta(producto_id);
GO
INSERT INTO producto (codigo,nombre,descripcion,categoria,origen,precio,stock) VALUES
('CAF-001',N'Geisha Cusco',N'Notas florales y miel','Especial','Cusco',89.90,25),
('CAF-002',N'Bourbon Cajamarca',N'Chocolate y caramelo','Especial','Cajamarca',54.00,40),
('CAF-003',N'Typica Junín',N'Cítrico y panela','Filtrado',N'Junín',47.50,60),
('CAF-004',N'Caturra Amazonas',N'Frutos rojos','Filtrado','Amazonas',52.00,35),
('CAF-005',N'Catimor San Martín',N'Cuerpo alto, cacao','Espresso',N'San Martín',38.00,80),
('CAF-006',N'Pache Puno',N'Dulce y suave','Espresso','Puno',41.00,55),
('CAF-007',N'Blend Casa',N'Mezcla de la casa','Espresso','Varios',32.00,120),
('CAF-008',N'Descafeinado Cusco',N'Sin cafeína, natural','Descafeinado','Cusco',44.00,30),
('CAF-009',N'Orgánico Chanchamayo',N'Certificado orgánico','Orgánico',N'Junín',58.00,45),
('CAF-010',N'Cold Brew Pack',N'Molienda gruesa para frío','Filtrado','Cajamarca',36.00,70);
INSERT INTO venta (producto_id,cliente,cantidad,precio_unitario,total,pagado) VALUES
(1,'Ana Torres',2,89.90,179.80,1),(2,'Luis Paredes',1,54.00,54.00,1),
(3,N'Café Miraflores',10,47.50,475.00,1),(4,'Rosa Quispe',3,52.00,156.00,0),
(5,'Hotel Centro',20,38.00,760.00,1),(6,'Carlos Rojas',2,41.00,82.00,1),
(7,N'Panadería Sol',15,32.00,480.00,0),(8,N'María Salas',1,44.00,44.00,1),
(9,'Eco Market',6,58.00,348.00,1),(10,'Jorge Vega',4,36.00,144.00,0);
GO
