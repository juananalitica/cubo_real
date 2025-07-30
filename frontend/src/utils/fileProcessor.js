import { Utils } from './utils.js'

// Librerías para procesamiento de archivos
let Papa = null; // Para CSV
let XLSX = null; // Para Excel

// Cargar librerías dinámicamente
const loadLibraries = async () => {
    try {
        // Cargar Papa Parse para CSV
        if (!Papa) {
            Papa = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/dist/papaparse.min.js');
        }
        
        // Cargar SheetJS para Excel
        if (!XLSX) {
            XLSX = await import('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
        }
    } catch (error) {
        console.error('Error cargando librerías:', error);
        throw new Error('No se pudieron cargar las librerías de procesamiento');
    }
};

// Validación de archivos
const validateFile = (file) => {
    const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv',
        'application/csv'
    ];
    
    const allowedExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    const isValidType = allowedTypes.includes(file.type);
    const isValidExtension = allowedExtensions.includes(fileExtension);
    
    return isValidType || isValidExtension;
};

// Limpieza básica de datos
const cleanData = (data) => {
    if (!Array.isArray(data)) {
        throw new Error('Los datos deben ser un array');
    }
    
    return data.map(row => {
        const cleanRow = {};
        for (const [key, value] of Object.entries(row)) {
            // Manejar valores nulos/undefined
            if (value === null || value === undefined || value === '') {
                cleanRow[key] = null;
            }
            // Manejar NaN
            else if (typeof value === 'number' && isNaN(value)) {
                cleanRow[key] = null;
            }
            // Manejar fechas
            else if (value instanceof Date) {
                cleanRow[key] = value.toISOString();
            }
            // Manejar strings vacíos
            else if (typeof value === 'string' && value.trim() === '') {
                cleanRow[key] = null;
            }
            else {
                cleanRow[key] = value;
            }
        }
        return cleanRow;
    });
};

// Conversión de tipos de datos
const convertDataTypes = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
        return data;
    }
    
    const sampleRow = data[0];
    const convertedData = [];
    
    for (const row of data) {
        const convertedRow = {};
        
        for (const [key, value] of Object.entries(row)) {
            if (value === null) {
                convertedRow[key] = null;
                continue;
            }
            
            // Intentar convertir a número
            if (!isNaN(value) && value !== '') {
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                    convertedRow[key] = numValue;
                    continue;
                }
            }
            
            // Intentar convertir a fecha
            const dateValue = new Date(value);
            if (!isNaN(dateValue.getTime()) && value.toString().match(/^\d{4}-\d{2}-\d{2}/)) {
                convertedRow[key] = dateValue.toISOString();
                continue;
            }
            
            // Mantener como string
            convertedRow[key] = String(value);
        }
        
        convertedData.push(convertedRow);
    }
    
    return convertedData;
};

// Procesamiento de CSV
const processCSV = async (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    console.warn('Errores en CSV:', results.errors);
                }
                resolve(results.data);
            },
            error: (error) => {
                reject(new Error(`Error procesando CSV: ${error.message}`));
            }
        });
    });
};

// Procesamiento de Excel
const processExcel = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Obtener la primera hoja
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convertir a JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Convertir a formato con headers
        if (jsonData.length > 0) {
            const headers = jsonData[0];
            const data = jsonData.slice(1).map(row => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index] || null;
                });
                return obj;
            });
            return data;
        }
        
        return [];
    } catch (error) {
        throw new Error(`Error procesando Excel: ${error.message}`);
    }
};

// Análisis básico de datos
const analyzeData = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
        return {
            rowCount: 0,
            columnCount: 0,
            columns: [],
            dataTypes: {},
            nullCounts: {},
            uniqueCounts: {}
        };
    }
    
    const columns = Object.keys(data[0]);
    const dataTypes = {};
    const nullCounts = {};
    const uniqueCounts = {};
    
    // Analizar cada columna
    for (const column of columns) {
        const values = data.map(row => row[column]).filter(val => val !== null);
        
        // Contar valores nulos
        nullCounts[column] = data.length - values.length;
        
        // Contar valores únicos
        uniqueCounts[column] = new Set(values).size;
        
        // Determinar tipo de datos
        if (values.length > 0) {
            const sampleValue = values[0];
            if (typeof sampleValue === 'number') {
                dataTypes[column] = 'number';
            } else if (sampleValue instanceof Date || typeof sampleValue === 'string' && sampleValue.match(/^\d{4}-\d{2}-\d{2}/)) {
                dataTypes[column] = 'date';
            } else {
                dataTypes[column] = 'string';
            }
        } else {
            dataTypes[column] = 'unknown';
        }
    }
    
    return {
        rowCount: data.length,
        columnCount: columns.length,
        columns,
        dataTypes,
        nullCounts,
        uniqueCounts
    };
};

// Función principal de procesamiento
export const processFileFrontend = async (file) => {
    try {
        // Validar archivo
        if (!validateFile(file)) {
            throw new Error('Tipo de archivo no válido. Solo se permiten archivos .xlsx, .xls y .csv');
        }
        
        // Cargar librerías si es necesario
        await loadLibraries();
        
        // Procesar archivo según su tipo
        let rawData;
        if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
            rawData = await processCSV(file);
        } else {
            rawData = await processExcel(file);
        }
        
        // Limpiar datos
        const cleanData = cleanData(rawData);
        
        // Convertir tipos de datos
        const convertedData = convertDataTypes(cleanData);
        
        // Analizar datos
        const analysis = analyzeData(convertedData);
        
        // Preparar información del archivo
        const fileInfo = {
            filename: file.name,
            size_bytes: file.size,
            size_kb: Math.round(file.size / 1024 * 100) / 100,
            rows: analysis.rowCount,
            columns: analysis.columnCount,
            column_names: analysis.columns,
            upload_timestamp: new Date().toISOString(),
            processed_at: new Date().toISOString()
        };
        
        // Obtener preview (primeras 5 filas)
        const preview = convertedData.slice(0, 5);
        
        return {
            success: true,
            data: convertedData,
            fileInfo,
            analysis,
            preview
        };
        
    } catch (error) {
        console.error('Error procesando archivo:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Función para enviar datos al backend
export const sendToBackend = async (processedData, endpoint = '/api/v1/balance/upload') => {
    try {
        const formData = new FormData();
        
        // Crear un archivo temporal con los datos procesados
        const jsonBlob = new Blob([JSON.stringify(processedData.data)], { type: 'application/json' });
        formData.append('file', jsonBlob, 'processed_data.json');
        formData.append('timestamp', processedData.fileInfo.upload_timestamp);
        formData.append('source', 'frontend_processed');
        formData.append('analysis', JSON.stringify(processedData.analysis));
        
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        
        const result = await response.json();
        return {
            success: true,
            backendResult: result,
            frontendData: processedData
        };
        
    } catch (error) {
        console.error('Error enviando al backend:', error);
        return {
            success: false,
            error: error.message,
            frontendData: processedData // Retornar datos del frontend como fallback
        };
    }
};

// Función de utilidad para mostrar progreso
export const showProcessingProgress = (message) => {
    Utils.showNotification(message, 'info');
};

// Función para validar datos antes de enviar
export const validateProcessedData = (data) => {
    if (!data || !Array.isArray(data)) {
        return { valid: false, error: 'Datos inválidos' };
    }
    
    if (data.length === 0) {
        return { valid: false, error: 'El archivo está vacío' };
    }
    
    // Verificar que todas las filas tengan la misma estructura
    const firstRowKeys = Object.keys(data[0]);
    for (let i = 1; i < data.length; i++) {
        const rowKeys = Object.keys(data[i]);
        if (rowKeys.length !== firstRowKeys.length) {
            return { valid: false, error: `Fila ${i + 1} tiene estructura diferente` };
        }
    }
    
    return { valid: true };
}; 