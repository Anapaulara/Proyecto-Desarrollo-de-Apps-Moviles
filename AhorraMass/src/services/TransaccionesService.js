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

      // Migration: Add usuario_id if not exists
      try {
        await db.runAsync(`ALTER TABLE transacciones ADD COLUMN usuario_id INTEGER;`);
      } catch (e) {
        // Column likely exists
      }
    });
  },

  agregar: async (tipo, categoria, nombre, monto, fecha, descripcion, usuario_id) => {
    return await db.runAsync(
      `INSERT INTO transacciones (tipo, categoria, nombre, monto, fecha, descripcion, usuario_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [tipo, categoria, nombre, monto, fecha, descripcion, usuario_id]
    );
  },

  editar: async (id, tipo, categoria, nombre, monto, fecha, descripcion) => {
    return await db.runAsync(
      `UPDATE transacciones 
       SET tipo=?, categoria=?, nombre=?, monto=?, fecha=?, descripcion=? 
       WHERE id=?`,
      [tipo, categoria, nombre, monto, fecha, descripcion, id]
    );
  },

  eliminar: async (id) => {
    return await db.runAsync(`DELETE FROM transacciones WHERE id=?`, [id]);
  },

  obtenerTodos: async (usuario_id) => {
    // If no user_id passed, return empty to be safe or all? Better safe.
    if (!usuario_id) return [];
    return await db.getAllAsync(
      `SELECT * FROM transacciones WHERE usuario_id = ? ORDER BY fecha DESC`,
      [usuario_id]
    );
  },

  filtrarPorCategoria: async (categoria, usuario_id) => {
    if (!usuario_id) return [];
    return await db.getAllAsync(
      `SELECT * FROM transacciones WHERE LOWER(categoria) = LOWER(?) AND usuario_id=? ORDER BY fecha DESC`,
      [categoria, usuario_id]
    );
  },

  filtrarPorFecha: async (fechaInicio, fechaFin, usuario_id) => {
    if (!usuario_id) return [];
    return await db.getAllAsync(
      `SELECT * FROM transacciones WHERE usuario_id=? AND fecha BETWEEN ? AND ? ORDER BY fecha DESC`,
      [usuario_id, fechaInicio, fechaFin]
    );
  },

  obtenerPorMesYCategoria: async (mes, categoria, usuario_id) => {
    if (!usuario_id) return [];
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM transacciones WHERE categoria=? AND usuario_id=? AND strftime('%Y-%m', fecha) = ?`,
        [categoria, usuario_id, mes]
      );
      return result;
    } catch (e) {
      console.log("Error filtrando mes/cat:", e);
      return [];
    }
  },

  obtenerBalance: async (usuario_id) => {
    if (!usuario_id) return { ingresos: 0, egresos: 0, total: 0 };
    try {
      const all = await db.getAllAsync(`SELECT * FROM transacciones WHERE usuario_id=?`, [usuario_id]);
      let ingresos = 0;
      let egresos = 0;

      all.forEach(t => {
        if (t.tipo === 'ingreso') ingresos += t.monto;
        else if (t.tipo === 'egreso') egresos += t.monto;
      });

      return {
        ingresos,
        egresos,
        total: ingresos - egresos
      };
    } catch (e) {
      console.log("Error obteniendo balance:", e);
      return { ingresos: 0, egresos: 0, total: 0 };
    }
  }
};

export default TransaccionesService;
