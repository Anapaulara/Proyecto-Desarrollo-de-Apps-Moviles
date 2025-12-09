import * as SQLite from 'expo-sqlite';

class NotificacionesService {
    constructor() {
        this.db = SQLite.openDatabaseSync('miDB.db');
        this.initialize();
    }

    async initialize() {
        try {
            await this.db.execAsync(`
                CREATE TABLE IF NOT EXISTS notificaciones (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    titulo TEXT,
                    mensaje TEXT,
                    tipo TEXT,
                    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
                    leido INTEGER DEFAULT 0
                );
            `);

            try {
                await this.db.runAsync(`ALTER TABLE notificaciones ADD COLUMN usuario_id INTEGER;`);
            } catch (e) { }

        } catch (error) {
            console.error('Error initializing notifications table', error);
        }
    }

    async agregar(titulo, mensaje, tipo = 'info', usuario_id) {
        if (!usuario_id) return;
        try {
            const result = await this.db.runAsync(
                'INSERT INTO notificaciones (titulo, mensaje, tipo, usuario_id) VALUES (?, ?, ?, ?)',
                [titulo, mensaje, tipo, usuario_id]
            );
            return result.lastInsertRowId;
        } catch (error) {
            console.error('Error adding notification', error);
        }
    }

    async obtenerTodas(usuario_id) {
        if (!usuario_id) return [];
        try {
            const result = await this.db.getAllAsync(
                'SELECT * FROM notificaciones WHERE usuario_id=? ORDER BY id DESC',
                [usuario_id]
            );
            return result;
        } catch (error) {
            console.error('Error retrieving notifications', error);
            return [];
        }
    }

    async eliminarTodas(usuario_id) {
        if (!usuario_id) return;
        try {
            await this.db.runAsync('DELETE FROM notificaciones WHERE usuario_id=?', [usuario_id]);
        } catch (error) {
            console.error('Error clearing notifications', error);
        }
    }
}

export default new NotificacionesService();
