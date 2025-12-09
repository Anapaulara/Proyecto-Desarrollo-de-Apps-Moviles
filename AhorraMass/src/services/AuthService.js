import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Open DB Synchronously (Best Practice for stability)
// Ensure we use the same DB or keep auth separate. Keeping 'auth2.db' to preserve user data.
let db = null;
if (Platform.OS !== "web") {
    db = SQLite.openDatabaseSync("auth2.db");
}

class AuthService {
    constructor() {
        this.db = db;
        this.storageKey = "usuarios";
    }

    async initialize() {
        if (Platform.OS === "web" || !this.db) return;

        try {
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
        } catch (error) {
            console.log("Error initializing Auth DB table:", error);
        }
    }

    async registrarUsuario(userData) {
        if (!this.db) return false;
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
        if (!this.db) return null;
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
        if (!this.db) return null;
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
        if (!this.db) return false;
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

    // --- SESSION MANAGEMENT ---

    async setSession(user) {
        try {
            await AsyncStorage.setItem('user_session', JSON.stringify(user));
        } catch (e) { console.error(e); }
    }

    async getSession() {
        try {
            const json = await AsyncStorage.getItem('user_session');
            return json ? JSON.parse(json) : null;
        } catch (e) { return null; }
    }

    async logout() {
        try {
            await AsyncStorage.removeItem('user_session');
        } catch (e) { console.error(e); }
    }
}

export default new AuthService();
