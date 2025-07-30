// Configuración de API para TUYA Fast-Data

// Configuración del backend
export const API_CONFIG = {
    // URL base del backend - ajustar según tu configuración
    BASE_URL: 'http://localhost:8000',
    
    // Endpoints específicos
    ENDPOINTS: {
        UPLOAD_BALANCE: '/api/v1/balance/upload',
        TEST_UPLOAD: '/test',
        BALANCES: '/api/v1/balances',
        REPORTS: '/api/v1/reports'
    },
    
    // Configuración de peticiones
    REQUEST_CONFIG: {
        TIMEOUT: 30000, // 30 segundos
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000 // 1 segundo
    },
    
    // Headers por defecto
    DEFAULT_HEADERS: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};

// Función para construir URLs completas
export const buildApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para obtener configuración de petición
export const getRequestConfig = (method = 'GET', body = null, customHeaders = {}) => {
    const config = {
        method,
        headers: {
            ...API_CONFIG.DEFAULT_HEADERS,
            ...customHeaders
        },
        timeout: API_CONFIG.REQUEST_CONFIG.TIMEOUT
    };
    
    // Para FormData, no incluir Content-Type para que el navegador lo establezca
    if (body instanceof FormData) {
        delete config.headers['Content-Type'];
    } else if (body) {
        config.body = JSON.stringify(body);
    }
    
    return config;
};

// Función para manejar errores de red
export const handleNetworkError = (error) => {
    console.error('Error de red:', error);
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return {
            type: 'CONNECTION_ERROR',
            message: 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.',
            details: 'El servidor no responde o no está disponible'
        };
    }
    
    if (error.message.includes('CORS')) {
        return {
            type: 'CORS_ERROR',
            message: 'Error de CORS: El servidor no permite peticiones desde este origen.',
            details: 'Contacta al administrador para configurar CORS'
        };
    }
    
    if (error.message.includes('NetworkError')) {
        return {
            type: 'NETWORK_ERROR',
            message: 'Error de red: No se pudo establecer conexión con el servidor.',
            details: 'Verifica tu conexión a internet'
        };
    }
    
    return {
        type: 'UNKNOWN_ERROR',
        message: 'Error desconocido al comunicarse con el servidor.',
        details: error.message
    };
};

// Función para validar respuesta del servidor
export const validateResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = `Error del servidor: ${response.status}`;
        
        try {
            const errorData = await response.text();
            if (errorData) {
                errorMessage += ` - ${errorData}`;
            }
        } catch (e) {
            // Si no se puede leer el error, usar el status text
            errorMessage += ` - ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
    }
    
    return response;
};

// Función para hacer peticiones con retry
export const fetchWithRetry = async (url, config, retryAttempts = API_CONFIG.REQUEST_CONFIG.RETRY_ATTEMPTS) => {
    let lastError;
    
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
        try {
            console.log(`Intento ${attempt}/${retryAttempts} para: ${url}`);
            
            const response = await fetch(url, config);
            return await validateResponse(response);
            
        } catch (error) {
            lastError = error;
            console.warn(`Intento ${attempt} falló:`, error.message);
            
            if (attempt < retryAttempts) {
                await new Promise(resolve => setTimeout(resolve, API_CONFIG.REQUEST_CONFIG.RETRY_DELAY));
            }
        }
    }
    
    throw lastError;
}; 