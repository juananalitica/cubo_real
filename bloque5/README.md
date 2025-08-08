# Bloque 5 — Puesta en marcha, pruebas y conmutación DB

## SQLite (offline por defecto)
1. `npm install`
2. Crear `.env` a partir de `.env.example` con `DB_CLIENT=sqlite`.
3. `npm run dev` o `npm start` → crea `data.db` si no existe y levanta en `http://localhost:3000`.

## MySQL (opcional)
1. Crear base de datos y usuario.
2. Ejecutar `db.sql` para la tabla.
3. Configurar `.env` con:
   ```
   DB_CLIENT=mysql
   DB_HOST=tu_host
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=tu_base
   ```
4. Reiniciar el servidor.

## Pruebas manuales
1. Ver que cargue la tabla inicial (semilla JSON).
2. Agregar un registro con el formulario.
3. Editar un registro.
4. Eliminar un registro.
5. Refrescar la página: los cambios persisten (confirmación DB).

## Futuras mejoras (opcionales)
- Validaciones de negocio.
- Paginación.
- Filtros por fecha/categoría.
- Exportar CSV.
