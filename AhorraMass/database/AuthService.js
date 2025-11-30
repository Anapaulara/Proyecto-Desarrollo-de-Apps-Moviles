import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import * as Crypto from "expo-crypto";

class AuthService {
    constructor() {
        this.db = null;
        this.storageKey = "usuariosAuth";
    }

    async hash(text) {
        return await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            text
        );
    }

    async initialize() {
        if (Platform.OS === "web") {
            console.log("WEB → usando LocalStorage para usuarios");
            return;
        }

        console.log("MÓVIL → usando SQLite para usuarios");

        this.db = await SQLite.openDatabaseAsync("auth.db");

        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                correo TEXT UNIQUE NOT NULL,
                contrasena TEXT NOT NULL
            );
        `);
    }

    // Registrar usuario
    async registrarUsuario(correo, contrasena) {
        const hashed = await this.hash(contrasena);

        if (Platform.OS === "web") {
            let usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];

            if (usuarios.some(u => u.correo === correo)) return false;

            usuarios.push({
                id: Date.now(),
                correo,
                contrasena: hashed
            });

            localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
            return true;
        }

        try {
            await this.db.runAsync(
                "INSERT INTO usuarios (correo, contrasena) VALUES (?, ?)",
                correo,
                hashed
            );
            return true;
        } catch (err) {
            console.log("ERROR REGISTRAR:", err);
            return false;
        }
    }

    // Login
    async loginUsuario(correo, contrasena) {
        const hashed = await this.hash(contrasena);

        if (Platform.OS === "web") {
            const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
            return usuarios.find(u => u.correo === correo && u.contrasena === hashed) || null;
        }

        const result = await this.db.getAllAsync(
            "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?",
            correo,
            hashed
        );

        return result.length > 0 ? result[0] : null;
    }

    // Buscar correo (recuperar contraseña)
    async buscarCorreo(correo) {
        if (Platform.OS === "web") {
            const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
            return usuarios.find(u => u.correo === correo) || null;
        }

        const result = await this.db.getAllAsync(
            "SELECT * FROM usuarios WHERE correo = ?",
            correo
        );

        return result.length ? result[0] : null;
    }

    // Actualizar contraseña
    async actualizarPassword(correo, nuevaPassword) {
        const hashed = await this.hash(nuevaPassword);

        if (Platform.OS === "web") {
            const usuarios = JSON.parse(localStorage.getItem(this.storageKey)) || [];
            const user = usuarios.find(u => u.correo === correo);

            if (!user) return false;

            user.contrasena = hashed;
            localStorage.setItem(this.storageKey, JSON.stringify(usuarios));
            return true;
        }

        try {
            await this.db.runAsync(
                "UPDATE usuarios SET contrasena = ? WHERE correo = ?",
                hashed,
                correo
            );
            return true;
        } catch (err) {
            console.log("ERROR UPDATE:", err);
            return false;
        }
    }
}

export default new AuthService();
