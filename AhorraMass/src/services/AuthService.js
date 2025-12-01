import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

class AuthService {
    constructor() {
        this.db = null;
        this.storageKey = "usuarios";
    }

    async initialize() {
        if (Platform.OS === "web") return;

        this.db = await SQLite.openDatabaseAsync("auth2.db");

        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                apellido TEXT,
                dia TEXT,
                mes TEXT,
                ano TEXT,
                genero TEXT,
                correo TEXT UNIQUE NOT NULL,
                contrasena TEXT NOT NULL
            );
        `);
    }

    async registrarUsuario(userData) {
        const { nombre, apellido, dia, mes, ano, genero, correo, contrasena } = userData;

        try {
            await this.db.runAsync(
                `INSERT INTO usuarios 
                (nombre, apellido, dia, mes, ano, genero, correo, contrasena)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [nombre, apellido, dia, mes, ano, genero, correo, contrasena]
            );
            return true;

        } catch (err) {
            console.log("ERROR REGISTRAR:", err);
            return false;
        }
    }

    async loginUsuario(correo, contrasena) {
        try {
            const result = await this.db.getAllAsync(
                "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?",
                [correo, contrasena]
            );
            return result.length > 0 ? result[0] : null;

        } catch (err) {
            console.log("ERROR LOGIN:", err);
            return null;
        }
    }

    async buscarCorreo(correo) {
        try {
            const result = await this.db.getAllAsync(
                "SELECT * FROM usuarios WHERE correo = ?",
                [correo]
            );
            return result.length ? result[0] : null;

        } catch (err) {
            console.log("ERROR BUSCAR:", err);
            return null;
        }
    }

    async actualizarPassword(correo, nuevaPass) {
        try {
            await this.db.runAsync(
                "UPDATE usuarios SET contrasena = ? WHERE correo = ?",
                [nuevaPass, correo]
            );
            return true;

        } catch (err) {
            console.log("ERROR UPDATE:", err);
            return false;
        }
    }
}

export default new AuthService();
