import React, { useState, useEffect } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import GlobalStyles from "../Styles/GlobalStyles";
import AuthService from "../src/services/AuthService";

export default function LogInScreen({ navigation }) {
  const [mail, setMail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [showPass, setShowPass] = useState(false);

  // AuthService.initialize() is handled in App.js
  // Keeping useEffect empty or removing if not needed.
  useEffect(() => {
    // Optional: Check session here if auto-login is desired, but App.js might handle it too.
  }, []);

  const iniciarSesion = async () => {
    if (!mail || !contrasena) {
      Alert.alert("Error", "Completa todos los campos.");
      return;
    }

    const usuario = await AuthService.loginUsuario(
      mail.trim().toLowerCase(),
      contrasena
    );

    if (!usuario || usuario.length === 0) {
      Alert.alert("Error", "Correo o contraseña incorrectos.");
      return;
    }

    await AuthService.setSession(
      usuario
    );

    Alert.alert("Bienvenido", "Inicio de sesión exitoso.");
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ahorra+</Text>

      <View style={styles.mainOverlay}>
        <Text style={styles.welcome}>Bienvenido a Ahorra+!</Text>
        <Text style={styles.splashTitle}>Inicio de sesión</Text>

        <Text style={styles.splashSubtitle}>Correo:</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@example.com"
          value={mail}
          onChangeText={setMail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.splashSubtitle}>Contraseña:</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            secureTextEntry={!showPass}
            value={contrasena}
            onChangeText={setContrasena}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons
              name={showPass ? "eye-off" : "eye"}
              size={22}
              color="#333"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.button}>
        <Button title="Iniciar sesión" color="#0f1344" onPress={iniciarSesion} />
      </View>

      <Pressable onPress={() => navigation.navigate("Recuperar")}>
        <Text style={styles.link}>¿No recuerdas tu contraseña?</Text>
      </Pressable>

      <View style={styles.switchRow}>
        <Text style={styles.splashSubtitle}>¿No tienes una cuenta?</Text>
        <Button
          title="Regístrate"
          color="#1a26aa"
          onPress={() => navigation.navigate("SignIn")}
        />
      </View>

      <View style={styles.pie}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingTop: 40,
  },
  pie: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 35,
    backgroundColor: "#0f1344",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  titulo: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#0f1344",
  },
  mainOverlay: {
    alignItems: "center",
    backgroundColor: "rgba(47,127,255,0.26)",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    marginTop: 30,
  },
  welcome: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "600",
    color: "#000",
  },
  splashTitle: {
    fontSize: 26,
    fontWeight: "700",
  },
  splashSubtitle: {
    color: "#333",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    width: "80%",
    padding: 10,
    marginBottom: 15,
  },
  link: {
    color: "blue",
    fontSize: 18,
    padding: 10,
  },
  button: {
    marginTop: 10,
  },
  switchRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    gap: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    width: "80%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 8,
  },
});
