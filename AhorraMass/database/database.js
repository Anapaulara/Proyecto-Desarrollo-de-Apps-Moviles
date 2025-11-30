import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

class AuthDB {
    constructor() {
        this.db = null;
        this.storageKey = "usuarios";
    }

    async initialize() {
        if (Platform.OS === "web") {
            console.log("WEB → usando localStorage");
            return;
        }

        console.log("MÓVIL → usando SQLite");

        this.db = await SQLite.openDatabaseAsync("auth.db");

        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                correo TEXT UNIQUE NOT NULL,
                contrasena TEXT NOT NULL
            );
        `);
    }

    // -----------------------------
    // REGISTRAR
    // -----------------------------
    async registrarUsuario(correo, contrasena) {
        if (Platform.OS === "web") {
            const usuarios = await this.getAllUsuarios();

            // validar correo repetido
            if (usuarios.some(u => u.correo === correo)) return false;

            usuarios.push({ id: Date.now(), correo, contrasena });
            localStorage.setItem(this.storageKey, JSON.stringify(usuarios));

            return true;
        }

        try {
            await this.db.runAsync(
                "INSERT INTO usuarios (correo, contrasena) VALUES (?, ?)",
                correo,
                contrasena
            );
            return true;
        } catch (err) {
            console.log("ERROR REGISTRAR:", err);
            return false;
        }
    }

    // -----------------------------
    // LOGIN
    // -----------------------------
    async loginUsuario(correo, contrasena) {
        if (Platform.OS === "web") {
            const usuarios = await this.getAllUsuarios();
            return usuarios.find(
                u => u.correo === correo && u.contrasena === contrasena
            ) || null;
        }

        try {
            const result = await this.db.getAllAsync(
                "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?",
                correo,
                contrasena
            );
            return result.length > 0 ? result[0] : null;
        } catch (err) {
            console.log("ERROR LOGIN:", err);
            return null;
        }
    }

    // -----------------------------
    // RECUPERAR CORREO
    // -----------------------------
    async buscarCorreo(correo) {
        if (Platform.OS === "web") {
            const usuarios = await this.getAllUsuarios();
            return usuarios.find(u => u.correo === correo) || null;
        }

        try {
            const result = await this.db.getAllAsync(
                "SELECT * FROM usuarios WHERE correo = ?",
                correo
            );
            return result.length ? result[0] : null;
        } catch (err) {
            console.log("ERROR BUSCAR:", err);
            return null;
        }
    }

    // -----------------------------
    // ACTUALIZAR CONTRASEÑA
    // -----------------------------
    async actualizarPassword(correo, nuevaPass) {
        if (Platform.OS === "web") {
            const usuarios = await this.getAllUsuarios();
            const usuario = usuarios.find(u => u.correo === correo);
            if (!usuario) return false;

            usuario.contrasena = nuevaPass;
            localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
            return true;
        }

        try {
            await this.db.runAsync(
                "UPDATE usuarios SET contrasena = ? WHERE correo = ?",
                nuevaPass,
                correo
            );
            return true;
        } catch (err) {
            console.log("ERROR UPDATE:", err);
            return false;
        }
    }

    // -----------------------------
    // OBTENER USUARIOS (LOCALSTORAGE)
    // -----------------------------
    async getAllUsuarios() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }
}

export default new AuthDB();
