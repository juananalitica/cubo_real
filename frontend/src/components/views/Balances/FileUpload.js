import { processFileFrontend, sendToBackend, showProcessingProgress } from '../../../utils/fileProcessor.js'
import { Utils } from '../../../utils/utils.js'
import './FileUpload.css'

export class FileUpload {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.container.innerHTML = `
            <div class="file-upload-container">
                <div class="upload-area" id="uploadArea">
                    <div class="upload-content">
                        <i class="fas fa-cloud-upload-alt fa-3x mb-3"></i>
                        <h3 class="title is-4">Subir archivo de balance</h3>
                        <p class="subtitle is-6">Arrastra y suelta tu archivo Excel o CSV aquí</p>
                        <p class="help">Soporta archivos .xlsx, .xls, .csv</p>
                        
                        <div class="file-input-wrapper mt-4">
                            <input type="file" id="fileInput" accept=".xlsx,.xls,.csv" style="display: none;">
                            <button class="button is-primary" id="selectFileBtn">
                                <span class="icon">
                                    <i class="fas fa-file-upload"></i>
                                </span>
                                <span>Seleccionar archivo</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="processing-status" id="processingStatus" style="display: none;">
                    <div class="notification is-info">
                        <div class="content">
                            <div class="has-text-centered">
                                <div class="loading-spinner mb-3"></div>
                                <h4 class="title is-5">Procesando archivo...</h4>
                                <p id="processingMessage">Iniciando procesamiento...</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="results-container" id="resultsContainer" style="display: none;">
                    <div class="notification is-success">
                        <div class="content">
                            <h4 class="title is-5">Archivo procesado exitosamente</h4>
                            <div id="fileInfo"></div>
                            <div id="analysisInfo"></div>
                            <div id="recommendationsInfo"></div>
                        </div>
                    </div>
                </div>
                
                <div class="error-container" id="errorContainer" style="display: none;">
                    <div class="notification is-danger">
                        <div class="content">
                            <h4 class="title is-5">Error procesando archivo</h4>
                            <p id="errorMessage"></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const selectFileBtn = document.getElementById('selectFileBtn');

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        // Click to select file
        selectFileBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    async handleFile(file) {
        try {
            this.showProcessing();
            this.updateProcessingMessage('Validando archivo...');

            // Procesar en frontend
            this.updateProcessingMessage('Procesando datos en el navegador...');
            const frontendResult = await processFileFrontend(file);

            if (!frontendResult.success) {
                throw new Error(frontendResult.error);
            }

            this.updateProcessingMessage('Enviando datos al servidor...');
            
            // Enviar al backend
            const backendResult = await sendToBackend(frontendResult);

            if (backendResult.success) {
                this.showResults(frontendResult, backendResult);
            } else {
                // Fallback: usar solo datos del frontend
                this.showResults(frontendResult, null);
                Utils.showNotification('Procesamiento completado (solo frontend)', 'warning');
            }

        } catch (error) {
            console.error('Error procesando archivo:', error);
            this.showError(error.message);
        } finally {
            this.hideProcessing();
        }
    }

    showProcessing() {
        this.isProcessing = true;
        document.getElementById('processingStatus').style.display = 'block';
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('errorContainer').style.display = 'none';
    }

    hideProcessing() {
        this.isProcessing = false;
        document.getElementById('processingStatus').style.display = 'none';
    }

    updateProcessingMessage(message) {
        document.getElementById('processingMessage').textContent = message;
    }

    showResults(frontendData, backendData) {
        const resultsContainer = document.getElementById('resultsContainer');
        const fileInfo = document.getElementById('fileInfo');
        const analysisInfo = document.getElementById('analysisInfo');
        const recommendationsInfo = document.getElementById('recommendationsInfo');

        // Información del archivo
        fileInfo.innerHTML = `
            <div class="columns">
                <div class="column">
                    <strong>Archivo:</strong> ${frontendData.fileInfo.filename}<br>
                    <strong>Tamaño:</strong> ${frontendData.fileInfo.size_kb} KB<br>
                    <strong>Filas:</strong> ${frontendData.fileInfo.rows}<br>
                    <strong>Columnas:</strong> ${frontendData.fileInfo.columns}
                </div>
                <div class="column">
                    <strong>Procesamiento:</strong> ${backendData ? 'Híbrido (Frontend + Backend)' : 'Solo Frontend'}<br>
                    <strong>Memoria usada:</strong> ${backendData?.backendResult?.file_info?.memory_usage_mb || 'N/A'} MB<br>
                    <strong>Columnas:</strong> ${frontendData.fileInfo.column_names.join(', ')}
                </div>
            </div>
        `;

        // Análisis de datos
        if (backendData && backendData.backendResult.analysis) {
            const analysis = backendData.backendResult.analysis;
            analysisInfo.innerHTML = `
                <h5 class="title is-6 mt-4">Análisis de datos</h5>
                <div class="columns">
                    <div class="column">
                        <strong>Filas duplicadas:</strong> ${analysis.data_quality.duplicate_rows}<br>
                        <strong>Columnas vacías:</strong> ${analysis.data_quality.empty_columns.length}<br>
                        <strong>Uso de memoria:</strong> ${analysis.basic_stats.memory_usage_mb} MB
                    </div>
                    <div class="column">
                        <strong>Calidad de datos:</strong><br>
                        ${Object.entries(analysis.column_analysis).map(([col, info]) => 
                            `${col}: ${info.null_percentage}% nulos`
                        ).join('<br>')}
                    </div>
                </div>
            `;
        }

        // Recomendaciones
        if (backendData && backendData.backendResult.recommendations) {
            const recommendations = backendData.backendResult.recommendations;
            recommendationsInfo.innerHTML = `
                <h5 class="title is-6 mt-4">Recomendaciones</h5>
                ${Object.entries(recommendations).map(([category, items]) => 
                    items.length > 0 ? `
                        <div class="mb-2">
                            <strong>${category}:</strong><br>
                            ${items.map(item => `• ${item}`).join('<br>')}
                        </div>
                    ` : ''
                ).join('')}
            `;
        }

        resultsContainer.style.display = 'block';
        Utils.showNotification('Archivo procesado exitosamente', 'success');
    }

    showError(message) {
        const errorContainer = document.getElementById('errorContainer');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.textContent = message;
        errorContainer.style.display = 'block';
        
        Utils.showNotification('Error procesando archivo', 'error');
    }

    // Métodos públicos
    reset() {
        this.hideProcessing();
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('errorContainer').style.display = 'none';
        document.getElementById('fileInput').value = '';
    }

    getProcessedData() {
        // Retornar datos procesados si están disponibles
        return this.lastProcessedData;
    }
} 