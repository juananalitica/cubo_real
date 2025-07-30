#!/usr/bin/env python3
"""
Script de instalación rápida para Cubo App
"""
import os
import sys
import platform
import subprocess
from pathlib import Path

# Configuración centralizada para diferentes sistemas operativos
PACKAGE_MANAGERS = {
    'Linux': {
        'apt': {
            'update': ['sudo', 'apt', 'update'],
            'install': ['sudo', 'apt', 'install', '-y'],
            'packages': {
                'python': ['python3', 'python3-pip', 'python3-venv'],
                'node': ['nodejs', 'npm']
            }
        },
        'yum': {
            'update': ['sudo', 'yum', 'update', '-y'],
            'install': ['sudo', 'yum', 'install', '-y'],
            'packages': {
                'python': ['python3', 'python3-pip'],
                'node': ['nodejs', 'npm']
            }
        },
        'dnf': {
            'update': ['sudo', 'dnf', 'update', '-y'],
            'install': ['sudo', 'dnf', 'install', '-y'],
            'packages': {
                'python': ['python3', 'python3-pip'],
                'node': ['nodejs', 'npm']
            }
        },
        'pacman': {
            'update': ['sudo', 'pacman', '-Sy'],
            'install': ['sudo', 'pacman', '-S', '--noconfirm'],
            'packages': {
                'python': ['python', 'python-pip'],
                'node': ['nodejs', 'npm']
            }
        }
    },
    'Darwin': {  # macOS
        'brew': {
            'update': ['brew', 'update'],
            'install': ['brew', 'install'],
            'packages': {
                'python': ['python'],
                'node': ['node']
            }
        }
    }
}

def check_command(command):
    """Verifica si un comando está disponible en el sistema"""
    try:
        subprocess.run([command, "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def detect_package_manager():
    """Detecta el gestor de paquetes disponible"""
    system = platform.system()
    
    if system == "Linux":
        for manager in ['apt', 'yum', 'dnf', 'pacman']:
            if check_command(manager):
                return manager
    elif system == "Darwin":
        if check_command("brew"):
            return "brew"
    
    return None

def install_packages(package_type):
    """Instala paquetes usando el gestor detectado"""
    system = platform.system()
    manager = detect_package_manager()
    
    if not manager:
        print(f"❌ No se pudo detectar el gestor de paquetes en {system}")
        return False
    
    if system not in PACKAGE_MANAGERS or manager not in PACKAGE_MANAGERS[system]:
        print(f"❌ Gestor de paquetes {manager} no soportado en {system}")
        return False
    
    config = PACKAGE_MANAGERS[system][manager]
    packages = config['packages'].get(package_type, [])
    
    if not packages:
        print(f"❌ No hay paquetes definidos para {package_type}")
        return False
    
    try:
        # Actualizar repositorios
        if 'update' in config:
            subprocess.check_call(config['update'])
        
        # Instalar paquetes
        install_cmd = config['install'] + packages
        subprocess.check_call(install_cmd)
        
        print(f"✅ Paquetes {package_type} instalados correctamente")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error instalando paquetes {package_type}: {e}")
        return False

def install_python():
    """Instala Python si no está disponible"""
    print("🐍 Verificando Python...")
    
    if check_command("python3") or check_command("python"):
        print("✅ Python ya está instalado")
        return True
    
    print("❌ Python no está instalado")
    system = platform.system()
    
    if system in ["Linux", "Darwin"]:
        print(f"📦 Instalando Python en {system}...")
        return install_packages('python')
    elif system == "Windows":
        print("❌ Python no está instalado en Windows")
        print("💡 Descarga e instala Python desde https://python.org")
        print("   Asegúrate de marcar 'Add Python to PATH' durante la instalación")
        return False
    else:
        print(f"❌ Sistema operativo no soportado: {system}")
        return False

def install_pip():
    """Instala pip si no está disponible"""
    print("📦 Verificando pip...")
    
    if check_command("pip3") or check_command("pip"):
        print("✅ pip ya está instalado")
        return True
    
    print("❌ pip no está instalado")
    system = platform.system()
    
    if system in ["Linux", "Darwin"]:
        print(f"📦 Instalando pip en {system}...")
        return install_packages('python')  # pip viene con python
    elif system == "Windows":
        print("❌ pip no está instalado en Windows")
        print("💡 Reinstala Python desde https://python.org")
        return False
    else:
        print(f"❌ Sistema operativo no soportado: {system}")
        return False

def install_venv():
    """Instala venv si no está disponible"""
    print("🔧 Verificando venv...")
    
    try:
        import venv
        print("✅ venv ya está disponible")
        return True
    except ImportError:
        print("❌ venv no está disponible")
        system = platform.system()
        
        if system in ["Linux", "Darwin"]:
            print(f"📦 Instalando venv en {system}...")
            return install_packages('python')  # venv viene con python
        elif system == "Windows":
            print("❌ venv no está disponible en Windows")
            print("💡 Reinstala Python desde https://python.org")
            return False
        else:
            print(f"❌ Sistema operativo no soportado: {system}")
            return False

def check_python():
    """Verifica que Python esté instalado y sea compatible"""
    print("🐍 Verificando versión de Python...")
    
    try:
        version = sys.version_info
        if version.major < 3 or (version.major == 3 and version.minor < 8):
            print(f"❌ Python {version.major}.{version.minor} no es compatible")
            print("💡 Se requiere Python 3.8 o superior")
            return False
        
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} detectado")
        return True
        
    except Exception as e:
        print(f"❌ Error verificando Python: {e}")
        return False

def check_node_npm():
    """Verifica que Node.js y npm estén instalados"""
    try:
        shell = platform.system() == "Windows"
        subprocess.run(["node", "--version"], check=True, capture_output=True, shell=shell)
        subprocess.run(["npm", "--version"], check=True, capture_output=True, shell=shell)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def install_dependencies():
    """Instala las dependencias según configuración"""
    print("📦 Instalando dependencias...")
    
    # Paso 1: Crear entorno virtual si no existe
    venv_path = Path(__file__).parent / "venv"
    if not venv_path.exists():
        print("🔧 Creando entorno virtual...")
        try:
            subprocess.check_call([sys.executable, "-m", "venv", str(venv_path)])
            print("✅ Entorno virtual creado")
        except subprocess.CalledProcessError as e:
            print(f"❌ Error creando entorno virtual: {e}")
            print("💡 En Linux, puede que necesites: sudo apt install python3-venv")
            return False
            
    # Paso 2: Determinar ejecutables del venv
    if platform.system() == "Windows":
        pip_executable = venv_path / "Scripts" / "pip.exe"
        python_executable = venv_path / "Scripts" / "python.exe"
    else:
        pip_executable = venv_path / "bin" / "pip"
        python_executable = venv_path / "bin" / "python"

    # Paso 3: Instalar dependencias principales (PyYAML, Requests)
    try:
        print("🔧 Instalando dependencias principales (PyYAML, Requests)...")
        subprocess.check_call([str(pip_executable), "install", "PyYAML", "requests"])
        print("✅ Dependencias principales instaladas.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error crítico instalando dependencias principales: {e}")
        return False

    # Paso 4: Leer el modo de configuración directamente desde config.yml usando el python del venv
    mode = 'full'  # Default a full install si algo falla
    try:
        print("🔧 Leyendo modo de configuración desde config.yml...")
        # Comando para que el python del venv lea el archivo y nos devuelva el modo
        get_mode_command = [
            str(python_executable),
            "-c",
            f'''import yaml; from pathlib import Path; path = Path("config.yml"); data = yaml.safe_load(path.read_text(encoding="utf-8")) if path.exists() else {{}}; print(data.get("mode", "full"))'''
        ]
        result = subprocess.run(get_mode_command, capture_output=True, text=True, check=True, encoding='utf-8')
        mode = result.stdout.strip()
        print(f"🔧 Modo de instalación detectado: {mode}")
    except Exception as e:
        print(f"⚠️ No se pudo leer el modo desde config.yml ({e}). Se instalará todo por defecto.")
        mode = 'full'  # Fallback

    # Paso 5: Instalar el resto de las dependencias
    try:
        # Instalar dependencias del backend si es necesario
        if mode in ['backend', 'full']:
            print("🐍 Instalando dependencias del backend...")
            backend_dir = Path(__file__).parent / "backend"
            requirements_file = backend_dir / "requirements.txt"
            
            if requirements_file.exists():
                subprocess.check_call([str(pip_executable), "install", "-r", str(requirements_file)])
                print("✅ Dependencias del backend (requirements.txt) instaladas")
            else:
                print("⚠️ No se encontró backend/requirements.txt")

        # Instalar dependencias del frontend si es necesario
        if mode in ['frontend', 'full']:
            frontend_dir = Path(__file__).parent / "frontend"
            package_json = frontend_dir / "package.json"

            if package_json.exists():
                print("🎨 Frontend detectado")
                if check_node_npm():
                    try:
                        shell = platform.system() == "Windows"
                        subprocess.check_call(["npm", "install"], cwd=frontend_dir, shell=shell)
                        print("✅ Dependencias del frontend (npm) instaladas")
                    except subprocess.CalledProcessError as e:
                        print(f"❌ Error instalando dependencias del frontend: {e}")
                else:
                    print("⚠️ Node.js no encontrado. Saltando dependencias del frontend")
            else:
                print("ℹ️ No se encontró frontend/package.json. Saltando dependencias del frontend.")
        
        # Crear script de activación
        create_activation_script(python_executable)
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error durante la instalación de dependencias: {e}")
        return False

def make_executable():
    """Hace los scripts ejecutables en Linux"""
    if platform.system() != "Windows":
        print("🔧 Configurando permisos de ejecución...")
        
        scripts = [
            "run_app.py",
            "run_app.sh",
            "build.py",
            "test_quick.py",
            "setup.sh"
        ]
        
        for script in scripts:
            script_path = Path(__file__).parent / script
            if script_path.exists():
                os.chmod(script_path, 0o755)
                print(f"✅ {script} hecho ejecutable")

def create_activation_script(python_executable):
    """Crea un script para activar el entorno virtual"""
    print("🔧 Creando script de activación...")
    
    project_dir = Path(__file__).parent
    
    if platform.system() == "Windows":
        # Script batch para Windows
        activate_content = f'''@echo off
echo Activando entorno virtual...
call "{project_dir}\\venv\\Scripts\\activate.bat"
echo Entorno virtual activado
echo Para ejecutar la aplicación: python run_app.py
cmd /k
'''
        activate_path = project_dir / "activate.bat"
        with open(activate_path, 'w') as f:
            f.write(activate_content)
    else:
        # Script bash para Linux
        activate_content = f'''#!/bin/bash
echo "Activando entorno virtual..."
source "{project_dir}/venv/bin/activate"
echo "Entorno virtual activado"
echo "Para ejecutar la aplicación: python run_app.py"
bash
'''
        activate_path = project_dir / "activate.sh"
        with open(activate_path, 'w') as f:
            f.write(activate_content)
        os.chmod(activate_path, 0o755)
    
    print("✅ Script de activación creado")

def create_desktop_shortcut():
    """Crea un acceso directo en el escritorio"""
    print("🖥️ Creando acceso directo...")
    
    desktop = None
    if platform.system() == "Windows":
        desktop = Path.home() / "Desktop"
    else:
        desktop = Path.home() / "Desktop"
        if not desktop.exists():
            desktop = Path.home() / "Escritorio"
    
    if desktop and desktop.exists():
        if platform.system() == "Windows":
            # Crear .bat en el escritorio
            shortcut_content = f'''@echo off
cd /d "{Path(__file__).parent}"
call venv\\Scripts\\activate.bat
python run_app.py
pause
'''
            shortcut_path = desktop / "Cubo App.bat"
            with open(shortcut_path, 'w') as f:
                f.write(shortcut_content)
            print("✅ Acceso directo creado en el escritorio")
        else:
            # Crear .desktop en Linux
            shortcut_content = f"""[Desktop Entry]
Version=1.0
Type=Application
Name=Cubo App
Comment=Aplicación web Cubo
Exec={Path(__file__).parent}/venv/bin/python {Path(__file__).parent}/run_app.py
Icon=applications-internet
Terminal=true
Categories=Network;WebBrowser;
"""
            shortcut_path = desktop / "cubo-app.desktop"
            with open(shortcut_path, 'w') as f:
                f.write(shortcut_content)
            os.chmod(shortcut_path, 0o755)
            print("✅ Acceso directo creado en el escritorio")

def main():
    """Función principal"""
    print("🚀 Instalador de Cubo App")
    print("=" * 40)
    print()
    
    # Verificar e instalar Python si es necesario
    if not install_python():
        print("❌ No se pudo instalar Python")
        sys.exit(1)
    
    # Verificar e instalar pip si es necesario
    if not install_pip():
        print("❌ No se pudo instalar pip")
        sys.exit(1)
    
    # Verificar e instalar venv si es necesario
    if not install_venv():
        print("❌ No se pudo instalar venv")
        sys.exit(1)
    
    # Verificar versión de Python
    if not check_python():
        sys.exit(1)
    
    # Verificar Node.js (opcional)
    frontend_dir = Path(__file__).parent / "frontend"
    package_json = frontend_dir / "package.json"
    
    if package_json.exists():
        print("🎨 Frontend de Vite detectado")
        if check_node_npm():
            print("✅ Node.js y npm detectados")
        else:
            print("⚠️ Node.js no detectado. El frontend se servirá de forma estática")
        print()
    
    # Instalar dependencias
    if not install_dependencies():
        sys.exit(1)
    
    # Configurar permisos
    make_executable()
    
    # Crear acceso directo
    create_desktop_shortcut()
    
    print()
    print("🎉 ¡Instalación completada!")
    print()
    print("📋 Próximos pasos:")
    print("1. Para construir la aplicación: python build.py")
    print("2. Para ejecutar la aplicación: python run_app.py")
    print("3. Para probar: python test_quick.py")
    print()
    
    if platform.system() == "Windows":
        print("💡 En Windows también puedes:")
        print("   - Doble clic en 'run_app.bat'")
        print("   - Doble clic en 'Cubo App.bat' en el escritorio")
    else:
        print("💡 En Linux también puedes:")
        print("   - Ejecutar: ./run_app.sh")
        print("   - Doble clic en 'cubo-app.desktop' en el escritorio")

if __name__ == "__main__":
    main()