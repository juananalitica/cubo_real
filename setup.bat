@echo off
echo 🚀 Setup de Cubo App
echo ====================
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Python no está instalado
    echo 💡 Por favor instala Python desde python.org
    exit /b 1
)

REM Verificar si el script install.py existe
if not exist "install.py" (
    echo ❌ Error: install.py no encontrado
    echo 💡 Asegúrate de estar en el directorio correcto del proyecto
    exit /b 1
)

REM Verificar si existe configuración
if not exist "config.yml" (
    echo ⚠️ No se encontró config.yml
    echo 💡 Creando configuración por defecto...
    python configure.py
)

REM Ejecutar install.py
echo 🔧 Ejecutando instalación...
echo.

python install.py
if %errorlevel% equ 0 (
    echo.
    echo 🎉 ¡Setup completado exitosamente!
    echo.
    echo 📋 Próximos pasos:
    echo 1. Para ejecutar la aplicación: run_app.bat
    echo 2. Para construir la aplicación: python build.py
    echo 3. Para probar: python test_quick.py
    echo.
    echo 💡 También puedes ejecutar directamente:
    echo    python run_app.py
) else (
    echo.
    echo ❌ Error durante el setup
    echo 💡 Revisa los errores anteriores e intenta nuevamente
    exit /b 1
)
