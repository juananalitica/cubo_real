(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const j=(e,t)=>{try{return localStorage.setItem(e,JSON.stringify(t)),!0}catch(n){return console.error("Error al guardar en localStorage:",n),!1}},q=(e,t=null)=>{try{const n=localStorage.getItem(e);return n?JSON.parse(n):t}catch(n){return console.error("Error al leer de localStorage:",n),t}},H=e=>{try{return localStorage.removeItem(e),!0}catch(t){return console.error("Error al eliminar de localStorage:",t),!1}},W=async e=>{try{const t=await fetch(e);if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);return await t.json()}catch(t){return console.error(`Error fetching ${e}:`,t),null}},J=e=>typeof e!="string"?"":e.replace(/[<>]/g,"").trim(),K=e=>!(typeof e!="string"||e.trim().length===0||e.length>1e3),Y=(e,t)=>{let n;return function(...s){const o=()=>{clearTimeout(n),e(...s)};clearTimeout(n),n=setTimeout(o,t)}},T=(e,t="info",n=3e3)=>{document.querySelectorAll(".notification").forEach(c=>c.remove());const s=document.createElement("div");s.className=`notification is-${t}`;const o=document.createElement("button");o.className="delete",o.onclick=()=>s.remove();const i=document.createElement("div");i.textContent=e,s.appendChild(o),s.appendChild(i),document.body.appendChild(s),n>0&&setTimeout(()=>{s.parentNode&&s.remove()},n)},G=(e,t="")=>{console.error(`Error en ${t}:`,e),T(`Error: ${e.message}`,"danger")},Q=()=>window.innerWidth<=768,X=()=>Date.now().toString(36)+Math.random().toString(36).substr(2),Z=e=>e?new Date(e).toLocaleDateString("es-ES",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"}):"",ee=e=>e?new Date(e).toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"}):"",te=e=>e?e.charAt(0).toUpperCase()+e.slice(1).toLowerCase():"",ne=(e,t=100)=>!e||e.length<=t?e:e.substring(0,t)+"...",ae=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),se=e=>{try{return new URL(e),!0}catch{return!1}},ie=async e=>{try{return await navigator.clipboard.writeText(e),T("Copiado al portapapeles","success"),!0}catch(t){return console.error("Error al copiar:",t),!1}},oe=(e,t,n="text/plain")=>{const a=new Blob([e],{type:n}),s=URL.createObjectURL(a),o=document.createElement("a");o.href=s,o.download=t,document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(s)},re=e=>new Promise((t,n)=>{const a=new FileReader;a.onload=s=>t(s.target.result),a.onerror=s=>n(s),a.readAsText(e)}),$=e=>new Promise(t=>setTimeout(t,e)),ce=async(e,t=3,n=1e3)=>{for(let a=0;a<t;a++)try{return await e()}catch(s){if(a===t-1)throw s;await $(n*Math.pow(2,a))}},N=e=>e!==null&&typeof e=="object"&&!Array.isArray(e),le=e=>Array.isArray(e)&&e.length>0,de=(...e)=>e.reduce((t,n)=>N(n)?{...t,...n}:t,{}),ue=(e,t)=>Object.fromEntries(Object.entries(e).filter(([n,a])=>t(n,a))),pe=(e,t,n=void 0)=>t.split(".").reduce((a,s)=>a&&a[s]!==void 0?a[s]:n,e),fe=(e,t,n)=>{const a=t.split("."),s=a.pop(),o=a.reduce((i,c)=>((!i[c]||typeof i[c]!="object")&&(i[c]={}),i[c]),e);return o[s]=n,e},r={saveToLocalStorage:j,getFromLocalStorage:q,removeFromLocalStorage:H,fetchJson:W,sanitizeInput:J,isValidInput:K,debounce:Y,showNotification:T,handleError:G,isMobile:Q,generateId:X,formatDate:Z,formatShortDate:ee,capitalize:te,truncateText:ne,isValidEmail:ae,isValidUrl:se,copyToClipboard:ie,downloadFile:oe,readFile:re,sleep:$,retry:ce,isValidObject:N,isValidArray:le,mergeObjects:de,filterObject:ue,getNestedValue:pe,setNestedValue:fe},F={balances:"Saldos",sales:"Ventas",inventory:"Inventario",customers:"Clientes",reports:"Reportes",test:"Test",settings:"Configuración"},ve=()=>{const e={isInitialized:!1};return{state:e,setState:n=>{Object.assign(e,n)}}},x=e=>F[e]||e,k=e=>{try{const t=`${window.location.pathname}#${e}`;window.history.pushState({sectionId:e},"",t)}catch(t){console.warn("No se pudo actualizar la URL:",t)}},me=()=>window.location.hash.replace("#","")||"balances",ge=e=>Object.keys(F).includes(e),z=()=>{const e=me();if(ge(e)){const t=new CustomEvent("sectionChanged",{detail:{sectionId:e,section:{id:e,title:x(e)}}});document.dispatchEvent(t),window.sidebar&&window.sidebar.setActiveSection&&window.sidebar.setActiveSection(e)}},R=()=>{document.querySelectorAll(".modal").forEach(t=>t.remove())},he=e=>{const{sectionId:t,section:n}=e;try{window.navbar&&window.navbar.updatePageTitle&&window.navbar.updatePageTitle(x(t)),window.sectionContent&&window.sectionContent.loadSection&&window.sectionContent.loadSection(t),k(t)}catch(a){r.handleError(a,`Cambio de sección a ${t}`)}},be=e=>{switch(e.key){case"Escape":R();break;case"F5":e.preventDefault(),r.showNotification("Usa Ctrl+R para recargar","info");break}},ye=()=>{r.isMobile()&&window.sidebar&&window.sidebar.isSidebarCollapsed&&!window.sidebar.isSidebarCollapsed()&&window.sidebar.closeMobileSidebar&&window.sidebar.closeMobileSidebar()},we=e=>{z()},Ee=()=>{window.addEventListener("error",e=>{r.handleError(e.error,"Error global")}),window.addEventListener("unhandledrejection",e=>{r.handleError(new Error(e.reason),"Promesa rechazada")}),document.addEventListener("sectionChanged",e=>{he(e.detail)}),document.addEventListener("keydown",be),window.addEventListener("resize",r.debounce(ye,250)),window.addEventListener("popstate",we)},Se=async()=>{try{if(typeof window.sidebar>"u")throw new Error("Componente Sidebar no está disponible");if(typeof window.navbar>"u")throw new Error("Componente Navbar no está disponible");if(typeof window.sectionContent>"u")throw new Error("Componente SectionContent no está disponible")}catch(e){r.handleError(e,"Inicializar componentes")}},Ce=async()=>{},Te=()=>{try{z()}catch(e){r.handleError(e,"Inicializar navegación")}},xe=()=>{try{const e={settings:{sidebarCollapsed:window.sidebar&&window.sidebar.isSidebarCollapsed?window.sidebar.isSidebarCollapsed():!1,currentSection:window.sidebar&&window.sidebar.getCurrentSection?window.sidebar.getCurrentSection():null},exportDate:new Date().toISOString()};return JSON.stringify(e,null,2)}catch(e){return r.handleError(e,"Exportar datos"),null}},Ie=e=>{try{const t=JSON.parse(e);return t.settings&&(t.settings.sidebarCollapsed!==void 0&&r.saveToLocalStorage("sidebarCollapsed",t.settings.sidebarCollapsed),t.settings.currentSection&&r.saveToLocalStorage("currentSection",t.settings.currentSection.id)),r.showNotification("Datos importados exitosamente","success"),!0}catch(t){return r.handleError(t,"Importar datos"),!1}},Be=async()=>{try{localStorage.clear(),window.location.reload()}catch(e){r.handleError(e,"Reiniciar aplicación")}},Le=()=>{const{state:e,setState:t}=ve(),n=async()=>{if(!e.isInitialized)try{await Se(),Ee(),await Ce(),Te(),t({isInitialized:!0}),r.showNotification("¡Bienvenido a TUYA Fast-Data!","success",2e3),console.log("Aplicación TUYA Fast-Data inicializada correctamente")}catch(s){r.handleError(s,"Inicialización de la aplicación")}};return(async()=>{try{document.readyState==="loading"?document.addEventListener("DOMContentLoaded",n):n()}catch(s){r.handleError(s,"Inicialización de la aplicación")}})(),{getState:()=>({...e}),restart:Be,exportAppData:xe,importAppData:Ie,getSectionTitle:x,updateURL:k,closeAllModals:R,getAppInfo:()=>({name:"TUYA Fast-Data",version:"1.0.0",initialized:e.isInitialized,currentSection:window.sidebar&&window.sidebar.getCurrentSection?window.sidebar.getCurrentSection():null,sidebarCollapsed:window.sidebar&&window.sidebar.isSidebarCollapsed?window.sidebar.isSidebarCollapsed():!1}),reinit:n}},Ae=[{id:"balances",title:"Saldos",icon:"fas fa-chart-pie",route:"/balances"},{id:"sales",title:"Ventas",icon:"fas fa-chart-line",route:"/sales"},{id:"inventory",title:"Inventario",icon:"fas fa-boxes",route:"/inventory"},{id:"customers",title:"Clientes",icon:"fas fa-users",route:"/customers"},{id:"reports",title:"Reportes",icon:"fas fa-file-alt",route:"/reports"},{id:"test",title:"Test",icon:"fas fa-flask",route:"/test"},{id:"settings",title:"Configuración",icon:"fas fa-cog",route:"/settings"}],$e=()=>{const e={isCollapsed:r.getFromLocalStorage("sidebarCollapsed",!1),currentSection:r.getFromLocalStorage("currentSection","balances"),sections:Ae};return{state:e,setState:a=>{Object.assign(e,a)},saveState:()=>{r.saveToLocalStorage("sidebarCollapsed",e.isCollapsed),r.saveToLocalStorage("currentSection",e.currentSection)}}},Ne=e=>{const t=document.getElementById("sidebarNav");if(!t)return;const n=e.map(a=>`
        <a href="#" class="nav-item" data-section="${a.id}" data-route="${a.route}">
            <i class="${a.icon} nav-icon"></i>
            <span class="nav-text">${a.title}</span>
        </a>
    `).join("");t.innerHTML=n},B=e=>{const t=document.getElementById("sidebar"),n=document.getElementById("mainContent");t&&t.classList.toggle("collapsed",e),n&&n.classList.toggle("sidebar-collapsed",e);const a=document.getElementById("sidebarLogo"),s=document.getElementById("sidebarTitle");a&&(a.style.display=e?"none":"block"),s&&(s.style.display=e?"none":"block")},w=e=>{document.querySelectorAll(".nav-item").forEach(a=>a.classList.remove("active"));const n=document.querySelector(`[data-section="${e}"]`);n&&n.classList.add("active")},E=(e,t)=>t.find(n=>n.id===e),S=()=>{if(r.isMobile()){const e=document.getElementById("sidebar");e&&e.classList.remove("mobile-open")}},Fe=()=>{if(r.isMobile()){const e=document.getElementById("sidebar");e&&e.classList.add("mobile-open")}};function ke(e){const{state:t,setState:n,saveState:a}=$e();e&&(e.className="sidebar",e.innerHTML=`
            <div class="sidebar-header">
                <div class="sidebar-brand">
                    <img src="./assets/logo_tuya.svg" alt="TUYA Fast-Data" class="sidebar-logo" id="sidebarLogo">
                    <span class="sidebar-title" id="sidebarTitle"></span>
                </div>
                <button class="sidebar-toggle" id="sidebarToggle">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
            <nav class="sidebar-nav" id="sidebarNav"></nav>
        `);const s=()=>{const l=!t.isCollapsed;n({isCollapsed:l}),B(l),a()},o=l=>{n({currentSection:l}),w(l),a();const d=new CustomEvent("sectionChanged",{detail:{sectionId:l,section:E(l,t.sections)}});document.dispatchEvent(d)},i=l=>{if(t.sections.find(d=>d.id===l)){n({currentSection:l}),w(l),a();const d=new CustomEvent("sectionChanged",{detail:{sectionId:l,section:E(l,t.sections)}});document.dispatchEvent(d)}},c=()=>{const l=document.getElementById("sidebarToggle");l&&l.addEventListener("click",s),document.querySelectorAll(".nav-item").forEach(u=>{u.addEventListener("click",f=>{f.preventDefault();const g=u.dataset.section;o(g)})}),document.addEventListener("keydown",u=>{u.ctrlKey&&u.key==="b"&&(u.preventDefault(),s())}),document.addEventListener("click",u=>{if(r.isMobile()&&t.isCollapsed===!1){const f=document.getElementById("sidebar"),g=f&&f.contains(u.target),m=u.target.closest("#sidebarToggle");!g&&!m&&S()}}),window.addEventListener("resize",()=>{window.innerWidth>768&&S()}),window.addEventListener("popstate",()=>{const u=window.location.hash.replace("#",""),f=u&&t.sections.find(g=>g.id===u)?u:"balances";i(f)})},p=()=>{Ne(t.sections),c();const l=window.location.hash.replace("#",""),d=l&&t.sections.find(u=>u.id===l)?l:t.currentSection;n({currentSection:d}),w(d),B(t.isCollapsed),a()};return setTimeout(p,10),{getState:()=>({...t}),toggleSidebar:s,navigateToSection:o,setActiveSection:i,getCurrentSection:()=>E(t.currentSection,t.sections),getAllSections:()=>[...t.sections],isSidebarCollapsed:()=>t.isCollapsed,closeMobileSidebar:S,openMobileSidebar:Fe,reinit:p}}const ze={balances:"Saldos",sales:"Ventas",inventory:"Inventario",customers:"Clientes",reports:"Reportes",test:"Test",settings:"Configuración"},D=e=>ze[e]||e,Re=e=>{const t=document.getElementById("pageTitle");t&&(t.textContent=e)},U=()=>{const e=document.getElementById("globalSearch");e&&(e.value="")},C=async e=>{if(!e||e.length<2){r.showNotification("Búsqueda global no disponible","info");return}try{r.showNotification(`Búsqueda global: "${e}" - Funcionalidad no implementada`,"info")}catch(t){r.handleError(t,"Búsqueda global")}},De=e=>{try{const t=new CustomEvent("sectionChanged",{detail:{sectionId:e,section:{id:e,title:D(e)}}});document.dispatchEvent(t),U()}catch(t){r.handleError(t,"Navegar a sección")}},Ue=()=>{const e=document.getElementById("globalSearch"),t=document.getElementById("globalSearchBtn");e&&e.addEventListener("keypress",n=>{if(n.key==="Enter"){const a=n.target.value.trim();a&&C(a)}}),t&&t.addEventListener("click",()=>{const n=e?e.value.trim():"";n&&C(n)})};function Ve(e){if(!e)return;e.innerHTML=`
        <div class="navbar-brand">
            <div class="navbar-item">
                <h1 class="title is-4" id="pageTitle">Dashboard</h1>
            </div>
        </div>
        <div class="navbar-end">
            <div class="navbar-item">
                <div class="field has-addons">
                    <div class="control has-icons-left">
                        <input class="input" type="text" placeholder="Búsqueda global..." id="globalSearch">
                        <span class="icon is-left">
                            <i class="fas fa-search"></i>
                        </span>
                    </div>
                    <div class="control">
                        <button class="button is-primary" id="globalSearchBtn">
                            <span class="icon">
                                <i class="fas fa-search"></i>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;const t=()=>{Ue()};return t(),{performGlobalSearch:C,navigateToSection:De,updatePageTitle:Re,getSectionTitle:D,clearGlobalSearch:U,showLoading:()=>{},hideLoading:()=>{},reinit:t}}const Oe="modulepreload",Me=function(e,t){return new URL(e,t).href},L={},Pe=function(t,n,a){let s=Promise.resolve();if(n&&n.length>0){let l=function(d){return Promise.all(d.map(u=>Promise.resolve(u).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};const i=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),p=c?.nonce||c?.getAttribute("nonce");s=l(n.map(d=>{if(d=Me(d,a),d in L)return;L[d]=!0;const u=d.endsWith(".css"),f=u?'[rel="stylesheet"]':"";if(!!a)for(let v=i.length-1;v>=0;v--){const h=i[v];if(h.href===d&&(!u||h.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${f}`))return;const m=document.createElement("link");if(m.rel=u?"stylesheet":Oe,u||(m.as="script"),m.crossOrigin="",m.href=d,p&&m.setAttribute("nonce",p),document.head.appendChild(m),u)return new Promise((v,h)=>{m.addEventListener("load",v),m.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${d}`)))})}))}function o(i){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=i,window.dispatchEvent(c),!c.defaultPrevented)throw i}return s.then(i=>{for(const c of i||[])c.status==="rejected"&&o(c.reason);return t().catch(o)})};let b=[];const _e=async()=>{try{const t=await(await fetch("./json/balances-data.json")).json();return b=t.balances,t}catch(e){return console.error("Error cargando datos de balances:",e),b=[{id:1,concepto:"Venta de productos",categoria:"Ventas",monto:15e3,fecha:"2024-01-15",tipo:"ingreso",descripcion:"Venta de productos electrónicos"}],{balances:b}}},y=(e,t)=>{const n=e.toLowerCase(),a=t.toLowerCase();if(n===a)return 1;if(n.includes(a)||a.includes(n))return .8;const s=n.split(" "),o=a.split(" "),i=s.filter(l=>o.includes(l));if(i.length>0)return .6+i.length*.1;let c=0;const p=Math.min(n.length,a.length);for(let l=0;l<p;l++)n[l]===a[l]&&c++;return c/Math.max(n.length,a.length)},je=(e,t={})=>{if(!e.trim()&&Object.keys(t).length===0)return b;const n=b.filter(a=>{let s=!1;const o=[a.concepto,a.categoria,a.descripcion,a.cliente,a.proveedor,a.plataforma].filter(Boolean);if(e.trim()){const i=e.toLowerCase();s=o.some(c=>y(c,e)>.3||c.toLowerCase().includes(i))}else s=!0;return t.categoria&&a.categoria!==t.categoria&&(s=!1),t.tipo&&a.tipo!==t.tipo&&(s=!1),t.metodo_pago&&a.metodo_pago!==t.metodo_pago&&(s=!1),s});return e.trim()&&n.sort((a,s)=>{const o=Math.max(y(a.concepto,e),y(a.categoria,e),y(a.descripcion,e));return Math.max(y(s.concepto,e),y(s.categoria,e),y(s.descripcion,e))-o}),n},qe=(e,t)=>{if(t.length>0)return[];const n=[],a=[...new Set(b.map(i=>i.categoria))];n.push(...a.slice(0,3));const o=b.map(i=>i.concepto).join(" ").toLowerCase().split(" ").filter(i=>i.length>3).filter((i,c,p)=>p.indexOf(i)===c).slice(0,5);return n.push(...o),[...new Set(n)].slice(0,6)},V=e=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP"}).format(e),O=e=>new Date(e).toLocaleDateString("es-CO",{year:"numeric",month:"long",day:"numeric"}),He=(e,t)=>{if(e.length===0){const n=qe(t,e);return`
            <div class="search-state no-results">
                <i class="fas fa-search fa-2x mb-3"></i>
                <h3>No se encontraron resultados para "${t}"</h3>
                <p>Intenta con otros términos de búsqueda</p>
                
                ${n.length>0?`
                    <div class="recommendations">
                        <h4>¿Quizás quisiste buscar?</h4>
                        <div class="recommendation-tags">
                            ${n.map(a=>`
                                <span class="recommendation-tag" onclick="handleRecommendationClick('${a}')">
                                    ${a}
                                </span>
                            `).join("")}
                        </div>
                    </div>
                `:""}
            </div>
        `}return`
        <div class="search-results">
            <h3 class="mb-3">${e.length} resultado${e.length!==1?"s":""} encontrado${e.length!==1?"s":""}</h3>
            ${e.map(n=>`
                <div class="result-item" onclick="handleResultClick(${n.id})">
                    <div class="result-header">
                        <h4 class="result-concepto">${n.concepto}</h4>
                        <span class="result-monto ${n.tipo}">
                            ${n.tipo==="ingreso"?"+":"-"} ${V(n.monto)}
                        </span>
                    </div>
                    <div class="result-details">
                        <div class="result-detail">
                            <i class="fas fa-tag"></i>
                            <span>${n.categoria}</span>
                        </div>
                        <div class="result-detail">
                            <i class="fas fa-calendar"></i>
                            <span>${O(n.fecha)}</span>
                        </div>
                        ${n.descripcion?`
                            <div class="result-detail">
                                <i class="fas fa-info-circle"></i>
                                <span>${n.descripcion}</span>
                            </div>
                        `:""}
                        ${n.cliente?`
                            <div class="result-detail">
                                <i class="fas fa-user"></i>
                                <span>${n.cliente}</span>
                            </div>
                        `:""}
                        ${n.proveedor?`
                            <div class="result-detail">
                                <i class="fas fa-building"></i>
                                <span>${n.proveedor}</span>
                            </div>
                        `:""}
                        ${n.metodo_pago?`
                            <div class="result-detail">
                                <i class="fas fa-credit-card"></i>
                                <span>${n.metodo_pago}</span>
                            </div>
                        `:""}
                    </div>
                </div>
            `).join("")}
        </div>
    `},M=async(e,t={})=>{const n=document.getElementById("searchResults");if(!e.trim()&&Object.keys(t).length===0){n.innerHTML=`
            <div class="search-state empty">
                <i class="fas fa-search fa-2x mb-3"></i>
                <h3>Busca en tus balances</h3>
                <p>Escribe para buscar por concepto, categoría, descripción, etc.</p>
            </div>
        `;return}n.innerHTML=`
        <div class="search-state loading">
            <div class="loading-spinner mb-3"></div>
            <p>Buscando...</p>
        </div>
    `,await new Promise(s=>setTimeout(s,300));const a=je(e,t);n.innerHTML=He(a,e)};window.handleRecommendationClick=e=>{const t=document.getElementById("searchInput");t.value=e,M(e)};window.handleResultClick=e=>{const t=b.find(n=>n.id===e);t&&alert(`Detalles del balance:

Concepto: ${t.concepto}
Monto: ${V(t.monto)}
Categoría: ${t.categoria}
Fecha: ${O(t.fecha)}`)};const We=()=>`
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
    `,Je=()=>{const e=document.getElementById("userDropdown"),t=document.getElementById("userDropdownMsg");if(!e)return;let n=localStorage.getItem("lider_activo")||sessionStorage.getItem("lider_activo");n&&Array.from(e.options).some(a=>a.value===n)?(e.value=n,localStorage.setItem("lider_activo",n),sessionStorage.setItem("lider_activo",n)):(e.value="",n="",localStorage.removeItem("lider_activo"),sessionStorage.removeItem("lider_activo")),e.addEventListener("change",a=>{const s=a.target.value;s?(localStorage.setItem("lider_activo",s),sessionStorage.setItem("lider_activo",s),t&&(t.textContent=`Líder activo: ${s}`,t.style.color="#d32f2f")):(localStorage.removeItem("lider_activo"),sessionStorage.removeItem("lider_activo"),t&&(t.textContent="Selecciona un usuario",t.style.color="#111")),t&&(t.style.opacity=1,setTimeout(()=>{t.style.opacity=.5},2e3))}),t&&(e.value?(t.textContent=`Líder activo: ${e.value}`,t.style.color="#d32f2f"):(t.textContent="Selecciona un usuario",t.style.color="#111"),t.style.opacity=1)},Ke=async()=>{try{Je();const e=await _e(),t=document.getElementById("categoriaFilter");t&&e.categorias&&e.categorias.forEach(v=>{const h=document.createElement("option");h.value=v,h.textContent=v,t.appendChild(h)});const n=document.getElementById("searchInput"),a=document.getElementById("categoriaFilter"),s=document.getElementById("tipoFilter"),o=document.getElementById("metodoPagoFilter");let i;const c=()=>{const v=n.value,h={categoria:a.value,tipo:s.value,metodo_pago:o.value};M(v,h)};n.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(c,300)}),[a,s,o].forEach(v=>{v.addEventListener("change",c)}),n.addEventListener("keypress",v=>{v.key==="Enter"&&c()});const p=document.getElementById("uploadBtn"),l=document.getElementById("showUploadBtn"),d=document.getElementById("fileUploadContainer"),u=document.getElementById("searchContainer"),f=async()=>{if(d.style.display="block",u.style.display="none",!window.fileUpload){const{FileUpload:v}=await Pe(async()=>{const{FileUpload:h}=await import("./FileUpload-D7IuFJnP.js");return{FileUpload:h}},[],import.meta.url);window.fileUpload=new v("fileUploadContainer")}},g=()=>{d.style.display="none",u.style.display="block",window.fileUpload&&window.fileUpload.reset()};p&&p.addEventListener("click",f),l&&l.addEventListener("click",f);const m=document.createElement("button");m.className="button is-small",m.innerHTML=`
            <span class="icon">
                <i class="fas fa-arrow-left"></i>
            </span>
            <span>Volver a búsqueda</span>
        `,m.addEventListener("click",g),setTimeout(()=>{const v=d.querySelector(".upload-content");v&&v.appendChild(m)},100),console.log("Vista de Balances inicializada con búsqueda, upload y menú de usuario")}catch(e){console.error("Error inicializando vista de Balances:",e)}},Ye={getContent:We,initialize:Ke},Ge=()=>`
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Ventas</h2>
            </div>
            <div class="card-content">
                <div class="indicator-area" id="indicatorArea">
                    <div class="has-text-centered">
                        <i class="fas fa-chart-line fa-3x has-text-grey-light mb-4"></i>
                        <h3 class="title is-4 has-text-grey">Indicador de Ventas</h3>
                        <p class="subtitle is-6 has-text-grey-light">Aquí se mostrará el indicador visual</p>
                    </div>
                </div>
            </div>
        </div>
    `,Qe=()=>{console.log("Vista de Ventas inicializada")},Xe={getContent:Ge,initialize:Qe},Ze=()=>`
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Inventario</h2>
            </div>
            <div class="card-content">
                <div class="indicator-area" id="indicatorArea">
                    <div class="has-text-centered">
                        <i class="fas fa-boxes fa-3x has-text-grey-light mb-4"></i>
                        <h3 class="title is-4 has-text-grey">Indicador de Inventario</h3>
                        <p class="subtitle is-6 has-text-grey-light">Aquí se mostrará el indicador visual</p>
                    </div>
                </div>
            </div>
        </div>
    `,et=()=>{console.log("Vista de Inventario inicializada")},tt={getContent:Ze,initialize:et},nt=()=>`
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Clientes</h2>
            </div>
            <div class="card-content">
                <div class="indicator-area" id="indicatorArea">
                    <div class="has-text-centered">
                        <i class="fas fa-users fa-3x has-text-grey-light mb-4"></i>
                        <h3 class="title is-4 has-text-grey">Indicador de Clientes</h3>
                        <p class="subtitle is-6 has-text-grey-light">Aquí se mostrará el indicador visual</p>
                    </div>
                </div>
            </div>
        </div>
    `,at=()=>{console.log("Vista de Clientes inicializada")},st={getContent:nt,initialize:at},it=()=>`
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Reportes</h2>
            </div>
            <div class="card-content">
                <div class="indicator-area" id="indicatorArea">
                    <div class="has-text-centered">
                        <i class="fas fa-file-alt fa-3x has-text-grey-light mb-4"></i>
                        <h3 class="title is-4 has-text-grey">Indicador de Reportes</h3>
                        <p class="subtitle is-6 has-text-grey-light">Aquí se mostrará el indicador visual</p>
                    </div>
                </div>
            </div>
        </div>
    `,ot=()=>{console.log("Vista de Reportes inicializada")},rt={getContent:it,initialize:ot},ct=e=>{const t=e.message||e.toString();return e.name==="TypeError"&&t.includes("Failed to fetch")?{message:"No se pudo conectar con el servidor.",details:"Verifica que el servidor esté ejecutándose en http://localhost:8000",type:"connection",userFriendly:!0}:t.includes("HTTP 404")?{message:"El servidor no encontró la página solicitada.",details:"Verifica que la URL del servidor sea correcta",type:"not_found",userFriendly:!0}:t.includes("HTTP 500")?{message:"Error interno del servidor.",details:"El servidor tuvo un problema procesando tu archivo",type:"server_error",userFriendly:!0}:t.includes("HTTP 413")?{message:"El archivo es demasiado grande.",details:"Intenta con un archivo más pequeño (máximo 10MB)",type:"file_too_large",userFriendly:!0}:t.includes("HTTP 415")?{message:"Tipo de archivo no soportado.",details:"Solo se permiten archivos Excel (.xlsx, .xls) y CSV",type:"unsupported_type",userFriendly:!0}:t.includes("NetworkError")?{message:"Error de conexión de red.",details:"Verifica tu conexión a internet",type:"network",userFriendly:!0}:t.includes("timeout")?{message:"La operación tardó demasiado tiempo.",details:"El servidor está ocupado, intenta nuevamente en unos minutos",type:"timeout",userFriendly:!0}:t.includes("CORS")?{message:"El servidor no permite conexiones desde esta página.",details:"Contacta al administrador del sistema",type:"cors",userFriendly:!0}:t.includes("innerHTML")||t.includes("null")?{message:"Error interno de la aplicación.",details:"Recarga la página e intenta nuevamente",type:"dom_error",userFriendly:!0}:{message:"Ocurrió un error inesperado al procesar el archivo.",details:"Error técnico: "+t,type:"unknown",userFriendly:!1}},lt=()=>`
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
    `,dt=()=>{const e=document.getElementById("sendTestBtn"),t=document.getElementById("excelFileInput"),n=document.getElementById("fileName");e&&e.addEventListener("click",I),t&&t.addEventListener("change",a=>{const s=a.target.files[0];s?["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-excel","text/csv","application/csv"].includes(s.type)||s.name.endsWith(".xlsx")||s.name.endsWith(".xls")||s.name.endsWith(".csv")?(n.textContent=s.name,e.disabled=!1,r.showNotification(`Archivo seleccionado: ${s.name}`,"success")):(n.textContent="Ningún archivo seleccionado",e.disabled=!0,r.showNotification("Por favor, selecciona un archivo Excel válido (.xlsx, .xls, .csv)","warning"),t.value=""):(n.textContent="Ningún archivo seleccionado",e.disabled=!0)})},I=async()=>{const e=document.getElementById("excelFileInput"),t=document.getElementById("sendTestBtn"),n=document.getElementById("testResponseArea"),a=document.getElementById("testErrorArea"),s=document.getElementById("testResponseContent"),o=document.getElementById("testErrorContent");if(!e||!t){console.error("Elementos del DOM no encontrados"),r.showNotification("Error: No se pudieron encontrar los elementos necesarios","danger");return}if(!n||!a||!s||!o){console.error("Elementos de respuesta no encontrados"),r.showNotification("Error: No se pudieron encontrar los elementos de respuesta","danger");return}const i=e.files[0];if(!i){r.showNotification("Por favor, selecciona un archivo Excel","warning");return}try{t.classList.add("is-loading"),t.disabled=!0,n&&(n.style.display="none"),a&&(a.style.display="none");const c=new FormData;c.append("file",i),c.append("view_name","balance");const p=await fetch("http://localhost:8000/api/v1/df/upload_file/mateo",{method:"POST",body:c});console.log("FormData creado:");for(let[f,g]of c.entries())console.log(`${f}:`,g);const l="http://localhost:8000/api/v1/balance/upload",d={method:"POST",body:c};if(console.log("Enviando archivo a:",l),console.log("Archivo:",i.name,"Tamaño:",i.size,"Tipo:",i.type),console.log("Configuración de petición:",d),console.log("Respuesta del servidor:",p.status,p.statusText),!p.ok){let f={};try{f=await p.json()}catch{f={error:await p.text()}}throw new Error(`HTTP ${p.status}: ${f.error||p.statusText}`)}const u=await p.json();if(s){s.innerHTML=`
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
                                <span class="file-info-value">${i.name}</span>
                            </div>
                            <div class="file-info-item">
                                <span class="file-info-label">Tamaño:</span>
                                <span class="file-info-value">${(i.size/1024).toFixed(2)} KB</span>
                            </div>
                            <div class="file-info-item">
                                <span class="file-info-label">Tipo:</span>
                                <span class="file-info-value">${i.type||"No especificado"}</span>
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
            `,n&&(n.style.display="block");const f=document.getElementById("refreshPageBtn"),g=document.getElementById("uploadAnotherBtn");f&&f.addEventListener("click",()=>{window.location.reload()}),g&&g.addEventListener("click",()=>{const m=document.getElementById("excelFileInput"),v=document.getElementById("fileName"),h=document.getElementById("sendTestBtn");m&&(m.value=""),v&&(v.textContent="Ningún archivo seleccionado"),h&&(h.disabled=!0),n&&(n.style.display="none"),a&&(a.style.display="none"),r.showNotification("Listo para subir otro archivo","info")})}r.showNotification("Archivo Excel enviado exitosamente al backend","success")}catch(c){console.error("Error enviando archivo al backend:",c);const p=ct(c);try{o.innerHTML=`
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
                                <span class="file-info-value has-text-danger">${p.message}</span>
                            </div>
                            ${p.details?`
                                <div class="file-info-item">
                                    <span class="file-info-label">Solución:</span>
                                    <span class="file-info-value has-text-warning">${p.details}</span>
                                </div>
                            `:""}
                            <div class="file-info-item">
                                <span class="file-info-label">Archivo:</span>
                                <span class="file-info-value">${i?i.name:"No seleccionado"}</span>
                            </div>
                            <div class="file-info-item">
                                <span class="file-info-label">Tamaño:</span>
                                <span class="file-info-value">${i?(i.size/1024).toFixed(2)+" KB":"N/A"}</span>
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
            `,a.style.display="block";const l=document.getElementById("retryUploadBtn"),d=document.getElementById("clearErrorBtn");l&&l.addEventListener("click",()=>{a.style.display="none",I()}),d&&d.addEventListener("click",()=>{const u=document.getElementById("excelFileInput"),f=document.getElementById("fileName"),g=document.getElementById("sendTestBtn");u&&(u.value=""),f&&(f.textContent="Ningún archivo seleccionado"),g&&(g.disabled=!0),a.style.display="none",n&&(n.style.display="none"),r.showNotification("Formulario limpiado","info")})}catch(l){console.error("Error mostrando el error:",l),r.showNotification(p.message,"danger")}r.showNotification(p.message,"danger")}finally{t&&(t.classList.remove("is-loading"),t.disabled=!1)}},ut=()=>{dt(),console.log("Vista de Test inicializada")},pt={getContent:lt,initialize:ut,sendExcelToBackend:I},ft=()=>`
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Configuración</h2>
            </div>
            <div class="card-content">
                <div class="indicator-area" id="indicatorArea">
                    <div class="has-text-centered">
                        <i class="fas fa-cog fa-3x has-text-grey-light mb-4"></i>
                        <h3 class="title is-4 has-text-grey">Configuración</h3>
                        <p class="subtitle is-6 has-text-grey-light">Aquí se mostrarán las opciones de configuración</p>
                    </div>
                </div>
            </div>
        </div>
    `,vt=()=>{console.log("Vista de Configuración inicializada")},mt={getContent:ft,initialize:vt},gt=e=>`
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">${e}</h2>
            </div>
            <div class="card-content">
                <div class="indicator-area" id="indicatorArea">
                    <div class="has-text-centered">
                        <i class="fas fa-question-circle fa-3x has-text-grey-light mb-4"></i>
                        <h3 class="title is-4 has-text-grey">Sección ${e}</h3>
                        <p class="subtitle is-6 has-text-grey-light">Contenido no disponible</p>
                    </div>
                </div>
            </div>
        </div>
    `,ht=e=>{console.log(`Vista por defecto inicializada para sección: ${e}`)},P={getContent:gt,initialize:ht},bt={balances:"Saldos",sales:"Ventas",inventory:"Inventario",customers:"Clientes",reports:"Reportes",test:"Test",settings:"Configuración"},yt=()=>{const e={currentSection:null};return{state:e,setState:n=>{Object.assign(e,n)}}},_={balances:Ye,sales:Xe,inventory:tt,customers:st,reports:rt,test:pt,settings:mt},wt=e=>bt[e]||e,Et=e=>{const t=document.getElementById("indicatorArea");t&&(t.innerHTML=e)},St=async e=>{const t=document.getElementById("mainContent");if(!t)return;let n="";n=(_[e]||P).getContent(e),t.innerHTML=n},A=e=>{(_[e]||P).initialize(e)},Ct=()=>{const{state:e,setState:t}=yt();return{getState:()=>({...e}),loadSection:async s=>{try{t({currentSection:s}),await St(s),A(s)}catch(o){r.handleError(o,`Cargar sección ${s}`)}},getSectionTitle:wt,updateIndicatorArea:Et,getCurrentSection:()=>e.currentSection,isSectionLoaded:s=>e.currentSection===s,initializeSectionFeatures:A,reinit:()=>{}}};function Tt(){const e=document.getElementById("app");e.innerHTML=`
        <aside id="sidebar"></aside>
        <main id="mainContent" class="main-content">
            <nav id="navbar"></nav>
            <div id="pageContent" class="page-content"></div>
        </main>
    `,window.sidebar=ke(document.getElementById("sidebar")),window.navbar=Ve(document.getElementById("navbar"))}document.addEventListener("DOMContentLoaded",()=>{Tt(),window.sectionContent=Ct(),window.app=Le(),window.Utils=r,window.TUYAApp={app:window.app,sidebar:window.sidebar,navbar:window.navbar,sectionContent:window.sectionContent,Utils:window.Utils},window.showAppInfo=function(){const e=app.getAppInfo();console.log("Información de la aplicación:",e),r.showNotification(`App: ${e.name} v${e.version}`,"info")},window.restartApp=function(){confirm("¿Estás seguro de que quieres reiniciar la aplicación?")&&app.restart()},window.exportAppData=function(){const e=app.exportAppData();if(e){const t=new Blob([e],{type:"application/json"}),n=URL.createObjectURL(t),a=document.createElement("a");a.href=n,a.download=`tuya-app-data-${new Date().toISOString().split("T")[0]}.json`,a.click(),URL.revokeObjectURL(n),r.showNotification("Datos exportados exitosamente","success")}},window.importAppData=function(){const e=document.createElement("input");e.type="file",e.accept=".json",e.onchange=function(t){const n=t.target.files[0];if(n){const a=new FileReader;a.onload=function(s){app.importAppData(s.target.result)&&setTimeout(()=>{window.location.reload()},1e3)},a.readAsText(n)}},e.click()},console.log("TUYA Fast-Data inicializada con Vite - Estilo Funcional"),setTimeout(()=>{document.getElementById("sidebarToggle")?console.log("✅ Botón sidebarToggle encontrado y funcional"):console.error("❌ Botón sidebarToggle no encontrado")},100)});export{r as U,Pe as _};
