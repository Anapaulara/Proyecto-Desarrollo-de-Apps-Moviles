import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Platform,
  Switch,
} from "react-native";

import AuthService from "../database/AuthService";
import { useNavigation } from "@react-navigation/native";

const logo = require("../assets/Images/logoo.png");

export default function SignInScreen() {
  const navigation = useNavigation();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [año, setAño] = useState("");
  const [genero, setGenero] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === "web") alert(`${titulo}\n\n${mensaje}`);
    else Alert.alert(titulo, mensaje);
  };

  const registrar = async () => {
    if (
      !nombre ||
      !apellido ||
      !dia ||
      !mes ||
      !año ||
      !genero ||
      !correo ||
      !password
    ) {
      mostrarAlerta("Error", "Por favor completa todos los campos.");
      return;
    }

    if (!aceptaTerminos) {
      mostrarAlerta("Error", "Debes aceptar los términos.");
      return;
    }

    // SOLO se registrará el usuario con correo y contraseña.
    // Los demás datos son solo para diseño.
    const exito = await AuthService.registrarUsuario(correo, password);

    if (!exito) {
      mostrarAlerta("Error", "Ese correo ya está registrado.");
      return;
    }

    mostrarAlerta("Éxito", "Usuario registrado correctamente.");
    navigation.navigate("LogIn");
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.titulo}>Registrarte</Text>

        {/* CAMPOS */}
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
          />
          <TextInput
            style={[styles.inputFecha, { marginRight: 5 }]}
            placeholder="MM"
            value={mes}
            onChangeText={setMes}
          />
          <TextInput
            style={styles.inputFecha}
            placeholder="AAAA"
            value={año}
            onChangeText={setAño}
          />
        </View>

        <Text style={styles.label}>Género</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.botonGenero,
              genero === "Mujer" && styles.generoActivo,
            ]}
            onPress={() => setGenero("Mujer")}
          >
            <Text style={styles.textoGenero}>Mujer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.botonGenero,
              genero === "Hombre" && styles.generoActivo,
            ]}
            onPress={() => setGenero("Hombre")}
          >
            <Text style={styles.textoGenero}>Hombre</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          value={correo}
          onChangeText={setCorreo}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.switchRow}>
          <Text style={styles.splashSubtitle}>
            Acepto los términos y condiciones
          </Text>
          <Switch value={aceptaTerminos} onValueChange={setAceptaTerminos} />
        </View>

        <TouchableOpacity style={styles.boton} onPress={registrar}>
          <Text style={styles.textoBoton}>Registrarte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-evenly",
    width: "100%",
    borderRadius: 8,
    marginBottom: 15,
  },
  splashSubtitle: {
    color: "#333",
    marginTop: 8,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 25,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "600",
    color: "#0C1B4D",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#F2F2F2",
    width: "100%",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  inputFecha: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: 10,
    textAlign: "center",
    fontSize: 16,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontWeight: "500",
    color: "#0C1B4D",
  },
  botonGenero: {
    flex: 1,
    backgroundColor: "#E8E8E8",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  generoActivo: {
    backgroundColor: "#0C1B4D",
  },
  textoGenero: {
    color: "#fff",
    fontSize: 16,
  },
  boton: {
    backgroundColor: "#0C1B4D",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 10,
    alignItems: "center",
  },
  textoBoton: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
