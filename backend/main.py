import uvicorn
from pathlib import Path
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importar la configuración
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))
from config import config

# Importar los routers de la aplicación
from backend.app.router import routes as api_routes # Importar desde la ruta absoluta

# Define metadatos para las etiquetas, esto controla el orden y las descripciones en /docs
tags_metadata = [
    {
        "name": "General",
        "description": "Operaciones generales de la API.",
    },
    {
        "name": "Balance",
        "description": "Operaciones relacionadas con los balances. (**API v1**)",
    },
    {
        "name": "DataFrame",
        "description": "Operaciones relacionadas con la carga y gestión de DataFrames. (**API v1**)",
    }
]

app = FastAPI(
    title="Cubo Backend API",
    version="1.0.0",
    description="API para la aplicación Cubo.",
    openapi_tags=tags_metadata
)

@app.get("/", tags=["General"])
async def root():
    return {"message": "Welcome to the Cubo Backend API!"}

# Agregar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_routes, prefix="/api/v1")

# Ejecutar servidor, tener en cuenta que run_app.py maneja la ejecución
def run_server(host="0.0.0.0", port=8000):
    """Ejecuta el servidor FastAPI usando una cadena de importación para el modo de recarga."""
    server_host = config.backend_host if config.backend_host else host
    server_port = config.backend_port if config.backend_port else port
    reload = config.backend_reload if config.backend_reload else False
    debug = "debug" if config.backend_debug else "info"

    uvicorn.run("backend.main:app", host=server_host, port=server_port, reload=reload, log_level=debug)

if __name__ == "__main__":
    run_server() 