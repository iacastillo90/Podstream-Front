# Requisitos del Backend para Alineación con Frontend

## 🔐 1. Autenticación (CRÍTICO)

### POST /api/auth/login

**Estado**: ✅ Existe pero requiere ajuste

**Cambio necesario**:

```json
// Request Body actual (CORRECTO):
{
  "username": "user@email.com",  // ✅ Campo correcto
  "password": "password123"
}

// Response esperada:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "name": "Juan Pérez",
  "email": "user@email.com",
  "role": "CLIENT" // o "ADMIN"
}
```

**Nota**: El frontend ya está enviando `username` correctamente.

---

## 📦 2. Productos - Campo categoryId (CRÍTICO)

### POST /api/products

**Estado**: ⚠️ Requiere validación

**Request Body que envía el frontend**:

```json
{
  "name": "Micrófono XLR Pro",
  "categoryId": 1, // ⚠️ CAMPO NUMÉRICO REQUERIDO
  "price": 99.99,
  "stock": 50,
  "shortDescription": "Breve descripción",
  "description": "Descripción completa del producto",
  "photos": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
}
```

**Validaciones necesarias en el backend**:

1. ✅ El campo `categoryId` debe ser **obligatorio** (no nullable)
2. ✅ Debe ser de tipo `Long` o `Integer`
3. ✅ Debe existir una foreign key a la tabla `categories`
4. ✅ Validar que la categoría existe antes de crear el producto

**Ejemplo de validación en Java**:

```java
@NotNull(message = "Category ID is required")
private Long categoryId;
```

---

## 📂 3. Categorías - Endpoint GET

### GET /api/categories

**Estado**: ✅ Existe

**Response esperada** (que el frontend ya consume):

```json
[
  {
    "id": 1,
    "name": "Micrófonos",
    "description": "Micrófonos profesionales"
  },
  {
    "id": 2,
    "name": "Auriculares",
    "description": "Auriculares de estudio"
  }
]
```

**Campos mínimos requeridos**:

- `id` (Long/Integer)
- `name` (String)
- `description` (String, opcional)

---

## 🔑 4. Headers de Autenticación (CRÍTICO)

### Interceptor de Axios

El frontend envía automáticamente en **TODAS las peticiones**:

```http
Authorization: Bearer <token_jwt>
X-Session-Id: <session_id>
```

**Requisitos del backend**:

1. ✅ Validar el token JWT en el header `Authorization`
2. ✅ Extraer el usuario del token
3. ✅ Aplicar el filtro de seguridad a todos los endpoints protegidos
4. ✅ Retornar 401 si el token es inválido o expiró

---

## 📋 Resumen de Cambios Prioritarios

### Alta Prioridad (Bloquean funcionalidad)

1. ✅ **Login**: Verificar que retorna `token`, `id`, `name`, `email`, `role`
2. ⚠️ **Productos**: Aceptar y validar campo `categoryId` (numérico)
3. ✅ **Categorías**: Endpoint GET debe retornar `id`, `name`, `description`

### Media Prioridad (Mejoran experiencia)

4. ⚠️ **Validación de Token**: Asegurar que el filtro JWT funciona correctamente
5. ⚠️ **Manejo de Errores**: Retornar mensajes descriptivos en español

---

## 🧪 Testing Recomendado

### 1. Login

```bash
curl -X POST http://localhost:8088/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test@example.com",
    "password": "password123"
  }'
```

**Respuesta esperada**: Token JWT + datos del usuario

### 2. Crear Producto

```bash
curl -X POST http://localhost:8088/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Test Product",
    "categoryId": 1,
    "price": 99.99,
    "stock": 10,
    "shortDescription": "Test",
    "description": "Test description",
    "photos": ["https://example.com/image.jpg"]
  }'
```

**Respuesta esperada**: Producto creado con status 201

### 3. Listar Categorías

```bash
curl -X GET http://localhost:8088/api/categories \
  -H "Authorization: Bearer <token>"
```

**Respuesta esperada**: Array de categorías con `id`, `name`, `description`

---

## ✅ Checklist de Alineación

- [ ] Login retorna `token`, `id`, `name`, `email`, `role`
- [ ] Endpoint POST /api/products acepta `categoryId` (numérico)
- [ ] Validación de `categoryId` como campo obligatorio
- [ ] Foreign key de `categoryId` a tabla `categories`
- [ ] GET /api/categories retorna `id`, `name`, `description`
- [ ] Filtro JWT valida token en header `Authorization`
- [ ] Manejo de errores retorna mensajes descriptivos
- [ ] CORS configurado para permitir requests desde frontend

---

## 📞 Contacto

Si tienes dudas sobre algún endpoint o necesitas más detalles sobre la estructura de datos esperada, consulta el archivo `missing_endpoints.md` para endpoints adicionales pendientes.
