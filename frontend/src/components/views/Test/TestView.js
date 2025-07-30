import { Utils } from '../../../utils/utils.js'
import './TestView.css'

// Función helper para traducir errores técnicos a mensajes entendibles
const translateError = (error) => {
    const errorMessage = error.message || error.toString();
    
    // Errores de conexión
    if (error.name === 'TypeError' && errorMessage.includes('Failed to fetch')) {
        return {
            message: 'No se pudo conectar con el servidor.',
            details: 'Verifica que el servidor esté ejecutándose en http://localhost:8000',
            type: 'connection',
            userFriendly: true
        };
    }
    
    // Errores HTTP
    if (errorMessage.includes('HTTP 404')) {
        return {
            message: 'El servidor no encontró la página solicitada.',
            details: 'Verifica que la URL del servidor sea correcta',
            type: 'not_found',
            userFriendly: true
        };
    }
    
    if (errorMessage.includes('HTTP 500')) {
        return {
            message: 'Error interno del servidor.',
            details: 'El servidor tuvo un problema procesando tu archivo',
            type: 'server_error',
            userFriendly: true
        };
    }
    
    if (errorMessage.includes('HTTP 413')) {
        return {
            message: 'El archivo es demasiado grande.',
            details: 'Intenta con un archivo más pequeño (máximo 10MB)',
            type: 'file_too_large',
            userFriendly: true
        };
    }
    
    if (errorMessage.includes('HTTP 415')) {
        return {
            message: 'Tipo de archivo no soportado.',
            details: 'Solo se permiten archivos Excel (.xlsx, .xls) y CSV',
            type: 'unsupported_type',
            userFriendly: true
        };
    }
    
    // Errores de red
    if (errorMessage.includes('NetworkError')) {
        return {
            message: 'Error de conexión de red.',
            details: 'Verifica tu conexión a internet',
            type: 'network',
            userFriendly: true
        };
    }
    
    if (errorMessage.includes('timeout')) {
        return {
            message: 'La operación tardó demasiado tiempo.',
            details: 'El servidor está ocupado, intenta nuevamente en unos minutos',
            type: 'timeout',
            userFriendly: true
        };
    }
    
    if (errorMessage.includes('CORS')) {
        return {
            message: 'El servidor no permite conexiones desde esta página.',
            details: 'Contacta al administrador del sistema',
            type: 'cors',
            userFriendly: true
        };
    }
    
    // Errores de DOM
    if (errorMessage.includes('innerHTML') || errorMessage.includes('null')) {
        return {
            message: 'Error interno de la aplicación.',
            details: 'Recarga la página e intenta nuevamente',
            type: 'dom_error',
            userFriendly: true
        };
    }
    
    // Error genérico
    return {
        message: 'Ocurrió un error inesperado al procesar el archivo.',
        details: 'Error técnico: ' + errorMessage,
        type: 'unknown',
        userFriendly: false
    };
};

// Vista de Test
export const getTestContent = () => {
    return `
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Test de Upload</h2>
                <p class="subtitle is-6">Prueba la funcionalidad de subida de archivos al backend</p>
            </div>
            <div class="card-content">
                <div class="test-section">
                    <div class="notification is-info">
                        <div class="has-text-info mb-2">
                            <i class="fas fa-info-circle"></i>
                            <strong>Instrucciones:</strong>
                        </div>
                        <p>Selecciona un archivo Excel (.xlsx, .xls) o CSV para probar la funcionalidad de upload al backend.</p>
                    </div>
                    
                    <div class="field">
                        <label class="label">Seleccionar archivo</label>
                        <div class="control">
                            <div class="file has-name is-fullwidth">
                                <label class="file-label">
                                    <input class="file-input" 
                                           type="file" 
                                           id="excelFileInput"
                                           accept=".xlsx,.xls,.csv">
                                    <span class="file-cta">
                                        <span class="file-icon">
                                            <i class="fas fa-file-excel white-text"></i>
                                        </span>
                                        <span class="file-label white-text">
                                            Elegir archivo Excel...
                                        </span>
                                    </span>
                                    <span class="file-name" id="fileName">
                                        Ningún archivo seleccionado
                                    </span>
                                </label>
                            </div>
                        </div>
                        <p class="help">Formatos soportados: .xlsx, .xls, .csv</p>
                    </div>
                    
                    <div class="field">
                        <div class="control">
                            <button class="button is-primary" id="sendTestBtn" disabled>
                                <span class="icon">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span>Enviar al Backend</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="field" id="testResponseArea" style="display: none;">
                        <label class="label">Respuesta del Backend</label>
                        <div class="control">
                            <div class="box" id="testResponseContent">
                                <!-- Aquí se mostrará la respuesta -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="field" id="testErrorArea" style="display: none;">
                        <div class="notification is-danger" id="testErrorContent">
                            <!-- Aquí se mostrarán los errores -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const initializeTestSection = () => {
    const sendTestBtn = document.getElementById('sendTestBtn');
    const fileInput = document.getElementById('excelFileInput');
    const fileName = document.getElementById('fileName');

    if (sendTestBtn) {
        sendTestBtn.addEventListener('click', sendExcelToBackend);
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validar tipo de archivo
                const validTypes = [
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                    'application/vnd.ms-excel', // .xls
                    'text/csv', // .csv
                    'application/csv' // .csv alternativo
                ];
                
                if (validTypes.includes(file.type) || 
                    file.name.endsWith('.xlsx') || 
                    file.name.endsWith('.xls') || 
                    file.name.endsWith('.csv')) {
                    
                    fileName.textContent = file.name;
                    sendTestBtn.disabled = false;
                    Utils.showNotification(`Archivo seleccionado: ${file.name}`, 'success');
                } else {
                    fileName.textContent = 'Ningún archivo seleccionado';
                    sendTestBtn.disabled = true;
                    Utils.showNotification('Por favor, selecciona un archivo Excel válido (.xlsx, .xls, .csv)', 'warning');
                    fileInput.value = '';
                }
            } else {
                fileName.textContent = 'Ningún archivo seleccionado';
                sendTestBtn.disabled = true;
            }
        });
    }
};

const sendExcelToBackend = async () => {
    // Obtener elementos del DOM con validación
    const fileInput = document.getElementById('excelFileInput');
    const sendBtn = document.getElementById('sendTestBtn');
    const responseArea = document.getElementById('testResponseArea');
    const errorArea = document.getElementById('testErrorArea');
    const responseContent = document.getElementById('testResponseContent');
    const errorContent = document.getElementById('testErrorContent');

    // Validar que todos los elementos existan
    if (!fileInput || !sendBtn) {
        console.error('Elementos del DOM no encontrados');
        Utils.showNotification('Error: No se pudieron encontrar los elementos necesarios', 'danger');
        return;
    }

    // Validar que los elementos de respuesta existan
    if (!responseArea || !errorArea || !responseContent || !errorContent) {
        console.error('Elementos de respuesta no encontrados');
        Utils.showNotification('Error: No se pudieron encontrar los elementos de respuesta', 'danger');
        return;
    }

    const file = fileInput.files[0];
    
    if (!file) {
        Utils.showNotification('Por favor, selecciona un archivo Excel', 'warning');
        return;
    }

    try {
        // Mostrar estado de carga
        sendBtn.classList.add('is-loading');
        sendBtn.disabled = true;
        
        // Ocultar áreas de respuesta y error anteriores (con validación)
        if (responseArea) responseArea.style.display = 'none';
        if (errorArea) errorArea.style.display = 'none';

        // Crear FormData para enviar el archivo
        const formData = new FormData();
        formData.append('file', file);
        formData.append('view_name', 'balance');
        // formData.append('timestamp', new Date().toISOString());
        // Realizar petición POST al backend
        const response = await fetch('http://localhost:8000/api/v1/df/upload_file/mateo', {
            method: 'POST',
            body: formData,
            // No es necesario establecer Content-Type para FormData, el navegador lo hace automáticamente
            // headers: {
            //     'Content-Type': 'multipart/form-data'
            // }
        });

        // Verificar que el FormData se creó correctamente
        console.log('FormData creado:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        // Construir URL del backend
        const uploadUrl = 'http://localhost:8000/api/v1/balance/upload';
        
        // Configuración manual para asegurar que funcione
        const requestConfig = {
            method: 'POST',
            body: formData,
            // No incluir Content-Type para que el navegador lo establezca automáticamente
        };
        
        console.log('Enviando archivo a:', uploadUrl);
        console.log('Archivo:', file.name, 'Tamaño:', file.size, 'Tipo:', file.type);
        console.log('Configuración de petición:', requestConfig);

        console.log('Respuesta del servidor:', response.status, response.statusText);

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            let errorData = {};
            try {
                errorData = await response.json();
            } catch (e) {
                // Si no se puede parsear JSON, usar el texto de la respuesta
                errorData = { error: await response.text() };
            }
            
            throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        
        // Mostrar respuesta exitosa (con validación)
        if (responseContent) {
            responseContent.innerHTML = `
                <div class="notification is-success">
                    <div class="has-text-success mb-3">
                        <i class="fas fa-check-circle fa-2x"></i>
                        <h4 class="title is-5 mt-2">¡Archivo enviado exitosamente!</h4>
                    </div>
                    
                    <div class="file-info">
                        <h4 class="title is-6">Información del archivo:</h4>
                        <div class="file-info-grid">
                            <div class="file-info-item">
                                <span class="file-info-label">Nombre del archivo:</span>
                                <span class="file-info-value">${file.name}</span>
                            </div>
                            <div class="file-info-item">
                                <span class="file-info-label">Tamaño:</span>
                                <span class="file-info-value">${(file.size / 1024).toFixed(2)} KB</span>
                            </div>
                            <div class="file-info-item">
                                <span class="file-info-label">Tipo:</span>
                                <span class="file-info-value">${file.type || 'No especificado'}</span>
                            </div>
                            <div class="file-info-item">
                                <span class="file-info-label">Estado:</span>
                                <span class="file-info-value has-text-success">Procesado correctamente</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="button-group">
                        <button class="button is-success" id="refreshPageBtn">
                            <span class="icon">
                                <i class="fas fa-sync-alt"></i>
                            </span>
                            <span>Refrescar página</span>
                        </button>
                        <button class="button is-info" id="uploadAnotherBtn">
                            <span class="icon">
                                <i class="fas fa-upload"></i>
                            </span>
                            <span>Subir otro archivo</span>
                        </button>
                    </div>
                </div>
            `;
            if (responseArea) responseArea.style.display = 'block';
            
            // Agregar eventos a los nuevos botones
            const refreshBtn = document.getElementById('refreshPageBtn');
            const uploadAnotherBtn = document.getElementById('uploadAnotherBtn');
            
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => {
                    window.location.reload();
                });
            }
            
            if (uploadAnotherBtn) {
                uploadAnotherBtn.addEventListener('click', () => {
                    // Limpiar formulario y ocultar respuesta
                    const fileInput = document.getElementById('excelFileInput');
                    const fileName = document.getElementById('fileName');
                    const sendBtn = document.getElementById('sendTestBtn');
                    
                    if (fileInput) fileInput.value = '';
                    if (fileName) fileName.textContent = 'Ningún archivo seleccionado';
                    if (sendBtn) sendBtn.disabled = true;
                    
                    // Ocultar área de respuesta
                    if (responseArea) responseArea.style.display = 'none';
                    if (errorArea) errorArea.style.display = 'none';
                    
                    Utils.showNotification('Listo para subir otro archivo', 'info');
                });
            }
        }
        
        Utils.showNotification('Archivo Excel enviado exitosamente al backend', 'success');

    } catch (error) {
        console.error('Error enviando archivo al backend:', error);
        
        // Traducir error técnico a mensaje entendible
        const translatedError = translateError(error);
        
        // Mostrar error en el área de errores
        try {
            errorContent.innerHTML = `
                <div class="notification is-danger">
                    <div class="has-text-danger mb-3">
                        <i class="fas fa-exclamation-triangle fa-2x"></i>
                        <h4 class="title is-5 mt-2">Error al enviar archivo</h4>
                    </div>
                    
                    <div class="file-info">
                        <h4 class="title is-6">¿Qué pasó?</h4>
                        <div class="file-info-grid">
                            <div class="file-info-item">
                                <span class="file-info-label">Problema:</span>
                                <span class="file-info-value has-text-danger">${translatedError.message}</span>
                            </div>
                            ${translatedError.details ? `
                                <div class="file-info-item">
                                    <span class="file-info-label">Solución:</span>
                                    <span class="file-info-value has-text-warning">${translatedError.details}</span>
                                </div>
                            ` : ''}
                            <div class="file-info-item">
                                <span class="file-info-label">Archivo:</span>
                                <span class="file-info-value">${file ? file.name : 'No seleccionado'}</span>
                            </div>
                            <div class="file-info-item">
                                <span class="file-info-label">Tamaño:</span>
                                <span class="file-info-value">${file ? (file.size / 1024).toFixed(2) + ' KB' : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="button-group">
                        <button class="button is-warning" id="retryUploadBtn">
                            <span class="icon">
                                <i class="fas fa-redo"></i>
                            </span>
                            <span>Reintentar</span>
                        </button>
                        <button class="button is-info" id="clearErrorBtn">
                            <span class="icon">
                                <i class="fas fa-times"></i>
                            </span>
                            <span>Limpiar</span>
                        </button>
                    </div>
                </div>
            `;
            errorArea.style.display = 'block';
            
            // Agregar eventos a los botones de error
            const retryBtn = document.getElementById('retryUploadBtn');
            const clearBtn = document.getElementById('clearErrorBtn');
            
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    errorArea.style.display = 'none';
                    sendExcelToBackend();
                });
            }
            
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    // Limpiar formulario y ocultar error
                    const fileInput = document.getElementById('excelFileInput');
                    const fileName = document.getElementById('fileName');
                    const sendBtn = document.getElementById('sendTestBtn');
                    
                    if (fileInput) fileInput.value = '';
                    if (fileName) fileName.textContent = 'Ningún archivo seleccionado';
                    if (sendBtn) sendBtn.disabled = true;
                    
                    // Ocultar áreas
                    errorArea.style.display = 'none';
                    if (responseArea) responseArea.style.display = 'none';
                    
                    Utils.showNotification('Formulario limpiado', 'info');
                });
            }
        } catch (domError) {
            // Si hay error al mostrar el error, usar notificación simple
            console.error('Error mostrando el error:', domError);
            Utils.showNotification(translatedError.message, 'danger');
        }
        
        // Mostrar notificación con el error específico
        Utils.showNotification(translatedError.message, 'danger');

    } finally {
        // Restaurar estado del botón (con validación)
        if (sendBtn) {
            sendBtn.classList.remove('is-loading');
            sendBtn.disabled = false;
        }
    }
};

export const initializeTestView = () => {
    initializeTestSection();
    console.log('Vista de Test inicializada');
};

export const TestView = {
    getContent: getTestContent,
    initialize: initializeTestView,
    sendExcelToBackend
}; 