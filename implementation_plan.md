# Plan de Implementación - Nuevas Vistas Frontend

Este plan detalla las fases para implementar las vistas faltantes identificadas, asegurando que el Frontend cubra el 100% de las capacidades actuales del Backend.

## Fase 1: Flujo de Compra (Checkout)

**Objetivo**: Cerrar el ciclo de venta permitiendo al usuario transformar su Carrito en una Orden de Compra.
**Prioridad**: Crítica (Bloqueante para el flujo de usuario).

### Tareas

1.  **Definición de Tipos**: Agregar interfaces `Address` y `PurchaseOrder` en `src/types/index.ts`.
2.  **Servicios**: Implementar métodos en `src/services/api.ts` para:
    - `GET /api/address` (Listar mis direcciones).
    - `POST /api/address` (Crear dirección).
    - `POST /api/orders/create-from-cart`.
3.  **Vista Checkout (`src/views/shop/CheckoutView.vue`)**:
    - Diseño en 3 pasos: Resumen -> Selección de Dirección -> Confirmación.
    - Formulario integrado para nueva dirección.
    - Botón final "Pagar / Confirmar Orden".
4.  **Enrutamiento**: Agregar ruta `/checkout` en `src/router/index.ts` (protegida por autenticación si aplica, o manejo de sesión anónima).

## Fase 2: Gestión de Catálogo (Admin)

**Objetivo**: Permitir al administrador gestionar la estructura del e-commerce sin depender de base de datos directa.
**Prioridad**: Alta.

### Tareas

1.  **Servicios**: Implementar CRUD de categorías en `src/services/api.ts`:
    - `GET`, `POST`, `PUT`, `DELETE` para `/api/categories`.
2.  **Vista Admin Categorías (`src/views/admin/AdminCategoriesView.vue`)**:
    - Tabla de categorías existentes.
    - Modal/Formulario para crear y editar (Nombre, Descripción).
    - Botón de eliminar con confirmación.
3.  **Enrutamiento**: Agregar ruta `/admin/categories`.

## Fase 3: Soporte y Monitoreo (Admin)

**Objetivo**: Dotar al equipo de soporte de herramientas para atender los tickets generados por los usuarios.
**Prioridad**: Media.

### Tareas

1.  **Tipos**: Agregar interface `SupportTicket` y `MonitoringTicket`.
2.  **Servicios**: Métodos para:
    - `GET /api/tickets` (Listar).
    - `PUT /api/tickets/{id}/status` (Cambiar estado).
    - `DELETE /api/tickets/{id}/delete`.
3.  **Vista Admin Tickets (`src/views/admin/AdminTicketsView.vue`)**:
    - Tabla con filtros por estado (Abierto, Cerrado, En Progreso).
    - Visualización de detalles del ticket.
    - Acciones rápidas de cambio de estado.
4.  **Enrutamiento**: Agregar ruta `/admin/tickets`.

## Fase 4: Auditoría de Direcciones (Admin - Opcional)

**Objetivo**: Visualización global de la logística user-base.
**Prioridad**: Baja.

### Tareas

1.  **Servicios**: `GET /api/address` (Admin mode).
2.  **Vista Admin Direcciones (`src/views/admin/AdminAddressesView.vue`)**:
    - Tabla de solo lectura con todas las direcciones registradas.
    - Buscador por usuario o ciudad.
3.  **Enrutamiento**: Agregar ruta `/admin/addresses`.

---

## Próximos Pasos (Validación)

Una vez aprobado este plan, comenzaremos secuencialmente con la **Fase 1**.
Requeriremos validar con el backend si el endpoint `/api/address` para usuarios devuelve solo las direcciones propias (esperado) versus el de admin que devuelve todas.
