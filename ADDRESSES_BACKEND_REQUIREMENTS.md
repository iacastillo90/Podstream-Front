# 📍 Requisitos del Backend: Vista de Direcciones (AdminAddressesView)

## 🎯 Objetivo

Implementar un endpoint que devuelva **todas las direcciones registradas** por los usuarios del sistema para auditoría y gestión administrativa.

---

## 🔌 Endpoint Requerido

### GET `/api/admin/addresses`

**Descripción**: Obtener listado completo de direcciones de todos los usuarios

**Autenticación**: ✅ Requerida (Solo ADMIN)

**Headers**:

```http
Authorization: Bearer <admin-jwt-token>
```

---

## 📦 Estructura de Respuesta Esperada

### Formato Envuelto (Recomendado)

```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 5,
      "userName": "Juan Pérez",
      "userEmail": "juan@example.com",
      "street": "Av. Libertador 1234",
      "city": "Santiago",
      "state": "Región Metropolitana",
      "zipCode": "8320000",
      "country": "Chile",
      "isDefault": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "userId": 5,
      "userName": "Juan Pérez",
      "userEmail": "juan@example.com",
      "street": "Calle Falsa 123",
      "city": "Valparaíso",
      "state": "Región de Valparaíso",
      "zipCode": "2340000",
      "country": "Chile",
      "isDefault": false,
      "createdAt": "2024-02-20T14:15:00Z",
      "updatedAt": "2024-02-20T14:15:00Z"
    }
  ],
  "timestamp": "2025-12-29T23:15:00Z"
}
```

### Formato Array Directo (Alternativo)

```json
[
  {
    "id": 1,
    "userId": 5,
    "userName": "Juan Pérez",
    "userEmail": "juan@example.com",
    "street": "Av. Libertador 1234",
    "city": "Santiago",
    "state": "Región Metropolitana",
    "zipCode": "8320000",
    "country": "Chile",
    "isDefault": true
  }
]
```

---

## 📋 Campos Requeridos

| Campo       | Tipo         | Descripción                 | Obligatorio | Ejemplo                  |
| ----------- | ------------ | --------------------------- | ----------- | ------------------------ |
| `id`        | Long/Integer | ID único de la dirección    | ✅          | `1`                      |
| `userId`    | Long/Integer | ID del usuario propietario  | ✅          | `5`                      |
| `userName`  | String       | Nombre completo del usuario | ⚠️ Opcional | `"Juan Pérez"`           |
| `userEmail` | String       | Email del usuario           | ⚠️ Opcional | `"juan@example.com"`     |
| `street`    | String       | Calle y número              | ✅          | `"Av. Libertador 1234"`  |
| `city`      | String       | Ciudad                      | ✅          | `"Santiago"`             |
| `state`     | String       | Estado/Región/Provincia     | ✅          | `"Región Metropolitana"` |
| `zipCode`   | String       | Código postal               | ✅          | `"8320000"`              |
| `country`   | String       | País                        | ✅          | `"Chile"`                |
| `isDefault` | Boolean      | ¿Es dirección principal?    | ✅          | `true`                   |
| `createdAt` | DateTime     | Fecha de creación           | ⚠️ Opcional | `"2024-01-15T10:30:00Z"` |
| `updatedAt` | DateTime     | Última actualización        | ⚠️ Opcional | `"2024-01-15T10:30:00Z"` |

---

## 🔍 Funcionalidades del Frontend

La vista `/adminAddresses` actualmente implementa:

### 1. **Listado Completo**

- Muestra todas las direcciones de todos los usuarios
- Tabla con columnas: ID, Calle, Ciudad/Estado, CP, País, Principal

### 2. **Búsqueda en Tiempo Real**

- Filtro por: `street`, `city`, `country`
- Búsqueda case-insensitive

### 3. **Indicador de Dirección Principal**

- Badge "SI" (morado) si `isDefault === true`
- Badge "NO" (gris) si `isDefault === false`

### 4. **Contador de Direcciones**

- Muestra total de direcciones en el header

---

## 💾 Implementación Sugerida en el Backend

### Entidad `Address`

```java
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(name = "zip_code", nullable = false)
    private String zipCode;

    @Column(nullable = false)
    private String country;

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Getters and setters
}
```

### DTO `AddressDTO`

```java
public class AddressDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String street;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private Boolean isDefault;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructor, getters, setters
}
```

### Controller `AdminAddressController`

```java
@RestController
@RequestMapping("/api/admin/addresses")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAddressController {

    @Autowired
    private AddressService addressService;

    @GetMapping
    public ResponseEntity<?> getAllAddresses() {
        List<AddressDTO> addresses = addressService.getAllAddresses();

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Addresses retrieved successfully",
            "data", addresses,
            "timestamp", LocalDateTime.now()
        ));
    }
}
```

### Service `AddressService`

```java
@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public List<AddressDTO> getAllAddresses() {
        List<Address> addresses = addressRepository.findAll();

        return addresses.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private AddressDTO convertToDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setUserId(address.getUser().getId());
        dto.setUserName(address.getUser().getFirstname() + " " + address.getUser().getLastname());
        dto.setUserEmail(address.getUser().getEmail());
        dto.setStreet(address.getStreet());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setZipCode(address.getZipCode());
        dto.setCountry(address.getCountry());
        dto.setIsDefault(address.getIsDefault());
        dto.setCreatedAt(address.getCreatedAt());
        dto.setUpdatedAt(address.getUpdatedAt());
        return dto;
    }
}
```

### Repository `AddressRepository`

```java
public interface AddressRepository extends JpaRepository<Address, Long> {
    // Métodos adicionales si son necesarios
    List<Address> findByUserId(Long userId);
    Optional<Address> findByUserIdAndIsDefaultTrue(Long userId);
}
```

---

## 🧪 Testing

### 1. Verificar Endpoint

```bash
curl -X GET http://localhost:8088/api/admin/addresses \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json"
```

**Respuesta esperada**: Status 200 con array de direcciones

### 2. Verificar Autenticación

```bash
# Sin token (debe fallar con 401)
curl -X GET http://localhost:8088/api/admin/addresses

# Con token de usuario no-admin (debe fallar con 403)
curl -X GET http://localhost:8088/api/admin/addresses \
  -H "Authorization: Bearer <client-token>"
```

### 3. Datos de Prueba

Asegúrate de tener al menos 2-3 direcciones en la base de datos:

```sql
INSERT INTO addresses (user_id, street, city, state, zip_code, country, is_default, created_at, updated_at)
VALUES
  (1, 'Av. Libertador 1234', 'Santiago', 'Región Metropolitana', '8320000', 'Chile', true, NOW(), NOW()),
  (1, 'Calle Falsa 123', 'Valparaíso', 'Región de Valparaíso', '2340000', 'Chile', false, NOW(), NOW()),
  (2, 'Paseo Bulnes 456', 'Santiago', 'Región Metropolitana', '8340000', 'Chile', true, NOW(), NOW());
```

---

## 🎨 Mejoras Opcionales (Nivel Dios 🔥)

### 1. **Paginación**

```java
@GetMapping
public ResponseEntity<?> getAllAddresses(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size
) {
    Page<AddressDTO> addresses = addressService.getAllAddresses(
        PageRequest.of(page, size)
    );
    // ...
}
```

### 2. **Filtros Avanzados**

```java
@GetMapping
public ResponseEntity<?> getAllAddresses(
    @RequestParam(required = false) String country,
    @RequestParam(required = false) String city,
    @RequestParam(required = false) Boolean isDefault
) {
    // Implementar filtros dinámicos
}
```

### 3. **Ordenamiento**

```java
@GetMapping
public ResponseEntity<?> getAllAddresses(
    @RequestParam(defaultValue = "id") String sortBy,
    @RequestParam(defaultValue = "ASC") String sortDir
) {
    Sort sort = sortDir.equalsIgnoreCase("ASC")
        ? Sort.by(sortBy).ascending()
        : Sort.by(sortBy).descending();
    // ...
}
```

### 4. **Estadísticas**

```java
@GetMapping("/stats")
public ResponseEntity<?> getAddressStats() {
    return ResponseEntity.ok(Map.of(
        "totalAddresses", addressRepository.count(),
        "addressesByCountry", addressRepository.countByCountry(),
        "defaultAddresses", addressRepository.countByIsDefaultTrue()
    ));
}
```

### 5. **Exportación**

```java
@GetMapping("/export")
public ResponseEntity<byte[]> exportAddresses(
    @RequestParam(defaultValue = "csv") String format
) {
    // Exportar a CSV, Excel, PDF
}
```

---

## ✅ Checklist de Implementación

### Backend

- [ ] Crear entidad `Address` con relación a `User`
- [ ] Crear `AddressDTO` con todos los campos requeridos
- [ ] Implementar `AddressRepository`
- [ ] Implementar `AddressService.getAllAddresses()`
- [ ] Crear `AdminAddressController` con endpoint GET
- [ ] Agregar seguridad `@PreAuthorize("hasRole('ADMIN')")`
- [ ] Incluir información del usuario (userName, userEmail)
- [ ] Retornar respuesta envuelta en `{ success, message, data }`
- [ ] Agregar datos de prueba en la base de datos

### Frontend (Ya implementado ✅)

- [x] Vista `AdminAddressesView.vue` creada
- [x] Tabla con columnas correctas
- [x] Búsqueda por street, city, country
- [x] Indicador de dirección principal
- [x] Contador de direcciones
- [ ] Actualizar `fetchAddresses()` para manejar respuesta envuelta

---

## 🚀 Próximos Pasos

1. **Implementar el endpoint** `/api/admin/addresses` en el backend
2. **Agregar datos de prueba** en la base de datos
3. **Probar el endpoint** con curl o Postman
4. **Actualizar el frontend** si es necesario (manejo de respuesta envuelta)
5. **Verificar** que la vista muestre las direcciones correctamente

---

## 📞 Resumen Ejecutivo

**¿Qué necesitas pedirle al backend?**

> "Necesito un endpoint **GET /api/admin/addresses** que devuelva **todas las direcciones** de todos los usuarios. Cada dirección debe incluir: `id`, `userId`, `userName`, `userEmail`, `street`, `city`, `state`, `zipCode`, `country`, `isDefault`. El endpoint debe estar protegido para **solo ADMIN** y retornar la respuesta envuelta en `{ success, message, data }`."

**Campos mínimos obligatorios**:

- `id`, `street`, `city`, `state`, `zipCode`, `country`, `isDefault`

**Campos opcionales pero recomendados**:

- `userId`, `userName`, `userEmail`, `createdAt`, `updatedAt`

Una vez implementado, la vista `/adminAddresses` se volverá **100% dinámica** y mostrará todas las direcciones registradas en el sistema! 🎉
