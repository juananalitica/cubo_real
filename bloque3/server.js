const express = require('express');
const path = require('path');
const db = require('./conexion');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/items', async (req, res) => {
  try {
    const items = await db.getAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo items' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const item = await db.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error creando item' });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const updated = await db.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando item' });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    await db.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando item' });
  }
});

db.init()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('Error inicializando la base de datos', err);
    process.exit(1);
  });

module.exports = app;
