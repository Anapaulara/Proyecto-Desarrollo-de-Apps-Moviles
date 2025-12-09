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
        } catch (error) {
            console.error('Error initializing notifications table', error);
        }
    }

    async agregar(titulo, mensaje, tipo = 'info') {
        try {
            const result = await this.db.runAsync(
                'INSERT INTO notificaciones (titulo, mensaje, tipo) VALUES (?, ?, ?)',
                [titulo, mensaje, tipo]
            );
            return result.lastInsertRowId;
        } catch (error) {
            console.error('Error adding notification', error);
        }
    }

    async obtenerTodas() {
        try {
            const result = await this.db.getAllAsync(
                'SELECT * FROM notificaciones ORDER BY id DESC'
            );
            return result;
        } catch (error) {
            console.error('Error retrieving notifications', error);
            return [];
        }
    }

    async eliminarTodas() {
        try {
            await this.db.runAsync('DELETE FROM notificaciones');
        } catch (error) {
            console.error('Error clearing notifications', error);
        }
    }
}

export default new NotificacionesService();
