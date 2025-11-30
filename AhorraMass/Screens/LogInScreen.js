import React, { useState, useEffect } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";

import GlobalStyles from "../Styles/GlobalStyles";
import AuthService from "../database/AuthService";

export default function LogInScreen({ navigation }) {
  const [mail, setMail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [cNewPassword, setCNewPassword] = useState("");

  // inicializamos BD
  useEffect(() => {
    AuthService.initialize();
  }, []);

  // LOGIN
  const iniciarSesion = async () => {
    if (!mail || !contrasena) {
      Alert.alert("Error", "Completa todos los campos.");
      return;
    }

    const usuario = await AuthService.loginUsuario(mail, contrasena);

    if (!usuario) {
      Alert.alert("Error", "Correo o contraseña incorrectos.");
      return;
    }

    Alert.alert("Bienvenido", "Inicio de sesión exitoso.");
    navigation.navigate("Principal");
  };

  // CERRAR MODAL
  const botonCerrar = () => {
    setModalVisible(false);
    setNewPassword("");
    setCNewPassword("");
  };

  // GUARDAR NUEVA CONTRASEÑA
  const botonGuardar = async () => {
    if (!mail) {
      Alert.alert("Error", "Ingresa tu correo en el campo superior.");
      return;
    }

    if (newPassword !== cNewPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    const existe = await AuthService.buscarCorreo(mail);

    if (!existe) {
      Alert.alert("Error", "Ese correo no está registrado.");
      return;
    }

    await AuthService.actualizarPassword(mail, newPassword);
    Alert.alert("Éxito", "Tu contraseña ha sido actualizada.");
    botonCerrar();
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
        />

        <Text style={styles.splashSubtitle}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
        />
      </View>

      <View style={styles.button}>
        <Button title="Iniciar sesión" color="#0f1344" onPress={iniciarSesion} />
      </View>

      <Pressable onPress={() => setModalVisible(true)}>
        <Text style={{ color: "blue", fontSize: 18, padding: 10 }}>
          ¿No recuerdas tu contraseña?
        </Text>
      </Pressable>

      {/* MODAL */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>Renovar contraseña</Text>

            <TextInput
              style={GlobalStyles.modalInput}
              placeholder="Nueva contraseña"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextInput
              style={GlobalStyles.modalInput}
              placeholder="Confirmar contraseña"
              secureTextEntry
              value={cNewPassword}
              onChangeText={setCNewPassword}
            />

            <View style={GlobalStyles.modalBotones}>
              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar]}
                onPress={botonCerrar}
              >
                <Text style={GlobalStyles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar]}
                onPress={botonGuardar}
              >
                <Text style={GlobalStyles.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

// estilos iguales a los tuyos
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
  button: {
    marginTop: 10,
  },
  switchRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    gap: 10,
  },
});
