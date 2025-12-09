import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator
} from "react-native";

import AuthService from "../src/services/AuthService";
import { Ionicons } from "@expo/vector-icons";

export default function RecuperarPasswordScreen({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [loading, setLoading] = useState(false);

  const cambiarPassword = async () => {
    if (!correo || !pass1 || !pass2) {
      Alert.alert("Error", "Completa todos los campos.");
      return;
    }

    if (pass1 !== pass2) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    if (pass1.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const correoLimpio = correo.trim().toLowerCase();
      const existe = await AuthService.buscarCorreo(correoLimpio);

      if (!existe) {
        Alert.alert("Error", "Este correo no se encuentra registrado en nuestra base de datos.");
        setLoading(false);
        return;
      }

      const success = await AuthService.actualizarPassword(correoLimpio, pass1);

      if (success) {
        Alert.alert(
          "¡Contraseña Restablecida!",
          "Tu contraseña ha sido actualizada correctamente. Inicia sesión con tus nuevas credenciales.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Error", "Hubo un problema al actualizar. Intenta de nuevo.");
      }

    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Recuperación</Text>
      <Text style={styles.subtitulo}>Ingresa tu correo y define una nueva contraseña.</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo registrado"
        placeholderTextColor="#999"
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Nueva contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={pass1}
        onChangeText={setPass1}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={pass2}
        onChangeText={setPass2}
      />

      <TouchableOpacity
        style={[styles.boton, loading && { opacity: 0.7 }]}
        onPress={cambiarPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.botonTexto}>Actualizar Contraseña</Text>
        )}
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    backgroundColor: '#fff',
    paddingHorizontal: 25
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    color: '#0f1344'
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center'
  },
  input: {
    width: "100%",
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16
  },
  boton: {
    backgroundColor: "#0f1344",
    paddingVertical: 15,
    width: "100%",
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botonTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }
});
