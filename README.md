# 🚀 Cubo App

Aplicación web completa con backend FastAPI y frontend HTML/CSS/JavaScript, configurada para ejecutarse como un solo archivo ejecutable en Windows y Linux.

## 📋 Características

- ✅ **Backend**: FastAPI con Python
- ✅ **Frontend**: Vite + HTML/CSS/JavaScript moderno
- ✅ **Portable**: Fácil de ejecutar en diferentes entornos
- ✅ **Multiplataforma**: Windows y Linux
- ✅ **Fácil uso**: Un solo clic para ejecutar
- ✅ **Sin Docker**: No requiere contenedores
- ✅ **Modo Desarrollo**: Hot reload con Vite
- ✅ **Modo Producción**: Frontend compilado optimizado

## 🛠️ Requisitos

### Windows
- Python 3.8 o superior
- pip (incluido con Python)

### Linux
- Python 3.8 o superior
- pip3

## 🚀 Instalación y Uso

### Opción 1: Instalación Automática (Recomendada)

1. **Clonar o descargar el proyecto**
   ```bash
   git clone <tu-repositorio>
   cd cubo_app
   ```

2. **Instalar automáticamente**
   ```bash
   # Windows - Doble clic en setup.bat
   # O desde línea de comandos:
   setup.bat
   
   # Linux
   ./setup.sh
   # O
   python3 install.py
   ```

3. **Construir la aplicación completa (opcional)**
   ```bash
   # Windows
   python build.py
   
   # Linux
   python3 build.py
   ```

4. **Ejecutar la aplicación**
   ```bash
   # Windows - Doble clic en run_app.bat
   # O desde línea de comandos:
   python run_app.py
   
   # Linux
   ./run_app.sh
   # O
   python3 run_app.py
   ```

**Nota**: La aplicación detectará automáticamente si tienes un frontend de Vite y ejecutará tanto el backend como el frontend en modo desarrollo.

### Opción 2: Instalación Manual

Si la instalación automática falla, usa el instalador manual:

```bash
# Windows
python install_manual.py

# Linux
python3 install_manual.py
```

### Opción 3: Instalación Manual Paso a Paso

#### Linux:
```bash
# 1. Instalar python3-venv
sudo apt update
sudo apt install python3-venv python3-pip

# 2. Crear entorno virtual
python3 -m venv venv

# 3. Activar entorno virtual
source venv/bin/activate

# 3. Instalar dependencias
pip install -r backend/requirements.txt
pip install requests

# 4. Ejecutar
python run_app.py
```

#### Windows:
```bash
# 1. Crear entorno virtual
python -m venv venv

# 2. Activar entorno virtual
venv\Scripts\activate

# 3. Instalar dependencias
pip install -r backend/requirements.txt
pip install requests

# 4. Ejecutar
python run_app.py
```

## 📦 Distribución para usuarios finales

Para distribuir la aplicación a usuarios finales:

1. **Prepara el proyecto:**
   ```bash
   python build.py
   ```

2. **Distribuye la carpeta del proyecto**
   - El usuario puede ejecutar la aplicación con `run_app.py` o los scripts de ejecución incluidos.
   - La aplicación detectará automáticamente las dependencias necesarias.

3. **Requisitos para el usuario final**
   - Solo Python instalado. Node.js es opcional.

4. **Notas**
   - El frontend puede servirse directamente con `python -m http.server` desde la carpeta `frontend`.
   - Si no cuentas con Node.js, utiliza el build ya compilado en `frontend_offline_final`. Coloca esa carpeta en la raíz del proyecto y ejecuta `python run_app.py` o abre `index.html` directamente.

## 📁 Estructura del Proyecto

```
cubo_app/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # API FastAPI
│   ├── main.py          # Servidor backend
│   ├── requirements.txt     # Dependencias Python
│   └── dist/               # Ejecutable generado
├── frontend/
│   ├── src/                # Código fuente Vite
│   ├── public/             # Archivos públicos
│   ├── dist/               # Frontend compilado
│   ├── package.json        # Dependencias Node.js
│   └── index.html          # Página principal
├── run_app.py              # Script principal
├── run_app.bat             # Launcher Windows
├── run_app.sh              # Launcher Linux
├── setup.bat               # Setup Windows
├── setup.sh                # Setup Linux
├── build.py                # Script de construcción

└── README.md
```

## 🔧 API Endpoints

- `GET /` - Página principal
- `GET /items` - Lista de elementos de ejemplo

## 🌐 Uso

### Modo Desarrollo (con Vite)
1. Ejecuta la aplicación usando cualquiera de los métodos anteriores
2. Se abrirán automáticamente dos pestañas:
   - Frontend (Vite): `http://localhost:5173`
   - Backend (API): `http://localhost:8000`
3. El frontend tiene hot reload automático
4. Para detener la aplicación, presiona `Ctrl+C` en la terminal

### Modo Producción (compilado)
1. Construye la aplicación: `python build.py`
2. Ejecuta la aplicación
3. Se abrirá automáticamente en `http://localhost:8000`
4. El frontend compilado se sirve desde el backend

## 🐛 Solución de Problemas

### Error: "externally-managed-environment"
Este error ocurre en sistemas Linux modernos. **Solución:**

1. **Usar el instalador automático:**
   ```bash
   python3 install.py
   ```

2. **O usar el instalador manual:**
   ```bash
   python3 install_manual.py
   ```

3. **O instalar manualmente:**
   ```bash
   sudo apt install python3-venv python3-pip
   python3 -m venv venv
   source venv/bin/activate
   pip install -r backend/requirements.txt
   pip install requests
   ```

### Error: "Node.js no está instalado"
Si necesitas funcionalidades de Vite, instala Node.js:
- **Windows**: Descarga e instala Node.js desde [nodejs.org](https://nodejs.org)
- **Linux**: `sudo apt install nodejs npm`

### Error: "Python no está instalado"
- **Windows**: Descarga e instala Python desde [python.org](https://python.org)
- **Linux**: `sudo apt install python3 python3-pip`

### Error: "python3-venv no encontrado"
- **Linux**: `sudo apt install python3-venv`

### Error: "Puerto 8000 en uso"
- Cambia el puerto en `backend/main.py` línea 35
- O detén otros servicios que usen el puerto 8000

### Error: "No se pudo abrir el navegador"
- Abre manualmente tu navegador y ve a `http://localhost:8000`

### El ejecutable no funciona
- Asegúrate de haber ejecutado `build.py` correctamente
- Verifica que todas las dependencias estén instaladas
- Intenta ejecutar con Python directamente: `python run_app.py`

### Error: "Entorno virtual no encontrado"
- Ejecuta `./setup.sh` (Linux) o `setup.bat` (Windows) para crear el entorno virtual
- O ejecuta manualmente: `python3 install.py`
- O crea manualmente: `python3 -m venv venv`

## 🔄 Desarrollo

Para desarrollo local:

```bash
# Backend
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# Frontend estático
cd frontend
python -m http.server 5173

# O usar el script completo
python run_app.py
```

## 📦 Distribución

Para distribuir la aplicación:

1. Ejecuta `build.py` en el sistema objetivo
2. Copia los archivos generados:
   - `backend/dist/cubo_app` (Linux) o `cubo_app.exe` (Windows)
   - `run_app.py`
   - `run_app.bat` (Windows)
   - `run_app.sh` (Linux)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

Si tienes problemas:
1. Revisa la sección de solución de problemas
2. Verifica que tienes Python instalado correctamente
3. Asegúrate de que todas las dependencias estén instaladas
4. Abre un issue en el repositorio