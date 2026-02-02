# Análisis de Endpoints Faltantes - Front PodStream

Este documento detalla los endpoints necesarios para cubrir la funcionalidad actual del Frontend que no están presentes en la lista suministrada. Se requiere su implementación para completar la integración dinámica.

## 1. Autenticación (Auth)

Actualmente no existen endpoints para el manejo de sesiones de usuario.
**Prioridad: Alta**

### POST /api/auth/login

- **Descripción**: Inicia sesión y devuelve un token (JWT) o cookie de sesión, junto con la información básica del usuario.
- **Argumentos (Body)**:
  - `email` (string): Correo del usuario.
  - `password` (string): Contraseña.
- **Respuesta Esperada**: Objeto con `token` y `user` (id, name, email, role).

### POST /api/auth/register

- **Descripción**: Registra un nuevo usuario en la plataforma.
- **Argumentos (Body)**:
  - `name` (string): Nombre completo.
  - `email` (string): Correo electrónico.
  - `password` (string): Contraseña.
  - `address` (string, opcional): Dirección inicial.
- **Respuesta Esperada**: Usuario creado o confirmación de registro.

### GET /api/auth/me

- **Descripción**: Obtiene el perfil del usuario actualmente autenticado (basado en el token/header). Necesario para recargar la página y mantener la sesión.
- **Argumentos**: Headers de autenticación.
- **Respuesta Esperada**: Datos del usuario (`id`, `name`, `email`, `role`, `avatar`).

---

## 2. Soporte y Contacto

Necesario para `SupportView.vue` y `ContactView.vue`.
Actualmente existe `/api/support-tickets/create`, pero faltan endpoints para el usuario final y contacto general.

### POST /api/contact/send

- **Descripción**: Envía un mensaje desde el formulario de contacto público (`ContactView`). No requiere autenticación.
- **Argumentos (Body)**:
  - `name` (string): Nombre.
  - `email` (string): Correo.
  - `subject` (string): Asunto.
  - `message` (string): Mensaje.
- **Respuesta Esperada**: Confirmación de envío (200 OK).

### GET /api/support/my-tickets (User)

- **Descripción**: Permite al usuario ver el estado de sus tickets enviados desde `SupportView`.
- **Roles**: Person.
- **Respuesta Esperada**: Lista de tickets (`id`, `subject`, `status`, `createdAt`, `response`).

---

## 3. Foro (Comunidad)

Necesario para `ForumView.vue`. No existen endpoints documentados para esta funcionalidad.
**Prioridad: Media**

### GET /api/forum/categories

- **Descripción**: Listar categorías del foro.
- **Respuesta Esperada**: Lista (`id`, `name`, `description`, `topicsCount`, `lastActivity`).

### GET /api/forum/topics

- **Descripción**: Listar temas del foro con filtros.
- **Argumentos (Query)**:
  - `search` (string): Búsqueda texto.
  - `category` (string): Filtrar por categoría.
  - `authorId` (int?): Para "Mis Temas".
- **Respuesta Esperada**: Lista paginada de temas (`id`, `title`, `author`, `date`, `repliesCount`, `category`).

### POST /api/forum/topics

- **Descripción**: Crear un nuevo tema de discusión.
- **Roles**: Person.
- **Argumentos (Body)**:
  - `title` (string).
  - `category` (string).
  - `content` (string).
- **Respuesta Esperada**: Tema creado (`id`, ...).

### PUT /api/forum/topics/{id}

- **Descripción**: Editar un tema propio.
- **Roles**: Autor del tema.
- **Argumentos (Body)**: `title`, `content`.

### DELETE /api/forum/topics/{id}

- **Descripción**: Eliminar un tema propio.
- **Roles**: Autor o Admin.

---

## 4. Gestión de Usuarios (Admin)

Necesario para `AdminClientsView.vue`.
**Prioridad: Media**

### GET /api/admin/users

- **Descripción**: Listar todos los usuarios registrados para el panel de administración.
- **Argumentos (Query)**:
  - `page` (int): Número de página.
  - `search` (string): Búsqueda por nombre/email.
  - `status` (string): Filtrar por estado (active/inactive).
- **Respuesta Esperada**: Lista paginada de usuarios con totales de compras (`purchaseCount`).

### PUT /api/admin/users/{id}/status

- **Descripción**: Activar o desactivar un usuario (Banear).
- **Argumentos (Body/Query)**:
  - `status` (string): 'active' o 'inactive'.

---

## 5. Gestión de Órdenes/Boletas (Admin & User)

Necesario para `AdminInvoicesView.vue` y `OrdersCompletedView.vue`.
Actualmente solo existe "Crear" y "Actualizar estado", falta "Listar" y "Ver Detalle".
**Prioridad: Alta**

### GET /api/orders (Admin)

- **Descripción**: Listar todas las órdenes del sistema.
- **Roles**: ADMIN.
- **Argumentos (Query)**:
  - `page` (int): Paginación.
  - `status` (string): Filtrar por estado (pending, paid, shipped, etc).
  - `search` (string): Filtrar por ID de orden o nombre de cliente.
- **Respuesta Esperada**: Lista paginada de órdenes simplificadas.

### GET /api/orders/my-orders (User)

- **Descripción**: Listar las órdenes del usuario autenticado.
- **Roles**: Person.
- **Argumentos**: Headers de autenticación.
- **Respuesta Esperada**: Lista de historial de compras del usuario.

### GET /api/orders/{id}

- **Descripción**: Obtener el detalle completo de una orden específica, incluyendo ítems, precios, impuestos y desglose.
- **Argumentos**: `id` en path.
- **Respuesta Esperada**: Objeto Order completo con lista de `items`, `subtotal`, `tax`, `total`, `shippingAddress`.

---

## 6. Categorías (Shop) - Refinamiento

Necesario para `CategoriesView.vue`.
Ya existe `/api/categories`, pero se debe asegurar que devuelva los metadatos visuales.

### GET /api/categories (Extendido)

- **Requerimiento Adicional**: El endpoint actual debe devolver también `description` e `image` (URL) para mostrarse correctamente en la vista de categorías, no solo el nombre.

---

## 7. Reseñas y Valoraciones (Reviews)

Necesario para `ProductDetailView.vue`.
**Prioridad: Media**

### GET /api/products/{id}/reviews

- **Descripción**: Obtener las reseñas de un producto.
- **Argumentos**: `id` del producto.
- **Respuesta Esperada**: Lista de reseñas (`author`, `avatar`, `rating`, `comment`, `date`).

### POST /api/products/{id}/reviews

- **Descripción**: Publicar una reseña sobre un producto.
- **Argumentos (Body)**:
  - `rating` (int): 1-5.
  - `comment` (string): Texto de la reseña.

---

## 8. Dashboard y Estadísticas (Admin)

Necesario para `AdminDashboardView.vue`.
**Prioridad: Baja (pero añade valor)**

### GET /api/admin/stats

- **Descripción**: Obtener métricas para el dashboard principal.
- **Respuesta Esperada**:
  - `totalSales` (float)
  - `totalUsers` (int)
  - `recentOrders` (List<Order>)
  - `topProducts` (List<Product>)

---

## 9. Promociones

Necesario para `AdminPromotionsView.vue`.
**Prioridad: Baja**

### GET/POST/PUT/DELETE /api/promotions

- **Descripción**: CRUD para gestionar códigos de descuento o banners promocionales visibles en el Home.
