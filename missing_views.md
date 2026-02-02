# Vistas Faltantes en Frontend (Basado en el Backend)

Tras analizar la documentación de los endpoints suministrada y la estructura actual del proyecto, se han identificado las siguientes vistas que faltan por implementar para aprovechar al máximo la funcionalidad existente en el Backend.

## 1. Gestión de Categorías (Admin)

**Vista Faltante:** `src/views/admin/AdminCategoriesView.vue`

- **Funcionalidad Backend:**
  - `POST /api/categories` (Crear categoría)
  - `PUT /api/categories/{id}` (Actualizar categoría)
  - `DELETE /api/categories/{id}` (Eliminar categoría)
- **Justificación:**
  - Actualmente existe `AdminProductsView` para productos, pero no hay interfaz para que el administrador cree o edite las categorías (ej: "Micrófonos", "Interfaces"). Sin esta vista, el administrador no puede gestionar la estructura del catálogo.

## 2. Gestión de Tickets de Monitoreo/Soporte (Admin)

**Vista Faltante:** `src/views/admin/AdminTicketsView.vue`

- **Funcionalidad Backend:**
  - `GET /api/tickets` (Listar todos los tickets)
  - `GET /api/tickets/{id}` (Ver detalle)
  - `PUT /api/tickets/{id}/status` (Actualizar estado)
  - `DELETE /api/tickets/{id}/delete` (Eliminar ticket)
- **Justificación:**
  - El backend tiene un sistema completo de "Tickets de Monitoreo" (`MonitoringTicket`). No existe ninguna vista en el panel de administración (`src/views/admin`) para que el equipo de soporte pueda ver, responder o cerrar estos tickets. Solo existe la vista de usuario para crearlos.

## 3. Proceso de Pago (Checkout)

**Vista Faltante:** `src/views/shop/CheckoutView.vue`

- **Funcionalidad Backend:**
  - `POST /api/orders/create-from-cart` (Crear orden desde el carrito)
- **Justificación:**
  - Aunque existe `CartView` (Carrito), se necesita una vista intermedia antes de confirmar la compra donde el usuario:
    1.  Seleccione/Cree una dirección de envío (`Address`).
    2.  Revise el resumen final con impuestos.
    3.  Ejecute la acción final de compra que llama al endpoint `create-from-cart`.
  - Actualmente el flujo parece saltar o no estar definido claramente desde el carrito hacia la orden completada.

## 4. Gestión de Direcciones (Admin - Opcional)

**Vista Faltante:** `src/views/admin/AdminAddressesView.vue`

- **Funcionalidad Backend:**
  - `GET /api/address` (Listar todas las direcciones - Solo Admin)
- **Justificación:**
  - Existe un endpoint explícito para administradores para listar _todas_ las direcciones. Esto podría integrarse dentro de `AdminClientsView`, pero si el requerimiento es tener un control geográfico o logístico global, faltaría esta vista tabular.

## Resumen de Estructura Sugerida

```text
src/views/
├── admin/
│   ├── AdminCategoriesView.vue  <-- [NUEVA] CRUD Categorías
│   ├── AdminTicketsView.vue     <-- [NUEVA] Gestión de Soporte
│   └── ...
└── shop/
    ├── CheckoutView.vue         <-- [NUEVA] Pasarela de compra previa
    └── ...
```
