@echo off
echo 🚀 Iniciando Cubo App...
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python no está instalado
    echo 💡 Por favor instala Python desde python.org
    exit /b 1
)

REM Verificar si el entorno virtual existe
if not exist "venv" (
    echo ❌ Error: Entorno virtual no encontrado
    echo 💡 Ejecuta primero: setup.bat
    exit /b 1
)

REM Verificar si el script principal existe
if not exist "run_app.py" (
    echo ❌ Error: run_app.py no encontrado
    exit /b 1
)

REM Ejecutar la aplicación directamente con el Python del venv
echo 🐧 Ejecutando aplicación...
.\venv\Scripts\python.exe run_app.py
