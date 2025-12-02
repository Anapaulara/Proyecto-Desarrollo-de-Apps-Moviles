import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("miDB.db");

const TransaccionesService = {
  initialize: async () => {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS transacciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          tipo TEXT,
          categoria TEXT,
          nombre TEXT,
          monto REAL,
          fecha TEXT,
          descripcion TEXT
        );
      `);
    });

    console.log("✔ BD Transacciones lista");
  },

  // ==================================
  // INSERTAR (firma corregida de 7 params)
  // ==================================
  agregar: async (
    user_id,
    tipo,
    categoria,
    nombre,
    monto,
    fecha,
    descripcion
  ) => {
    try {
      await db.runAsync(
        `INSERT INTO transacciones 
         (user_id, tipo, categoria, nombre, monto, fecha, descripcion)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, tipo, categoria, nombre, monto, fecha, descripcion]
      );
      return true;
    } catch (err) {
      console.log("❌ ERROR insert:", err);
      return false;
    }
  },

  // ==================================
  // EDITAR
  // ==================================
  editar: async (id, tipo, categoria, nombre, monto, fecha, descripcion) => {
    try {
      return await db.runAsync(
        `UPDATE transacciones 
         SET tipo=?, categoria=?, nombre=?, monto=?, fecha=?, descripcion=? 
         WHERE id=?`,
        [tipo, categoria, nombre, monto, fecha, descripcion, id]
      );
    } catch (err) {
      console.log("❌ ERROR editar:", err);
    }
  },

  // ==================================
  // ELIMINAR
  // ==================================
  eliminar: async (id) => {
    try {
      return await db.runAsync(`DELETE FROM transacciones WHERE id=?`, [id]);
    } catch (err) {
      console.log("❌ ERROR eliminar:", err);
    }
  },

  // ==================================
  // OBTENER TODAS
  // ==================================
  obtenerTodos: async (user_id) => {
    try {
      return await db.getAllAsync(
        `SELECT * FROM transacciones 
         WHERE user_id = ? 
         ORDER BY id DESC`,
        [user_id]
      );
    } catch (err) {
      console.log("❌ ERROR obtenerTodos:", err);
      return [];
    }
  },

  // ==================================
  // OBTENER POR CATEGORÍA
  // ==================================
  filtrarPorCategoria: async (categoria, user_id) => {
    try {
      return await db.getAllAsync(
        `SELECT * FROM transacciones 
         WHERE categoria = ? AND user_id = ?
         ORDER BY id DESC`,
        [categoria, user_id]
      );
    } catch (err) {
      console.log("❌ ERROR filtrarPorCategoria:", err);
      return [];
    }
  },

  // ==================================
  // OBTENER POR MES (corregido)
  // ==================================
  obtenerPorMes: async (mes, user_id) => {
    try {
      return await db.getAllAsync(
        `SELECT * FROM transacciones 
        WHERE user_id = ?
        AND substr(fecha, 4, 2) = ?`,
        [user_id, mes.padStart(2, "0")]
      );
    } catch (err) {
      console.log("❌ ERROR obtenerPorMes:", err);
      return [];
    }
  },
};

export default TransaccionesService;
