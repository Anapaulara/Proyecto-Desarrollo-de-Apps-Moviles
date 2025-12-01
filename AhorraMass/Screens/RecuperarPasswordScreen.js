import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

import AuthService from "../src/services/AuthService";

export default function RecuperarPasswordScreen({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  const cambiarPassword = async () => {
    if (!correo || !pass1 || !pass2) {
      Alert.alert("Error", "Completa todos los campos.");
      return;
    }

    if (pass1 !== pass2) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    const existe = await AuthService.buscarCorreo(correo.trim().toLowerCase());

    if (!existe || existe.length === 0) {
      Alert.alert("Error", "Ese correo no está registrado.");
      return;
    }

    await AuthService.actualizarPassword(correo.trim().toLowerCase(), pass1);

    Alert.alert("Éxito", "Tu contraseña ha sido actualizada.");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Recuperar contraseña</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo registrado"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        secureTextEntry
        value={pass1}
        onChangeText={setPass1}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
        value={pass2}
        onChangeText={setPass2}
      />

      <TouchableOpacity style={styles.boton} onPress={cambiarPassword}>
        <Text style={styles.botonTexto}>Guardar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },
  input: {
    width: "85%",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  boton: {
    backgroundColor: "#0f1344",
    padding: 12,
    width: "85%",
    borderRadius: 10,
    marginTop: 10,
  },
  botonTexto: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 15,
    color: "blue",
    fontSize: 16,
  },
});
