# 📚 Script de Documentación del Proyecto

Este script genera automáticamente una documentación completa de tu proyecto en un único archivo `.txt`, ideal para:

- 📦 **Respaldo** del código fuente
- 🔍 **Análisis** del proyecto
- 👥 **Compartir** con revisores o consultores
- 🤖 **Proveer contexto** a IAs/LLMs (ChatGPT, Claude, etc.)

## 🚀 Uso Rápido

```bash
# Generar documentación (excluye node_modules, dist, etc.)
npm run document

# Generar documentación completa (incluye todo)
npm run document:full
```

## 📄 Salida

El script genera un archivo en `docs/project-documentation-YYYY-MM-DD.txt` que contiene:

1. **Metadatos del proyecto**

   - Nombre del proyecto
   - Ubicación
   - Fecha de generación
   - Total de archivos
   - Tamaño total

2. **Estructura del proyecto** (árbol de archivos)

   ```
   PodStream/
   ├── src/
   │   ├── components/
   │   ├── views/
   │   └── ...
   └── package.json
   ```

3. **Estadísticas**

   - Archivos de texto vs binarios
   - Distribución por tipo de archivo

4. **Contenido completo de archivos**
   - Código fuente de todos los archivos de texto
   - Separadores claros entre archivos
   - Información de tamaño por archivo

## ⚙️ Configuración

Puedes personalizar el comportamiento editando `.documentrc.json`:

```json
{
  "outputDir": "./docs",
  "outputFileName": "project-documentation",
  "exclude": ["node_modules/**", "dist/**", "*.lock"],
  "binaryExtensions": [".png", ".jpg", ".pdf"],
  "maxFileSize": 1048576,
  "includeMetadata": true
}
```

### Opciones de Configuración

| Opción             | Descripción                      | Valor por defecto                     |
| ------------------ | -------------------------------- | ------------------------------------- |
| `outputDir`        | Directorio de salida             | `"./docs"`                            |
| `outputFileName`   | Nombre base del archivo          | `"project-documentation"`             |
| `exclude`          | Patrones de exclusión (glob)     | `["node_modules/**", "dist/**", ...]` |
| `binaryExtensions` | Extensiones de archivos binarios | `[".png", ".jpg", ...]`               |
| `maxFileSize`      | Tamaño máximo de archivo (bytes) | `1048576` (1MB)                       |
| `includeMetadata`  | Incluir metadatos del proyecto   | `true`                                |

## 📋 Ejemplos de Uso

### Documentar para compartir con IA

```bash
npm run document
```

Luego copia el contenido de `docs/project-documentation-*.txt` y pégalo en tu conversación con ChatGPT, Claude, etc.

### Documentar todo el proyecto (sin exclusiones)

```bash
npm run document:full
```

Útil para respaldos completos o cuando necesitas incluir archivos que normalmente se excluyen.

### Personalizar exclusiones

Edita `.documentrc.json` y agrega patrones:

```json
{
  "exclude": ["node_modules/**", "dist/**", "test/**", "*.test.ts", "*.spec.ts"]
}
```

## 🎯 Casos de Uso

### 1. Respaldo del Proyecto

Genera una documentación completa antes de hacer cambios importantes:

```bash
npm run document
```

### 2. Compartir con Consultores

Genera el archivo y compártelo por email o chat:

```bash
npm run document
# Archivo generado: docs/project-documentation-2025-12-30.txt
```

### 3. Proveer Contexto a IA

Copia el contenido del archivo generado y pégalo en tu conversación con una IA para obtener análisis, sugerencias o ayuda con debugging.

### 4. Documentación para Revisión de Código

Genera la documentación antes de una revisión importante para tener todo el contexto en un solo lugar.

## 📊 Estadísticas de Ejemplo

```
📊 ESTADÍSTICAS
────────────────────────────────────────────────────────────────────────────────
Archivos de texto:   97
Archivos binarios:   3
Total:               100

Distribución por tipo:
  .vue                 48
  .ts                  20
  .json                9
  .md                  8
  .js                  4
```

## 🔧 Solución de Problemas

### El archivo es demasiado grande

Ajusta `maxFileSize` en `.documentrc.json` o agrega más exclusiones:

```json
{
  "maxFileSize": 524288,
  "exclude": ["node_modules/**", "dist/**", "*.lock", "*.log"]
}
```

### Faltan algunos archivos

Verifica que no estén en la lista de exclusiones en `.documentrc.json`.

### Archivos binarios incluidos

Agrega sus extensiones a `binaryExtensions`:

```json
{
  "binaryExtensions": [".png", ".jpg", ".pdf", ".zip"]
}
```

## 📝 Notas

- Los archivos binarios (imágenes, videos, etc.) se detectan automáticamente y no se incluyen en el contenido
- Los archivos mayores a `maxFileSize` se marcan pero no se incluyen
- El nombre del archivo de salida incluye la fecha para evitar sobrescrituras
- El directorio `docs/` se crea automáticamente si no existe

## 🤝 Contribuir

Si encuentras algún problema o tienes sugerencias, por favor abre un issue o pull request.

---

**Generado con ❤️ para PodStream**
