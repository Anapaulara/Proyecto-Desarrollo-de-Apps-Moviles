import * as SQLite from "expo-sqlite";

// Abrimos la BD con API nueva
const db = SQLite.openDatabaseSync("miDB.db");

// Creamos tabla si no existe
db.execSync(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    correo TEXT UNIQUE NOT NULL,
    contrasena TEXT NOT NULL
  );
`);

// 🔵 Registrar usuario
export const registrarUsuario = async (correo, contrasena) => {
  try {
    db.runSync(
      "INSERT INTO usuarios (correo, contrasena) VALUES (?, ?)",
      [correo, contrasena]
    );
    return true;
  } catch (err) {
    console.log("ERROR REGISTRAR:", err);
    return false;
  }
};

// 🔵 Login final
export const loginUsuario = async (correo, contrasena) => {
  try {
    const user = db.getAllSync(
      "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?",
      [correo, contrasena]
    );
    return user; // regresa [] si no existe
  } catch (err) {
    console.log("ERROR LOGIN:", err);
    return [];
  }
};

// 🔵 Buscar correo para recuperación
export const buscarCorreo = async (correo) => {
  try {
    const result = db.getAllSync(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );
    return result; // [] si no existe
  } catch (err) {
    console.log("ERROR BUSCAR CORREO:", err);
    return [];
  }
};

// 🔵 Actualizar contraseña
export const actualizarPassword = async (correo, nueva) => {
  try {
    db.runSync(
      "UPDATE usuarios SET contrasena = ? WHERE correo = ?",
      [nueva, correo]
    );
    return true;
  } catch (err) {
    console.log("ERROR ACTUALIZAR PASSWORD:", err);
    return false;
  }
};

export default db;
