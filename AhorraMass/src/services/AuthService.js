import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

class AuthService {
  constructor() {
    this.db = null;
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

    console.log("✔ AuthService: base lista");
  }

  // REGISTRO
  async registrarUsuario(userData) {
    const { nombre, apellido, dia, mes, ano, genero, correo, contrasena } =
      userData;

    try {
      await this.db.runAsync(
        `INSERT INTO usuarios 
        (nombre, apellido, dia, mes, ano, genero, correo, contrasena)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, apellido, dia, mes, ano, genero, correo, contrasena]
      );

      return true;
    } catch (err) {
      console.log("❌ ERROR REGISTRAR:", err);
      return false;
    }
  }

  // LOGIN
  async loginUsuario(correo, contrasena) {
    try {
      const result = await this.db.getAllAsync(
        "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?",
        [correo, contrasena]
      );

      return result.length > 0 ? result[0] : null;
    } catch (err) {
      console.log("❌ ERROR LOGIN:", err);
      return null;
    }
  }

  // BUSCAR CORREO
  async buscarCorreo(correo) {
    try {
      const result = await this.db.getAllAsync(
        "SELECT * FROM usuarios WHERE correo = ?",
        [correo]
      );

      return result.length ? result[0] : null;
    } catch (err) {
      console.log("❌ ERROR BUSCAR CORREO:", err);
      return null;
    }
  }

  // UPDATE NOMBRE + APELLIDO
  async actualizarNombreApellido(id, nombre, apellido) {
    try {
      await this.db.runAsync(
        "UPDATE usuarios SET nombre = ?, apellido = ? WHERE id = ?",
        [nombre, apellido, id]
      );
      return true;
    } catch (err) {
      console.log("❌ ERROR UPDATE NOMBRE/APELLIDO:", err);
      return false;
    }
  }

  // UPDATE CORREO
  async actualizarCorreo(id, correo) {
    try {
      await this.db.runAsync(
        "UPDATE usuarios SET correo = ? WHERE id = ?",
        [correo, id]
      );
      return true;
    } catch (err) {
      console.log("❌ ERROR UPDATE CORREO:", err);
      return false;
    }
  }

  // UPDATE CONTRASEÑA
  async actualizarPassword(correo, nuevaPass) {
    try {
      await this.db.runAsync(
        "UPDATE usuarios SET contrasena = ? WHERE correo = ?",
        [nuevaPass, correo]
      );

      return true;
    } catch (err) {
      console.log("❌ ERROR UPDATE PASSWORD:", err);
      return false;
    }
  }
}

export default new AuthService();
