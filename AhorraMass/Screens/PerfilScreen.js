import React, { useState } from "react";
import {View,Text,StyleSheet,Image,TouchableOpacity,ScrollView,Modal,Alert,TextInput,Switch,} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../Styles/GlobalStyles";
import BottomMenu from "./BottomMenu";

export default function PerfilScreen() {
  const navigation = useNavigation();

  const [editarPerfil, setEditarPerfil] = useState(false);
  const [modalCorreo, setModalCorreo] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const [modalNotificaciones, setModalNotificaciones] = useState(false);

  const [nombreUsuario, setNombreUsuario] = useState("Paulina");
  const [ApellidoUsuario, setApellidoUsuario] = useState("Lara");

  const [NewUsername, SetNewUsername] = useState("");
  const [NewLastname, SetNewLastname] = useState("");

  const [currentEmail, setCurrentEmail] = useState("correoprueba@gmail.com");
  const [nuevoCorreo, setNuevoCorreo] = useState("");

  const [nuevaPass, setNuevaPass] = useState("");

  const [notificaciones, setNotificaciones] = useState(false);

  const botonGuardar = () => {
    if (!NewUsername || !NewLastname) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (NewUsername === nombreUsuario && NewLastname === ApellidoUsuario) {
      Alert.alert("Error", "Los datos deben ser diferentes a los actuales");
      return;
    }
    if (NewUsername.length < 3 || NewUsername.length > 20) {
      Alert.alert("Error", "El nombre debe tener entre 3 y 20 caracteres");
      return;
    }

    setNombreUsuario(NewUsername);
    setApellidoUsuario(NewLastname);
    setEditarPerfil(false);
    SetNewUsername("");
    SetNewLastname("");
  };

  const botonCerrar = () => {
    setEditarPerfil(false);
    SetNewUsername("");
    SetNewLastname("");
  };

  const guardarCorreo = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!nuevoCorreo || !emailRegex.test(nuevoCorreo)) {
      Alert.alert("Error", "Ingresa un correo válido");
      return;
    }
    setCurrentEmail(nuevoCorreo);
    setNuevoCorreo("");
    setModalCorreo(false);
  };

  const guardarPassword = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!nuevaPass) {
      Alert.alert("Error", "La contraseña no puede estar vacía");
      return;
    }
    if (!passwordRegex.test(nuevaPass)) {
      Alert.alert(
        "Error",
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número."
      );
      return;
    }

    Alert.alert("Éxito", "Contraseña actualizada");
    setNuevaPass("");
    setModalPassword(false);
  };

  const confirmarLogout = () => {
    setModalLogout(false);
    navigation.navigate("LogIn");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Image
            source={require("../assets/Images/logoo.png")}
            style={styles.logo}
          />

          <View style={styles.userInfo}>
            <Image
              source={require("../assets/Images/UsuarioIcon.png")}
              style={styles.profilePic}
            />

            <Text style={styles.userName}>
              {nombreUsuario} {ApellidoUsuario}
            </Text>
            <Text style={styles.userEmail}>{currentEmail}</Text>
          </View>
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => setEditarPerfil(true)}
          >
            <Ionicons name="person-outline" size={22} color="#000033" />
            <Text style={styles.optionText}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("Presupuesto")}
          >
            <Feather name="upload" size={22} color="#000033" />
            <Text style={styles.optionText}>Presupuesto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => setModalCorreo(true)}
          >
            <MaterialIcons name="email" size={22} color="#000033" />
            <Text style={styles.optionText}>Cambiar correo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => setModalPassword(true)}
          >
            <Feather name="lock" size={22} color="#000033" />
            <Text style={styles.optionText}>Cambiar contraseña</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => setModalNotificaciones(true)}
          >
            <Ionicons name="notifications-outline" size={22} color="#000033" />
            <Text style={styles.optionText}>Notificaciones</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logout}
          onPress={() => setModalLogout(true)}
        >
          <Ionicons name="log-out-outline" size={22} color="#000033" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={editarPerfil} onRequestClose={botonCerrar}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>
              Cambiar nombre de usuario
            </Text>

            <TextInput
              style={GlobalStyles.modalInput}
              placeholder="Nombre"
              placeholderTextColor="#888"
              value={NewUsername}
              onChangeText={SetNewUsername}
            />

            <TextInput
              style={GlobalStyles.modalInput}
              placeholder="Apellido/s"
              placeholderTextColor="#888"
              value={NewLastname}
              onChangeText={SetNewLastname}
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

      <Modal animationType="slide" transparent={true} visible={modalCorreo} onRequestClose={() => setModalCorreo(false)}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>Cambiar correo</Text>

            <TextInput
              style={GlobalStyles.modalInput}
              placeholder="Nuevo correo"
              placeholderTextColor="#888"
              value={nuevoCorreo}
              onChangeText={setNuevoCorreo}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={GlobalStyles.modalBotones}>
              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar]}
                onPress={() => setModalCorreo(false)}
              >
                <Text style={GlobalStyles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar]}
                onPress={guardarCorreo}
              >
                <Text style={GlobalStyles.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalPassword} onRequestClose={() => setModalPassword(false)}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>Cambiar contraseña</Text>

            <TextInput
              secureTextEntry
              style={GlobalStyles.modalInput}
              placeholder="Nueva contraseña"
              placeholderTextColor="#888"
              value={nuevaPass}
              onChangeText={setNuevaPass}
            />

            <View style={GlobalStyles.modalBotones}>
              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar]}
                onPress={() => setModalPassword(false)}
              >
                <Text style={GlobalStyles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar]}
                onPress={guardarPassword}
              >
                <Text style={GlobalStyles.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalNotificaciones} onRequestClose={() => setModalNotificaciones(false)}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>Notificaciones</Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
              <Text style={{ fontSize: 16 }}>Activar notificaciones</Text>
              <Switch value={notificaciones} onValueChange={setNotificaciones} />
            </View>

            <TouchableOpacity
              style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar]}
              onPress={() => setModalNotificaciones(false)}
            >
              <Text style={GlobalStyles.botonGuardarTexto}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={modalLogout} onRequestClose={() => setModalLogout(false)}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>
              ¿Seguro que deseas cerrar sesión?
            </Text>

            <View style={GlobalStyles.modalBotones}>
              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar]}
                onPress={() => setModalLogout(false)}
              >
                <Text style={GlobalStyles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar]}
                onPress={confirmarLogout}
              >
                <Text style={GlobalStyles.botonGuardarTexto}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scroll: { paddingBottom: 80 },
  header: {
    alignItems: "center",
    paddingTop: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  logo: { width: 140, height: 40, resizeMode: "contain", marginBottom: 10 },
  userInfo: { alignItems: "center" },
  profilePic: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#000033" },
  userEmail: { fontSize: 13, color: "#777" },
  options: { padding: 20 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },
  optionText: { fontSize: 15, marginLeft: 10, color: "#000033" },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  logoutText: { marginLeft: 10, color: "#000033", fontSize: 15 },
});
