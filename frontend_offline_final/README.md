# Frontend Offline Final

Este directorio contiene la versión estática del frontend lista para usarse sin dependencias de Node.js ni conexión a internet.

## Cómo ejecutar

1. Coloca esta carpeta `frontend_offline_final` en la raíz del proyecto.
2. Ejecuta:
   ```bash
   python run_app.py
   ```
   o abre `index.html` directamente en tu navegador.

El script `run_app.py` detectará el build de producción y servirá estos archivos usando `http.server` en el puerto configurado (por defecto 5173).

## Personalización

- Las imágenes y datos se encuentran en `json/`.
- Puedes reemplazar `balances-data.json` y otros archivos con tus propios datos.
- Si agregas imágenes o nuevos JSON, colócalos en las rutas relativas y actualiza tus componentes.

## Navegador recomendado

Cualquier navegador moderno (Chrome, Firefox, Edge). No se requiere conexión a internet ni Node.js.
