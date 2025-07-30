import './BalancesView.css';
import { FileUpload } from './FileUpload.js';

// Datos de ejemplo (en un proyecto real vendrían de una API)
let balancesData = [];

// Función para cargar datos del JSON
const loadBalancesData = async () => {
    try {
        // Cargar el JSON desde una ruta relativa para permitir funcionamiento offline
        const response = await fetch('./json/balances-data.json');
        const data = await response.json();
        balancesData = data.balances;
        return data;
    } catch (error) {
        console.error('Error cargando datos de balances:', error);
        // Datos de respaldo en caso de error
        balancesData = [
            {
                id: 1,
                concepto: "Venta de productos",
                categoria: "Ventas",
                monto: 15000.00,
                fecha: "2024-01-15",
                tipo: "ingreso",
                descripcion: "Venta de productos electrónicos"
            },
        ];
        return { balances: balancesData };
    }
};
// Función para calcular similitud entre strings
const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    // Coincidencia exacta
    if (s1 === s2) return 1;
    
    // Coincidencia parcial
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    // Coincidencia de palabras
    const words1 = s1.split(' ');
    const words2 = s2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    
    if (commonWords.length > 0) {
        return 0.6 + (commonWords.length * 0.1);
    }
    
    // Coincidencia de caracteres
    let matches = 0;
    const minLength = Math.min(s1.length, s2.length);
    
    for (let i = 0; i < minLength; i++) {
        if (s1[i] === s2[i]) matches++;
    }
    
    return matches / Math.max(s1.length, s2.length);

};

// Función para buscar en los datos
const searchBalances = (query, filters = {}) => {
    if (!query.trim() && Object.keys(filters).length === 0) {
        return balancesData;
    }
    
    const results = balancesData.filter(item => {
        let matches = false;
        const searchFields = [
            item.concepto,
            item.categoria,
            item.descripcion,
            item.cliente,
            item.proveedor,
            item.plataforma
        ].filter(Boolean);
        
        // Búsqueda por texto
        if (query.trim()) {
            const queryLower = query.toLowerCase();
            matches = searchFields.some(field => {
                const similarity = calculateSimilarity(field, query);
                return similarity > 0.3 || field.toLowerCase().includes(queryLower);
            });
        } else {
            matches = true;
        }
        
        // Filtros adicionales
        if (filters.categoria && item.categoria !== filters.categoria) {
            matches = false;
        }
        if (filters.tipo && item.tipo !== filters.tipo) {
            matches = false;
        }
        if (filters.metodo_pago && item.metodo_pago !== filters.metodo_pago) {
            matches = false;
        }
        
        return matches;
    });
    
    // Ordenar por relevancia
    if (query.trim()) {
        results.sort((a, b) => {
            const aScore = Math.max(
                calculateSimilarity(a.concepto, query),
                calculateSimilarity(a.categoria, query),
                calculateSimilarity(a.descripcion, query)
            );
            const bScore = Math.max(
                calculateSimilarity(b.concepto, query),
                calculateSimilarity(b.categoria, query),
                calculateSimilarity(b.descripcion, query)
            );
            return bScore - aScore;
        });
    }
    
    return results;

};

// Función para generar recomendaciones
const generateRecommendations = (query, searchResults) => {
    if (searchResults.length > 0) return [];
    
    const recommendations = [];
    
    // Recomendaciones basadas en categorías
    const categorias = [...new Set(balancesData.map(item => item.categoria))];
    recommendations.push(...categorias.slice(0, 3));
    
    // Recomendaciones basadas en conceptos populares
    const conceptos = balancesData.map(item => item.concepto);
    const palabrasComunes = conceptos
        .join(' ')
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 3)
        .filter((word, index, arr) => arr.indexOf(word) === index)
        .slice(0, 5);
    
    recommendations.push(...palabrasComunes);
    
    return [...new Set(recommendations)].slice(0, 6);

};

// Función para formatear monto
const formatMonto = (monto) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(monto);
};

// Función para formatear fecha
const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Función para renderizar resultados
const renderSearchResults = (results, query) => {
    if (results.length === 0) {
        const recommendations = generateRecommendations(query, results);
        return `
            <div class="search-state no-results">
                <i class="fas fa-search fa-2x mb-3"></i>
                <h3>No se encontraron resultados para "${query}"</h3>
                <p>Intenta con otros términos de búsqueda</p>
                
                ${recommendations.length > 0 ? `
                    <div class="recommendations">
                        <h4>¿Quizás quisiste buscar?</h4>
                        <div class="recommendation-tags">
                            ${recommendations.map(rec => `
                                <span class="recommendation-tag" onclick="handleRecommendationClick('${rec}')">
                                    ${rec}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    return `
        <div class="search-results">
            <h3 class="mb-3">${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}</h3>
            ${results.map(item => `
                <div class="result-item" onclick="handleResultClick(${item.id})">
                    <div class="result-header">
                        <h4 class="result-concepto">${item.concepto}</h4>
                        <span class="result-monto ${item.tipo}">
                            ${item.tipo === 'ingreso' ? '+' : '-'} ${formatMonto(item.monto)}
                        </span>
                    </div>
                    <div class="result-details">
                        <div class="result-detail">
                            <i class="fas fa-tag"></i>
                            <span>${item.categoria}</span>
                        </div>
                        <div class="result-detail">
                            <i class="fas fa-calendar"></i>
                            <span>${formatFecha(item.fecha)}</span>
                        </div>
                        ${item.descripcion ? `
                            <div class="result-detail">
                                <i class="fas fa-info-circle"></i>
                                <span>${item.descripcion}</span>
                            </div>
                        ` : ''}
                        ${item.cliente ? `
                            <div class="result-detail">
                                <i class="fas fa-user"></i>
                                <span>${item.cliente}</span>
                            </div>
                        ` : ''}
                        ${item.proveedor ? `
                            <div class="result-detail">
                                <i class="fas fa-building"></i>
                                <span>${item.proveedor}</span>
                            </div>
                        ` : ''}
                        ${item.metodo_pago ? `
                            <div class="result-detail">
                                <i class="fas fa-credit-card"></i>
                                <span>${item.metodo_pago}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};

// Función para manejar la búsqueda
const handleSearch = async (query, filters = {}) => {
    const searchContainer = document.getElementById('searchResults');
    
    if (!query.trim() && Object.keys(filters).length === 0) {
        searchContainer.innerHTML = `
            <div class="search-state empty">
                <i class="fas fa-search fa-2x mb-3"></i>
                <h3>Busca en tus balances</h3>
                <p>Escribe para buscar por concepto, categoría, descripción, etc.</p>
            </div>
        `;
        return;
    }
    
    // Mostrar estado de carga
    searchContainer.innerHTML = `
        <div class="search-state loading">
            <div class="loading-spinner mb-3"></div>
            <p>Buscando...</p>
        </div>
    `;
    
    // Simular delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Realizar búsqueda
    const results = searchBalances(query, filters);
    searchContainer.innerHTML = renderSearchResults(results, query);
};

// Funciones globales para eventos
window.handleRecommendationClick = (recommendation) => {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = recommendation;
    handleSearch(recommendation);
};

window.handleResultClick = (id) => {
    const item = balancesData.find(item => item.id === id);
    if (item) {
        alert(`Detalles del balance:\n\nConcepto: ${item.concepto}\nMonto: ${formatMonto(item.monto)}\nCategoría: ${item.categoria}\nFecha: ${formatFecha(item.fecha)}`);
    }
};

const getBalancesContent = () => {
    return `
        <div class="content-card">
            <div class="card-header" style="display: flex; align-items: center; justify-content: space-between;">
                <h2 class="card-title">Saldos</h2>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div class="user-dropdown-container">
                        <select id="userDropdown" class="user-dropdown">
                            <option value="" disabled>Seleccionar usuario</option>
                            <option value="Tatiana">Tatiana</option>
                            <option value="Adriana">Adriana</option>
                            <option value="Lina">Lina</option>
                            <option value="Juan">Juan</option>
                        </select>
                        <span id="userDropdownMsg" class="user-dropdown-msg" style="margin-left:0.5em;"></span>
                    </div>
                    <div class="card-actions">
                        <button class="button is-primary" id="uploadBtn">
                            <span class="icon">
                                <i class="fas fa-upload"></i>
                            </span>
                            <span>Subir archivo</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <!-- Área de upload -->
                <div id="fileUploadContainer" style="display: none;">
                    <!-- El componente FileUpload se renderizará aquí -->
                </div>
                
                <!-- Cajón de búsqueda -->
                <div class="search-container" id="searchContainer">
                    <div class="search-input-wrapper">
                        <input 
                            type="text" 
                            id="searchInput" 
                            class="search-input" 
                            placeholder="Buscar en balances..."
                            autocomplete="off"
                        >
                        <i class="fas fa-search search-icon"></i>
                    </div>
                    
                    <!-- Filtros adicionales -->
                    <div class="search-filters">
                        <select id="categoriaFilter" class="filter-select">
                            <option value="">Todas las categorías</option>
                        </select>
                        <select id="tipoFilter" class="filter-select">
                            <option value="">Todos los tipos</option>
                            <option value="ingreso">Ingresos</option>
                            <option value="egreso">Egresos</option>
                        </select>
                        <select id="metodoPagoFilter" class="filter-select">
                            <option value="">Todos los métodos</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="transferencia">Transferencia</option>
                            <option value="tarjeta">Tarjeta</option>
                        </select>
                    </div>
                </div>
                
                <!-- Área de resultados -->
                <div id="searchResults">
                    <div class="search-state empty">
                        <i class="fas fa-search fa-2x mb-3"></i>
                        <h3>Busca en tus balances</h3>
                        <p>Escribe para buscar por concepto, categoría, descripción, etc.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}


// Variable global para el usuario activo
let usuarioActivo = '';

// Inicializar el menú desplegable de usuario y guardar en localStorage/sessionStorage
const initializeUserDropdown = () => {
    const userDropdown = document.getElementById('userDropdown');
    const msg = document.getElementById('userDropdownMsg');
    if (!userDropdown) return;

    // Cargar usuario guardado
    let savedUser = localStorage.getItem('lider_activo') || sessionStorage.getItem('lider_activo');
    if (savedUser && Array.from(userDropdown.options).some(opt => opt.value === savedUser)) {
        userDropdown.value = savedUser;
        usuarioActivo = savedUser;
        // Guardar explícitamente en ambos storages
        localStorage.setItem('lider_activo', savedUser);
        sessionStorage.setItem('lider_activo', savedUser);
    } else {
        userDropdown.value = '';
        usuarioActivo = '';
        savedUser = '';
        localStorage.removeItem('lider_activo');
        sessionStorage.removeItem('lider_activo');
    }

    userDropdown.addEventListener('change', (e) => {
        const selectedUser = e.target.value;
        if (selectedUser) {
            usuarioActivo = selectedUser;
            // Guardar explícitamente en ambos storages
            localStorage.setItem('lider_activo', selectedUser);
            sessionStorage.setItem('lider_activo', selectedUser);
            if (msg) {
                msg.textContent = `Líder activo: ${selectedUser}`;
                msg.style.color = '#d32f2f';
            }
        } else {
            usuarioActivo = '';
            localStorage.removeItem('lider_activo');
            sessionStorage.removeItem('lider_activo');
            if (msg) {
                msg.textContent = 'Selecciona un usuario';
                msg.style.color = '#111';
            }
        }
        // Mensaje visual temporal
        if (msg) {
            msg.style.opacity = 1;
            setTimeout(() => { msg.style.opacity = 0.5; }, 2000);
        }
    });

    // Mostrar mensaje visual inicial
    if (msg) {
        if (userDropdown.value) {
            msg.textContent = `Líder activo: ${userDropdown.value}`;
            msg.style.color = '#d32f2f';
        } else {
            msg.textContent = 'Selecciona un usuario';
            msg.style.color = '#111';
        }
        msg.style.opacity = 1;
    }
};

const initializeBalancesView = async () => {
    try {
        // Inicializar menú de usuario inmediatamente después de renderizar el contenido
        initializeUserDropdown();

        // Cargar datos
        const data = await loadBalancesData();
        
        // Llenar filtros de categorías
        const categoriaFilter = document.getElementById('categoriaFilter');
        if (categoriaFilter && data.categorias) {
            data.categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria;
                option.textContent = categoria;
                categoriaFilter.appendChild(option);
            });
        }
        
        // Configurar eventos de búsqueda
        const searchInput = document.getElementById('searchInput');
        const categoriaFilterEl = document.getElementById('categoriaFilter');
        const tipoFilterEl = document.getElementById('tipoFilter');
        const metodoPagoFilterEl = document.getElementById('metodoPagoFilter');
        
        let searchTimeout;
        
        const performSearch = () => {
            const query = searchInput.value;
            const filters = {
                categoria: categoriaFilterEl.value,
                tipo: tipoFilterEl.value,
                metodo_pago: metodoPagoFilterEl.value
            };
            handleSearch(query, filters);
        };
        
        // Evento de búsqueda con debounce
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 300);
        });
        
        // Eventos de filtros
        [categoriaFilterEl, tipoFilterEl, metodoPagoFilterEl].forEach(filter => {
            filter.addEventListener('change', performSearch);
        });
        
        // Evento de tecla Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Configurar eventos de upload
        const uploadBtn = document.getElementById('uploadBtn');
        const showUploadBtn = document.getElementById('showUploadBtn');
        const fileUploadContainer = document.getElementById('fileUploadContainer');
        const searchContainer = document.getElementById('searchContainer');
        
        const showUpload = async () => {
            fileUploadContainer.style.display = 'block';
            searchContainer.style.display = 'none';
            
            // Inicializar componente de upload si no existe
            if (!window.fileUpload) {
                const { FileUpload } = await import('./FileUpload.js');
                window.fileUpload = new FileUpload('fileUploadContainer');
            }
        };
        
        const hideUpload = () => {
            fileUploadContainer.style.display = 'none';
            searchContainer.style.display = 'block';
            
            if (window.fileUpload) {
                window.fileUpload.reset();
            }
        };
        
        // Eventos de botones de upload
        if (uploadBtn) {
            uploadBtn.addEventListener('click', showUpload);
        }
        
        if (showUploadBtn) {
            showUploadBtn.addEventListener('click', showUpload);
        }
        
        // Agregar botón para volver a la búsqueda
        const backToSearchBtn = document.createElement('button');
        backToSearchBtn.className = 'button is-small';
        backToSearchBtn.innerHTML = `
            <span class="icon">
                <i class="fas fa-arrow-left"></i>
            </span>
            <span>Volver a búsqueda</span>
        `;
        backToSearchBtn.addEventListener('click', hideUpload);
        
        // Insertar botón en el header del upload
        setTimeout(() => {
            const uploadHeader = fileUploadContainer.querySelector('.upload-content');
            if (uploadHeader) {
                uploadHeader.appendChild(backToSearchBtn);
            }
        }, 100);
        
        console.log('Vista de Balances inicializada con búsqueda, upload y menú de usuario');
        
    } catch (error) {
        console.error('Error inicializando vista de Balances:', error);
    }
}

export const BalancesView = {
    getContent: getBalancesContent,
    initialize: initializeBalancesView
};