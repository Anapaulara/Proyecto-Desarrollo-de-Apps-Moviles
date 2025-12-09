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

  agregar: async (tipo, categoria, nombre, monto, fecha, descripcion) => {
    return await db.runAsync(
      `INSERT INTO transacciones (tipo, categoria, nombre, monto, fecha, descripcion)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tipo, categoria, nombre, monto, fecha, descripcion]
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

  obtenerTodos: async () => {
    return await db.getAllAsync(
      `SELECT * FROM transacciones ORDER BY fecha DESC`
    );
  },

  filtrarPorCategoria: async (categoria) => {
    return await db.getAllAsync(
      `SELECT * FROM transacciones WHERE categoria=? ORDER BY fecha DESC`,
      [categoria]
    );
  },

  filtrarPorFecha: async (fechaInicio, fechaFin) => {
    return await db.getAllAsync(
      `SELECT * FROM transacciones WHERE fecha BETWEEN ? AND ? ORDER BY fecha DESC`,
      [fechaInicio, fechaFin]
    );
  },

  obtenerPorMesYCategoria: async (mes, categoria) => {
    try {
      const result = await db.getAllAsync(
        `SELECT * FROM transacciones WHERE categoria=? AND strftime('%Y-%m', fecha) = ?`,
        [categoria, mes]
      );
      return result;
    } catch (e) {
      console.log("Error filtrando mes/cat:", e);
      return [];
    }
  },

  obtenerBalance: async () => {
    try {
      const all = await db.getAllAsync(`SELECT * FROM transacciones`);
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
