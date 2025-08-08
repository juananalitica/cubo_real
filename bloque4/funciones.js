const tbody = document.querySelector('#tablaItems tbody');
const form = document.getElementById('itemForm');
const mensaje = document.getElementById('mensaje');
const submitBtn = form.querySelector('button[type="submit"]');

function mostrarMensaje(texto, tipo = 'exito') {
  mensaje.textContent = texto;
  mensaje.style.color = tipo === 'error' ? 'red' : 'green';
}

async function cargarDatos() {
  try {
    const res = await fetch('/api/items');
    if (!res.ok) throw new Error('Error cargando datos');
    const items = await res.json();
    pintarTabla(items);
  } catch (err) {
    pintarTabla([]);
    mostrarMensaje(err.message, 'error');
  }
}

function pintarTabla(items) {
  tbody.innerHTML = '';
  items.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="nombre"></td>
      <td class="descripcion"></td>
      <td>
        <button type="button" class="editar">Editar</button>
        <button type="button" class="eliminar">Eliminar</button>
      </td>
    `;
    tr.querySelector('.nombre').textContent = item.nombre;
    tr.querySelector('.descripcion').textContent = item.descripcion;

    const btnEditar = tr.querySelector('.editar');
    const btnEliminar = tr.querySelector('.eliminar');

    btnEliminar.addEventListener('click', async () => {
      btnEliminar.disabled = true;
      try {
        const res = await fetch(`/api/items/${item.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error eliminando item');
        mostrarMensaje('Item eliminado');
        await cargarDatos();
      } catch (err) {
        mostrarMensaje(err.message, 'error');
      } finally {
        btnEliminar.disabled = false;
      }
    });

    btnEditar.addEventListener('click', () => activarEdicion(tr, item));

    tbody.appendChild(tr);
  });
}

function activarEdicion(tr, item) {
  const nombreCell = tr.querySelector('.nombre');
  const descripcionCell = tr.querySelector('.descripcion');
  const accionesCell = tr.lastElementChild;

  nombreCell.innerHTML = `<input type="text" value="${item.nombre}">`;
  descripcionCell.innerHTML = `<input type="text" value="${item.descripcion}">`;
  accionesCell.innerHTML = '';

  const btnGuardar = document.createElement('button');
  btnGuardar.textContent = 'Guardar';
  const btnCancelar = document.createElement('button');
  btnCancelar.textContent = 'Cancelar';
  accionesCell.append(btnGuardar, btnCancelar);

  btnGuardar.addEventListener('click', async () => {
    btnGuardar.disabled = true;
    const actualizado = {
      nombre: nombreCell.firstElementChild.value,
      descripcion: descripcionCell.firstElementChild.value
    };
    try {
      const res = await fetch(`/api/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizado)
      });
      if (!res.ok) throw new Error('Error actualizando item');
      mostrarMensaje('Item actualizado');
      await cargarDatos();
    } catch (err) {
      mostrarMensaje(err.message, 'error');
    } finally {
      btnGuardar.disabled = false;
    }
  });

  btnCancelar.addEventListener('click', cargarDatos);
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  submitBtn.disabled = true;
  const nuevo = {
    nombre: form.nombre.value,
    descripcion: form.descripcion.value
  };
  try {
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    if (!res.ok) throw new Error('Error creando item');
    form.reset();
    mostrarMensaje('Item creado');
    await cargarDatos();
  } catch (err) {
    mostrarMensaje(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
  }
});

window.addEventListener('DOMContentLoaded', cargarDatos);
