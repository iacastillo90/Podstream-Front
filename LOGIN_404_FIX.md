# 🔧 Solución al Error 404 en Login

## 🐛 Problema

```
POST http://localhost:5173/api/auth/login 404 (Not Found)
```

## 🔍 Diagnóstico

✅ **Backend está corriendo**: Puerto 8088 activo (PID 3892)
✅ **Proxy configurado**: `vite.config.ts` apunta a `http://localhost:8088`
❌ **Proxy no funciona**: Las peticiones a `/api/*` retornan 404

## 💡 Causa Raíz

El proxy de Vite **requiere reinicio del servidor** cuando se modifica `vite.config.ts`. Si el servidor se reinició pero el problema persiste, puede ser:

1. **Cache del navegador**: El navegador está usando una versión antigua
2. **Proxy no inicializado**: Vite no cargó correctamente la configuración del proxy
3. **Endpoint incorrecto**: El backend usa una ruta diferente

## ✅ Soluciones

### Solución 1: Reiniciar Servidor de Desarrollo (Recomendado)

```bash
# 1. Detener el servidor actual
Ctrl + C

# 2. Limpiar cache de Vite
npm run dev -- --force

# O simplemente reiniciar:
npm run dev
```

### Solución 2: Limpiar Cache del Navegador

1. Abrir DevTools (F12)
2. Click derecho en el botón de recargar
3. Seleccionar "Vaciar caché y recargar de forma forzada"

### Solución 3: Verificar Endpoint del Backend

El backend puede estar usando una ruta diferente. Prueba directamente:

```bash
# En PowerShell:
Invoke-WebRequest -Uri "http://localhost:8088/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"test","password":"test"}'
```

**Respuestas esperadas**:

- ✅ **200 OK**: Endpoint funciona (credenciales incorrectas pero endpoint existe)
- ✅ **401 Unauthorized**: Endpoint funciona (credenciales incorrectas)
- ✅ **400 Bad Request**: Endpoint funciona (validación falló)
- ❌ **404 Not Found**: Endpoint NO existe en esa ruta

### Solución 4: Verificar Configuración del Proxy

Asegúrate que `vite.config.ts` tenga:

```typescript
export default defineConfig({
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

### Solución 5: Agregar Logging al Proxy

Modifica `vite.config.ts` para ver qué está pasando:

```typescript
export default defineConfig({
  // ...
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying:', req.method, req.url, '→', options.target + req.url)
          })
          proxy.on('error', (err, req, res) => {
            console.error('Proxy error:', err)
          })
        },
      },
    },
  },
})
```

## 🧪 Testing

### 1. Probar Backend Directamente

```javascript
// En la consola del navegador:
fetch('http://localhost:8088/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'test', password: 'test' }),
})
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error)
```

### 2. Probar a través del Proxy

```javascript
// En la consola del navegador (en localhost:5173):
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'test', password: 'test' }),
})
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error)
```

## 📋 Checklist de Verificación

- [ ] Backend está corriendo en puerto 8088
- [ ] `vite.config.ts` tiene el proxy configurado correctamente
- [ ] Servidor de desarrollo reiniciado después de cambios en `vite.config.ts`
- [ ] Cache del navegador limpiado
- [ ] Endpoint `/api/auth/login` existe en el backend
- [ ] No hay errores en la consola del servidor de Vite
- [ ] No hay errores CORS en la consola del navegador

## 🎯 Próximos Pasos

1. **Reinicia el servidor de desarrollo** con `npm run dev`
2. **Limpia el cache del navegador** (Ctrl+Shift+R)
3. **Intenta hacer login nuevamente**
4. Si persiste el error, **prueba el endpoint directamente** en el navegador
5. **Revisa los logs del backend** para ver si la petición llega

## 📞 Información Adicional

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8088
- **Proxy**: `/api/*` → `http://localhost:8088/api/*`
- **Endpoint Login**: `POST /api/auth/login`
- **Body esperado**: `{ "username": "email@example.com", "password": "..." }`
