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
            try {
                await db.runAsync(`ALTER TABLE presupuestos ADD COLUMN usuario_id INTEGER;`);
            } catch (e) { }
        });
    },

    agregar: async (categoria, montoLimit, fecha, usuario_id) => {
        return await db.runAsync(
            `INSERT INTO presupuestos (categoria, montoLimit, fecha, usuario_id) VALUES (?, ?, ?, ?)`,
            [categoria, montoLimit, fecha, usuario_id]
        );
    },

    editar: async (id, categoria, montoLimit, fecha) => {
        // Edit doesn't strictly need user_id in WHERE if ID is unique, but safer
        return await db.runAsync(
            `UPDATE presupuestos SET categoria=?, montoLimit=?, fecha=? WHERE id=?`,
            [categoria, montoLimit, fecha, id]
        );
    },

    eliminar: async (id) => {
        return await db.runAsync(`DELETE FROM presupuestos WHERE id=?`, [id]);
    },

    obtenerTodos: async (usuario_id) => {
        if (!usuario_id) return [];
        return await db.getAllAsync(`SELECT * FROM presupuestos WHERE usuario_id=? ORDER BY fecha DESC`, [usuario_id]);
    },

    verificarPresupuesto: async (categoria, mes, usuario_id) => {
        if (!usuario_id) return null;
        const result = await db.getAllAsync(
            `SELECT * FROM presupuestos WHERE categoria=? AND fecha=? AND usuario_id=?`,
            [categoria, mes, usuario_id]
        );
        return result.length > 0 ? result[0] : null;
    }
};

export default PresupuestosService;
