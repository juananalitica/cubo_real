import{_ as g,U as m}from"./index-B7A4ClWT.js";let p=null,d=null;const h=async()=>{try{p||(p=await g(()=>import("https://cdn.jsdelivr.net/npm/papaparse@5.4.1/dist/papaparse.min.js"),[],import.meta.url)),d||(d=await g(()=>import("https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"),[],import.meta.url))}catch(n){throw console.error("Error cargando librerías:",n),new Error("No se pudieron cargar las librerías de procesamiento")}},f=n=>{const s=["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-excel","text/csv","application/csv"],e=[".xlsx",".xls",".csv"],t="."+n.name.split(".").pop().toLowerCase(),o=s.includes(n.type),r=e.includes(t);return o||r},y=n=>{if(!Array.isArray(n)||n.length===0)return n;n[0];const s=[];for(const e of n){const t={};for(const[o,r]of Object.entries(e)){if(r===null){t[o]=null;continue}if(!isNaN(r)&&r!==""){const i=parseFloat(r);if(!isNaN(i)){t[o]=i;continue}}const a=new Date(r);if(!isNaN(a.getTime())&&r.toString().match(/^\d{4}-\d{2}-\d{2}/)){t[o]=a.toISOString();continue}t[o]=String(r)}s.push(t)}return s},w=async n=>new Promise((s,e)=>{p.parse(n,{header:!0,skipEmptyLines:!0,complete:t=>{t.errors.length>0&&console.warn("Errores en CSV:",t.errors),s(t.data)},error:t=>{e(new Error(`Error procesando CSV: ${t.message}`))}})}),E=async n=>{try{const s=await n.arrayBuffer(),e=d.read(s,{type:"array"}),t=e.SheetNames[0],o=e.Sheets[t],r=d.utils.sheet_to_json(o,{header:1});if(r.length>0){const a=r[0];return r.slice(1).map(c=>{const l={};return a.forEach((u,v)=>{l[u]=c[v]||null}),l})}return[]}catch(s){throw new Error(`Error procesando Excel: ${s.message}`)}},b=n=>{if(!Array.isArray(n)||n.length===0)return{rowCount:0,columnCount:0,columns:[],dataTypes:{},nullCounts:{},uniqueCounts:{}};const s=Object.keys(n[0]),e={},t={},o={};for(const r of s){const a=n.map(i=>i[r]).filter(i=>i!==null);if(t[r]=n.length-a.length,o[r]=new Set(a).size,a.length>0){const i=a[0];typeof i=="number"?e[r]="number":i instanceof Date||typeof i=="string"&&i.match(/^\d{4}-\d{2}-\d{2}/)?e[r]="date":e[r]="string"}else e[r]="unknown"}return{rowCount:n.length,columnCount:s.length,columns:s,dataTypes:e,nullCounts:t,uniqueCounts:o}},I=async n=>{try{if(!f(n))throw new Error("Tipo de archivo no válido. Solo se permiten archivos .xlsx, .xls y .csv");await h();let s;n.type==="text/csv"||n.name.toLowerCase().endsWith(".csv")?s=await w(n):s=await E(n);const e=e(s),t=y(e),o=b(t),r={filename:n.name,size_bytes:n.size,size_kb:Math.round(n.size/1024*100)/100,rows:o.rowCount,columns:o.columnCount,column_names:o.columns,upload_timestamp:new Date().toISOString(),processed_at:new Date().toISOString()},a=t.slice(0,5);return{success:!0,data:t,fileInfo:r,analysis:o,preview:a}}catch(s){return console.error("Error procesando archivo:",s),{success:!1,error:s.message}}},_=async(n,s="/api/v1/balance/upload")=>{try{const e=new FormData,t=new Blob([JSON.stringify(n.data)],{type:"application/json"});e.append("file",t,"processed_data.json"),e.append("timestamp",n.fileInfo.upload_timestamp),e.append("source","frontend_processed"),e.append("analysis",JSON.stringify(n.analysis));const o=await fetch(s,{method:"POST",body:e});if(!o.ok)throw new Error(`Error del servidor: ${o.status}`);return{success:!0,backendResult:await o.json(),frontendData:n}}catch(e){return console.error("Error enviando al backend:",e),{success:!1,error:e.message,frontendData:n}}};class B{constructor(s){this.container=document.getElementById(s),this.isProcessing=!1,this.init()}init(){this.render(),this.bindEvents()}render(){this.container.innerHTML=`
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
        `}bindEvents(){const s=document.getElementById("uploadArea"),e=document.getElementById("fileInput"),t=document.getElementById("selectFileBtn");s.addEventListener("dragover",o=>{o.preventDefault(),s.classList.add("dragover")}),s.addEventListener("dragleave",()=>{s.classList.remove("dragover")}),s.addEventListener("drop",o=>{o.preventDefault(),s.classList.remove("dragover");const r=o.dataTransfer.files;r.length>0&&this.handleFile(r[0])}),t.addEventListener("click",()=>{e.click()}),e.addEventListener("change",o=>{o.target.files.length>0&&this.handleFile(o.target.files[0])})}async handleFile(s){try{this.showProcessing(),this.updateProcessingMessage("Validando archivo..."),this.updateProcessingMessage("Procesando datos en el navegador...");const e=await I(s);if(!e.success)throw new Error(e.error);this.updateProcessingMessage("Enviando datos al servidor...");const t=await _(e);t.success?this.showResults(e,t):(this.showResults(e,null),m.showNotification("Procesamiento completado (solo frontend)","warning"))}catch(e){console.error("Error procesando archivo:",e),this.showError(e.message)}finally{this.hideProcessing()}}showProcessing(){this.isProcessing=!0,document.getElementById("processingStatus").style.display="block",document.getElementById("resultsContainer").style.display="none",document.getElementById("errorContainer").style.display="none"}hideProcessing(){this.isProcessing=!1,document.getElementById("processingStatus").style.display="none"}updateProcessingMessage(s){document.getElementById("processingMessage").textContent=s}showResults(s,e){const t=document.getElementById("resultsContainer"),o=document.getElementById("fileInfo"),r=document.getElementById("analysisInfo"),a=document.getElementById("recommendationsInfo");if(o.innerHTML=`
            <div class="columns">
                <div class="column">
                    <strong>Archivo:</strong> ${s.fileInfo.filename}<br>
                    <strong>Tamaño:</strong> ${s.fileInfo.size_kb} KB<br>
                    <strong>Filas:</strong> ${s.fileInfo.rows}<br>
                    <strong>Columnas:</strong> ${s.fileInfo.columns}
                </div>
                <div class="column">
                    <strong>Procesamiento:</strong> ${e?"Híbrido (Frontend + Backend)":"Solo Frontend"}<br>
                    <strong>Memoria usada:</strong> ${e?.backendResult?.file_info?.memory_usage_mb||"N/A"} MB<br>
                    <strong>Columnas:</strong> ${s.fileInfo.column_names.join(", ")}
                </div>
            </div>
        `,e&&e.backendResult.analysis){const i=e.backendResult.analysis;r.innerHTML=`
                <h5 class="title is-6 mt-4">Análisis de datos</h5>
                <div class="columns">
                    <div class="column">
                        <strong>Filas duplicadas:</strong> ${i.data_quality.duplicate_rows}<br>
                        <strong>Columnas vacías:</strong> ${i.data_quality.empty_columns.length}<br>
                        <strong>Uso de memoria:</strong> ${i.basic_stats.memory_usage_mb} MB
                    </div>
                    <div class="column">
                        <strong>Calidad de datos:</strong><br>
                        ${Object.entries(i.column_analysis).map(([c,l])=>`${c}: ${l.null_percentage}% nulos`).join("<br>")}
                    </div>
                </div>
            `}if(e&&e.backendResult.recommendations){const i=e.backendResult.recommendations;a.innerHTML=`
                <h5 class="title is-6 mt-4">Recomendaciones</h5>
                ${Object.entries(i).map(([c,l])=>l.length>0?`
                        <div class="mb-2">
                            <strong>${c}:</strong><br>
                            ${l.map(u=>`• ${u}`).join("<br>")}
                        </div>
                    `:"").join("")}
            `}t.style.display="block",m.showNotification("Archivo procesado exitosamente","success")}showError(s){const e=document.getElementById("errorContainer"),t=document.getElementById("errorMessage");t.textContent=s,e.style.display="block",m.showNotification("Error procesando archivo","error")}reset(){this.hideProcessing(),document.getElementById("resultsContainer").style.display="none",document.getElementById("errorContainer").style.display="none",document.getElementById("fileInput").value=""}getProcessedData(){return this.lastProcessedData}}export{B as FileUpload};
