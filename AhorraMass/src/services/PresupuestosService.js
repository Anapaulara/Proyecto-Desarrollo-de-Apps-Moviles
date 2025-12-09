import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("miDB.db");

const PresupuestosService = {
    initialize: async () => {
        await db.withTransactionAsync(async () => {
            await db.runAsync(`
        CREATE TABLE IF NOT EXISTS presupuestos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          categoria TEXT NOT NULL,
          montoLimit REAL NOT NULL,
          fecha TEXT -- Formato YYYY-MM
        );
      `);
        });
    },

    agregar: async (categoria, montoLimit, fecha) => {
        return await db.runAsync(
            `INSERT INTO presupuestos (categoria, montoLimit, fecha) VALUES (?, ?, ?)`,
            [categoria, montoLimit, fecha]
        );
    },

    editar: async (id, categoria, montoLimit, fecha) => {
        return await db.runAsync(
            `UPDATE presupuestos SET categoria=?, montoLimit=?, fecha=? WHERE id=?`,
            [categoria, montoLimit, fecha, id]
        );
    },

    eliminar: async (id) => {
        return await db.runAsync(`DELETE FROM presupuestos WHERE id=?`, [id]);
    },

    obtenerTodos: async () => {
        return await db.getAllAsync(`SELECT * FROM presupuestos ORDER BY fecha DESC`);
    },

    verificarPresupuesto: async (categoria, mes) => {
        const result = await db.getAllAsync(
            `SELECT * FROM presupuestos WHERE categoria=? AND fecha=?`,
            [categoria, mes]
        );
        return result.length > 0 ? result[0] : null;
    }
};

export default PresupuestosService;
