import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Switch,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import AuthService from "../src/services/AuthService";

const logo = require("../assets/Images/logoo.png");

export default function SignInScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [año, setAño] = useState("");
  const [genero, setGenero] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AuthService.initialize();
  }, []);

  const mostrarAlerta = (titulo, mensaje) => {
    Platform.OS === "web"
      ? alert(`${titulo}\n\n${mensaje}`)
      : Alert.alert(titulo, mensaje);
  };

  const validar = () => {
    if (!nombre || !apellido || !dia || !mes || !año || !genero || !correo || !password) {
      mostrarAlerta("Error", "Completa todos los campos.");
      return false;
    }

    if (!aceptaTerminos) {
      mostrarAlerta("Error", "Debes aceptar los términos.");
      return false;
    }

    const correoTrim = correo.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(correoTrim)) {
      mostrarAlerta("Error", "Correo inválido.");
      return false;
    }

    if (password.length < 6) {
      mostrarAlerta("Error", "La contraseña debe tener al menos 6 caracteres.");
      return false;
    }

    const dd = parseInt(dia);
    const mm = parseInt(mes);
    const aaaa = parseInt(año);

    if (isNaN(dd) || dd < 1 || dd > 31 || isNaN(mm) || mm < 1 || mm > 12 || isNaN(aaaa) || aaaa < 1900) {
      mostrarAlerta("Error", "Fecha de nacimiento inválida.");
      return false;
    }

    return true;
  };

  const registrar = async () => {
    if (!validar()) return;

    setLoading(true);

    try {
      const user = {
        nombre,
        apellido,
        dia,
        mes,
        ano: año,
        genero,
        correo: correo.trim().toLowerCase(),
        contrasena: password
      };

      const ok = await AuthService.registrarUsuario(user);

      if (!ok) {
        mostrarAlerta("Error", "El correo ya está registrado.");
        setLoading(false);
        return;
      }

      mostrarAlerta("Registro exitoso", `${nombre}, tu cuenta fue creada.`);
      navigation.navigate("Login");
    } catch (err) {
      console.log("ERROR REGISTRO:", err);
      mostrarAlerta("Error", "Hubo un error al registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 80}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.titulo}>Registrarte</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 5 }]}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 5 }]}
              placeholder="Apellido"
              value={apellido}
              onChangeText={setApellido}
            />
          </View>

          <Text style={styles.label}>Fecha de nacimiento</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.inputFecha, { marginRight: 5 }]}
              placeholder="DD"
              value={dia}
              onChangeText={setDia}
              keyboardType="numeric"
              maxLength={2}
            />
            <TextInput
              style={[styles.inputFecha, { marginRight: 5 }]}
              placeholder="MM"
              value={mes}
              onChangeText={setMes}
              keyboardType="numeric"
              maxLength={2}
            />
            <TextInput
              style={styles.inputFecha}
              placeholder="AAAA"
              value={año}
              onChangeText={setAño}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          <Text style={styles.label}>Género</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.botonGenero, genero === "Mujer" && styles.generoActivo]}
              onPress={() => setGenero("Mujer")}
            >
              <Text style={[styles.textoGenero, genero === "Mujer" && styles.textoGeneroActivo]}>
                Mujer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonGenero, genero === "Hombre" && styles.generoActivo]}
              onPress={() => setGenero("Hombre")}
            >
              <Text style={[styles.textoGenero, genero === "Hombre" && styles.textoGeneroActivo]}>
                Hombre
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.switchRow}>
            <Text style={styles.splashSubtitle}>Acepto los términos</Text>
            <Switch value={aceptaTerminos} onValueChange={setAceptaTerminos} />
          </View>

          <TouchableOpacity style={styles.boton} onPress={registrar} disabled={loading}>
            <Text style={styles.textoBoton}>{loading ? "Creando cuenta..." : "Registrarte"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: "#FFF" },
  container: { padding: 25, alignItems: "center" },
  logo: { width: 120, height: 60, marginBottom: 10 },
  titulo: { fontSize: 26, fontWeight: "600", marginBottom: 20 },
  row: { flexDirection: "row", width: "100%", marginBottom: 10 },
  input: {
    backgroundColor: "#F2F2F2",
    width: "100%",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10
  },
  inputFecha: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: 10,
    textAlign: "center"
  },
  label: { alignSelf: "flex-start", marginBottom: 5, fontWeight: "500" },
  botonGenero: {
    flex: 1,
    backgroundColor: "#E8E8E8",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5
  },
  generoActivo: { backgroundColor: "#0C1B4D" },
  textoGenero: { color: "#0C1B4D" },
  textoGeneroActivo: { color: "#FFF" },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    justifyContent: "space-between"
  },
  splashSubtitle: { color: "#333" },
  boton: {
    backgroundColor: "#0C1B4D",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center"
  },
  textoBoton: { color: "#FFF", fontSize: 18, fontWeight: "bold" }
});
