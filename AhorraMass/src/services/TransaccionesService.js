import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("miDB.db");

const TransaccionesService = {
  initialize: async () => {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS transacciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tipo TEXT,
          categoria TEXT,
          nombre TEXT,
          monto REAL,
          fecha TEXT,
          descripcion TEXT
        );
      `);
    });
  },

  // ⭐ AGREGAR
  agregar: async (tipo, categoria, nombre, monto, fecha, descripcion) => {
    return await db.runAsync(
      `INSERT INTO transacciones (tipo, categoria, nombre, monto, fecha, descripcion)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tipo, categoria, nombre, monto, fecha, descripcion]
    );
  },

  // ⭐ EDITAR
  editar: async (id, tipo, categoria, nombre, monto, fecha, descripcion) => {
    return await db.runAsync(
      `UPDATE transacciones 
       SET tipo=?, categoria=?, nombre=?, monto=?, fecha=?, descripcion=? 
       WHERE id=?`,
      [tipo, categoria, nombre, monto, fecha, descripcion, id]
    );
  },

  // ⭐ ELIMINAR
  eliminar: async (id) => {
    return await db.runAsync(`DELETE FROM transacciones WHERE id=?`, [id]);
  },

  // ⭐ OBTENER TODOS
  obtenerTodos: async () => {
    return await db.getAllAsync(
      `SELECT * FROM transacciones ORDER BY fecha DESC`
    );
  },

  // ⭐ FILTRAR POR CATEGORÍA
  filtrarPorCategoria: async (categoria) => {
    return await db.getAllAsync(
      `SELECT * FROM transacciones WHERE categoria=? ORDER BY fecha DESC`,
      [categoria]
    );
  }
};

export default TransaccionesService;
