#!/usr/bin/env python3
"""
Prueba rápida de la aplicación Cubo App
"""
import requests
import time
import subprocess
import sys
import threading
import platform
from pathlib import Path

def check_venv():
    """Verifica que el entorno virtual existe"""
    venv_path = Path(__file__).parent / "venv"
    if not venv_path.exists():
        print("❌ Entorno virtual no encontrado")
        print("💡 Ejecuta: python install.py")
        return False
    
    # Verificar Python del entorno virtual
    if platform.system() == "Windows":
        python_path = venv_path / "Scripts" / "python.exe"
    else:
        python_path = venv_path / "bin" / "python"
    
    if not python_path.exists():
        print("❌ Python del entorno virtual no encontrado")
        print("💡 Ejecuta: python install.py")
        return False
    
    return str(python_path)

def check_backend_files():
    """Verifica que los archivos del backend existan"""
    backend_dir = Path(__file__).parent / "backend"
    server_script = backend_dir / "app" / "server.py"
    
    if not backend_dir.exists():
        print("❌ Directorio backend no encontrado")
        return False
    
    if not server_script.exists():
        print("❌ Script del servidor no encontrado")
        print(f"💡 Buscando en: {server_script}")
        return False
    
    return True

def test_server():
    """Prueba el servidor"""
    print("🧪 Probando servidor...")
    
    # Verificar entorno virtual
    python_executable = check_venv()
    if not python_executable:
        return False
    
    # Verificar archivos del backend
    if not check_backend_files():
        return False
    
    # Iniciar servidor
    backend_dir = Path(__file__).parent / "backend"
    server_script = backend_dir / "app" / "server.py"
    
    try:
        # Cambiar al directorio del backend
        import os
        os.chdir(backend_dir)
        
        # Iniciar servidor en segundo plano
        process = subprocess.Popen([
            python_executable, str(server_script)
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Esperar a que inicie
        print("⏳ Esperando a que el servidor inicie...")
        time.sleep(5)
        
        # Verificar que el proceso sigue corriendo
        if process.poll() is not None:
            stdout, stderr = process.communicate()
            print("❌ El servidor se detuvo prematuramente")
            if stderr:
                print(f"Error: {stderr.decode()}")
            return False
        
        # Probar endpoints
        try:
            print("🔍 Probando endpoint /...")
            response = requests.get("http://localhost:8000/", timeout=10)
            if response.status_code == 200:
                print("✅ Endpoint / responde correctamente")
                
                print("🔍 Probando endpoint /items...")
                response = requests.get("http://localhost:8000/items", timeout=10)
                if response.status_code == 200:
                    print("✅ Endpoint /items responde correctamente")
                    
                    # Probar documentación de la API
                    print("🔍 Probando documentación de la API...")
                    response = requests.get("http://localhost:8000/docs", timeout=10)
                    if response.status_code == 200:
                        print("✅ Documentación de la API disponible")
                    else:
                        print("⚠️ Documentación de la API no disponible")
                    
                    print("🎉 ¡Aplicación funcionando perfectamente!")
                    return True
                else:
                    print(f"❌ Error en endpoint /items: {response.status_code}")
                    return False
            else:
                print(f"❌ Error en endpoint /: {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Error conectando al servidor: {e}")
            return False
            
        finally:
            # Detener servidor
            print("🛑 Deteniendo servidor...")
            process.terminate()
            try:
                process.wait(timeout=5)
                print("✅ Servidor detenido correctamente")
            except subprocess.TimeoutExpired:
                process.kill()
                print("⚠️ Servidor forzado a detenerse")
    
    except Exception as e:
        print(f"❌ Error iniciando servidor: {e}")
        return False

def test_frontend():
    """Prueba si el frontend está disponible"""
    print("🎨 Verificando frontend...")
    
    frontend_dir = Path(__file__).parent / "frontend"
    package_json = frontend_dir / "package.json"
    
    if not frontend_dir.exists():
        print("ℹ️ No se encontró directorio frontend")
        return True  # No es un error, es opcional
    
    if not package_json.exists():
        print("ℹ️ No se encontró package.json en frontend")
        return True  # No es un error, es opcional
    
    try:
        import json
        with open(package_json, 'r') as f:
            package_data = json.load(f)
        
        if 'scripts' in package_data and 'dev' in package_data['scripts']:
            print("✅ Frontend de Vite detectado")
            
            # Verificar node_modules
            node_modules = frontend_dir / "node_modules"
            if node_modules.exists():
                print("✅ Dependencias del frontend instaladas")
            else:
                print("⚠️ Dependencias del frontend no instaladas")
                print("💡 Ejecuta: cd frontend && npm install")
            
            return True
        else:
            print("ℹ️ Frontend detectado pero no es Vite")
            return True
    except Exception as e:
        print(f"⚠️ Error verificando frontend: {e}")
        return True  # No es un error crítico

def main():
    """Función principal"""
    print("🚀 Prueba Rápida de Cubo App")
    print("=" * 30)
    print()
    
    # Verificar frontend
    frontend_ok = test_frontend()
    print()
    
    # Probar servidor
    server_ok = test_server()
    print()
    
    # Resultados
    if server_ok:
        print("✅ ¡Todo funciona correctamente!")
        print("🚀 Puedes ejecutar la aplicación con:")
        print("   python run_app.py")
        print("   o ./run_app.sh")
    else:
        print("❌ Algunos problemas detectados")
        print("💡 Revisa la instalación con: python install.py")
        sys.exit(1)

if __name__ == "__main__":
    main()