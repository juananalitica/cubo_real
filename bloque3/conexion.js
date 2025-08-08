const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

const DB_CLIENT = process.env.DB_CLIENT || 'sqlite';
let db;

if (DB_CLIENT === 'mysql') {
  db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'items_db'
  });
} else {
  const dbPath = path.join(__dirname, 'data.sqlite');
  db = new sqlite3.Database(dbPath);
}

async function init() {
  if (DB_CLIENT === 'mysql') {
    await db.query(`CREATE TABLE IF NOT EXISTS items (
      id INTEGER AUTO_INCREMENT PRIMARY KEY,
      nombre TEXT,
      descripcion TEXT
    )`);
    const [rows] = await db.query('SELECT COUNT(*) AS count FROM items');
    if (rows[0].count === 0) {
      const seedPath = path.join(__dirname, '..', 'bloque2', 'datos_simulados.json');
      if (fs.existsSync(seedPath)) {
        const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        for (const item of seed) {
          await db.query('INSERT INTO items (nombre, descripcion) VALUES (?, ?)', [item.nombre, item.descripcion]);
        }
      }
    }
  } else {
    await new Promise((resolve, reject) => {
      db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        descripcion TEXT
      )`, err => err ? reject(err) : resolve());
    });
    const count = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) AS count FROM items', (err, row) => err ? reject(err) : resolve(row.count));
    });
    if (count === 0) {
      const seedPath = path.join(__dirname, '..', 'bloque2', 'datos_simulados.json');
      if (fs.existsSync(seedPath)) {
        const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
        const stmt = db.prepare('INSERT INTO items (nombre, descripcion) VALUES (?, ?)');
        for (const item of seed) {
          stmt.run(item.nombre, item.descripcion);
        }
        stmt.finalize();
      }
    }
  }
}

async function getAll() {
  if (DB_CLIENT === 'mysql') {
    const [rows] = await db.query('SELECT * FROM items');
    return rows;
  }
  return await new Promise((resolve, reject) => {
    db.all('SELECT * FROM items', (err, rows) => err ? reject(err) : resolve(rows));
  });
}

async function create(item) {
  if (DB_CLIENT === 'mysql') {
    const [result] = await db.query('INSERT INTO items (nombre, descripcion) VALUES (?, ?)', [item.nombre, item.descripcion]);
    return { id: result.insertId, ...item };
  }
  return await new Promise((resolve, reject) => {
    db.run('INSERT INTO items (nombre, descripcion) VALUES (?, ?)',
      [item.nombre, item.descripcion],
      function (err) {
        if (err) reject(err); else resolve({ id: this.lastID, ...item });
      });
  });
}

async function update(id, item) {
  if (DB_CLIENT === 'mysql') {
    await db.query('UPDATE items SET nombre = ?, descripcion = ? WHERE id = ?', [item.nombre, item.descripcion, id]);
    return { id: Number(id), ...item };
  }
  return await new Promise((resolve, reject) => {
    db.run('UPDATE items SET nombre = ?, descripcion = ? WHERE id = ?',
      [item.nombre, item.descripcion, id],
      function (err) {
        if (err) reject(err); else resolve({ id: Number(id), ...item });
      });
  });
}

async function remove(id) {
  if (DB_CLIENT === 'mysql') {
    await db.query('DELETE FROM items WHERE id = ?', [id]);
  } else {
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM items WHERE id = ?', [id], err => err ? reject(err) : resolve());
    });
  }
}

module.exports = { init, getAll, create, update, remove };
