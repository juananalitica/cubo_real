# Configuración del Backend y Solución de Problemas

## Problemas Identificados

### 1. Error de CORS
El error principal es que el backend no está configurado para permitir peticiones desde el frontend.

### 2. Error de innerHTML
Este es un error secundario que ocurre cuando no se pueden encontrar los elementos del DOM.

### 3. Error de conexión
El backend no está ejecutándose o no está accesible en la URL configurada.

## Soluciones Implementadas

### ✅ Mejoras en el Frontend

1. **Validación de elementos DOM**: Ahora se valida que todos los elementos existan antes de usarlos
2. **Manejo mejorado de errores**: Errores más específicos y descriptivos
3. **Configuración centralizada**: Archivo `api.js` para manejar URLs y configuraciones
4. **Retry automático**: Reintentos automáticos en caso de fallo
5. **Logging mejorado**: Más información en la consola para debugging

### 🔧 Configuración del Backend

Para que el frontend funcione correctamente, el backend debe estar configurado así:

#### 1. Configuración de CORS (Python/FastAPI)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/balance/upload")
async def upload_balance(file: UploadFile):
    # Tu lógica aquí
    return {"message": "Archivo recibido", "filename": file.filename}
```

#### 2. Configuración de CORS (Node.js/Express)

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Configurar CORS
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.post('/api/v1/balance/upload', upload.single('file'), (req, res) => {
    // Tu lógica aquí
    res.json({ message: 'Archivo recibido', filename: req.file.filename });
});
```

#### 3. Configuración de CORS (Java/Spring)

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .allowedMethods("*")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

### 📋 Checklist de Verificación

#### Backend:
- [ ] El servidor está ejecutándose en `http://localhost:8000`
- [ ] CORS está configurado para permitir `http://localhost:5173`
- [ ] El endpoint `/api/v1/balance/upload` existe y acepta POST
- [ ] El endpoint acepta archivos multipart/form-data
- [ ] El servidor responde con JSON válido

#### Frontend:
- [ ] El archivo `api.js` está configurado con la URL correcta
- [ ] Los elementos del DOM se validan antes de usar
- [ ] Los errores se manejan correctamente
- [ ] Las notificaciones se muestran apropiadamente

### 🐛 Debugging

#### 1. Verificar que el backend esté ejecutándose:
```bash
curl http://localhost:8000/health
```

#### 2. Verificar CORS:
```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS http://localhost:8000/api/v1/balance/upload
```

#### 3. Verificar el endpoint:
```bash
curl -X POST http://localhost:8000/api/v1/balance/upload \
     -F "file=@test.xlsx" \
     -F "timestamp=2024-01-15T10:00:00Z" \
     -F "source=test"
```

### 🔄 URLs de Configuración

Si tu backend está en una URL diferente, actualiza el archivo `frontend/src/config/api.js`:

```javascript
export const API_CONFIG = {
    BASE_URL: 'http://tu-backend-url:puerto', // Cambiar aquí
    // ... resto de la configuración
};
```

### 📝 Logs Útiles

El frontend ahora muestra logs detallados en la consola:
- URL a la que se envía el archivo
- Información del archivo (nombre, tamaño, tipo)
- Estado de la respuesta del servidor
- Errores específicos con contexto

### 🚀 Próximos Pasos

1. **Configurar el backend** con CORS apropiado
2. **Verificar que el endpoint** `/api/v1/balance/upload` funcione
3. **Probar con curl** antes de usar el frontend
4. **Revisar los logs** del navegador para debugging

### 📞 Soporte

Si sigues teniendo problemas:
1. Revisa los logs del navegador (F12 → Console)
2. Verifica que el backend esté ejecutándose
3. Prueba el endpoint con curl o Postman
4. Confirma que CORS esté configurado correctamente 