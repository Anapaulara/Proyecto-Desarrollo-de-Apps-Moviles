// PerfilScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  TextInput,
  Switch,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import GlobalStyles from "../Styles/GlobalStyles";
import BottomMenu from "./BottomMenu";
import AuthService from "../src/services/AuthService";
import TransaccionesService from "../src/services/TransaccionesService";

// -----------------------------
// NotificacionesScreen: recibe array de mensajes
// -----------------------------
const NotificacionesScreen = ({ onClose, notificaciones }) => {
  return (
    <View style={GlobalStyles.modalContenedor}>
      <View style={[GlobalStyles.modalVista, styles.fullModal]}>
        <View style={styles.notificationHeader}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#000033" />
          </TouchableOpacity>
          <Text style={styles.notificationTitle}>Tus Notificaciones</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          {(!notificaciones || notificaciones.length === 0) && (
            <Text style={styles.notificationItem}>No hay notificaciones recientes.</Text>
          )}

          {notificaciones?.map((n, i) => (
            <View key={i} style={styles.notificationRow}>
              <Text style={styles.notificationItem}>{n}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

// -----------------------------
// ConfigAppModal
// -----------------------------
const ConfigAppModal = ({ onClose, notificacionesEnabled, setNotificacionesEnabled }) => {
  return (
    <View style={GlobalStyles.modalContenedor}>
      <View style={GlobalStyles.modalVista}>
        <Text style={GlobalStyles.modalTitulo}>Configuración de App</Text>

        <View style={styles.modalOptionConfig}>
          <Ionicons name="notifications-outline" size={22} color="#000033" />
          <Text style={styles.modalOptionText}>Activar notificaciones</Text>
          <Switch value={notificacionesEnabled} onValueChange={setNotificacionesEnabled} />
        </View>

        <TouchableOpacity
          style={[styles.modalOptionConfig, { borderBottomWidth: 0 }]}
          onPress={() => Alert.alert("Próximamente", "Configuración de idioma")}
        >
          <Feather name="globe" size={22} color="#000033" />
          <Text style={styles.modalOptionText}>Idioma</Text>
          <Ionicons name="chevron-forward-outline" size={20} color="#000033" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar, { marginTop: 20 }]}
          onPress={onClose}
        >
          <Text style={GlobalStyles.botonGuardarTexto}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// -----------------------------
// PERFIL SCREEN
// -----------------------------
export default function PerfilScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const routeUsuario = route.params?.usuario ?? null;

  // Datos del usuario
  const [usuario, setUsuario] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [apellidoUsuario, setApellidoUsuario] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  // Foto por usuario (clave profileImage_{id})
  const [profileImage, setProfileImage] = useState(null);

  // modales
  const [modalMenuCuenta, setModalMenuCuenta] = useState(false);
  const [modalNombreApellido, setModalNombreApellido] = useState(false);
  const [modalCorreo, setModalCorreo] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const [modalNotificacionesFull, setModalNotificacionesFull] = useState(false);
  const [modalConfigApp, setModalConfigApp] = useState(false);

  // inputs
  const [newNombre, setNewNombre] = useState("");
  const [newApellido, setNewApellido] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [nuevaPass, setNuevaPass] = useState("");

  const [notificacionesEnabled, setNotificacionesEnabled] = useState(true);

  // lista de notificaciones generadas desde BD
  const [notificaciones, setNotificaciones] = useState([]);

  // Inicializar servicios
  useEffect(() => {
    AuthService.initialize();
    TransaccionesService.initialize();
  }, []);

  // Cargar usuario y foto (desde route o AsyncStorage)
  useEffect(() => {
    const load = async () => {
      try {
        if (routeUsuario) {
          setFromUser(routeUsuario);
          return;
        }

        // revisar ambas claves por compatibilidad: "sessionUser" o "userSession"
        const s1 = await AsyncStorage.getItem("sessionUser");
        const s2 = await AsyncStorage.getItem("userSession");
        const sessionJSON = s1 || s2;
        if (sessionJSON) {
          const u = JSON.parse(sessionJSON);
          setFromUser(u);
        }
      } catch (err) {
        console.log("Error cargando sesión:", err);
      }
    };

    load();
    // también cargar notificaciones cada vez que entramos
    generarNotificaciones();
  }, [routeUsuario]);

  // helper para setear usuario en UI y cargar foto
  const setFromUser = async (u) => {
    setUsuario(u);
    setNombreUsuario(u?.nombre ?? "");
    setApellidoUsuario(u?.apellido ?? "");
    setCurrentEmail(u?.correo ?? "");
    await cargarFoto(u?.id);
  };

  // cargar foto por user id
  const cargarFoto = async (userId) => {
    try {
      const id = userId || usuario?.id;
      if (!id) return;
      const key = `profileImage_${id}`;
      const uri = await AsyncStorage.getItem(key);
      if (uri) setProfileImage(uri);
    } catch (err) {
      console.log("Error cargarFoto:", err);
    }
  };

  // seleccionar imagen (y guardarla por usuario)
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        return Alert.alert("Permiso denegado", "Necesitas permitir acceso a tus fotos.");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const id = usuario?.id;
        if (id) {
          const key = `profileImage_${id}`;
          await AsyncStorage.setItem(key, uri);
          setProfileImage(uri);
        } else {
          // fallback
          await AsyncStorage.setItem("profileImage", uri);
          setProfileImage(uri);
        }
      }
    } catch (err) {
      console.log("pickImage error:", err);
    }
  };

  // abrir modal editar (prefill)
  const onOpenEditar = () => {
    setNewNombre(nombreUsuario);
    setNewApellido(apellidoUsuario);
    setModalNombreApellido(true);
  };

  // guardar nombre y apellido en BD + actualizar session
  const guardarNombreApellido = async () => {
    if (!newNombre || !newApellido) {
      return Alert.alert("Error", "Rellena ambos campos.");
    }
    if (!usuario?.id) {
      return Alert.alert("Error", "Usuario no cargado.");
    }

    try {
      await AuthService.db.runAsync(
        `UPDATE usuarios SET nombre = ?, apellido = ? WHERE id = ?`,
        [newNombre, newApellido, usuario.id]
      );

      const updated = { ...usuario, nombre: newNombre, apellido: newApellido };
      setUsuario(updated);
      setNombreUsuario(newNombre);
      setApellidoUsuario(newApellido);
      // persistir sesión con nueva info (admite ambas claves)
      await AsyncStorage.setItem("sessionUser", JSON.stringify(updated));
      await AsyncStorage.setItem("userSession", JSON.stringify(updated));

      setModalNombreApellido(false);
      Alert.alert("Éxito", "Nombre actualizado.");
    } catch (err) {
      console.log("guardarNombreApellido error:", err);
      Alert.alert("Error", "No se pudo actualizar.");
    }
  };

  // guardar correo
  const guardarCorreo = async () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(nuevoCorreo)) {
      return Alert.alert("Correo no válido");
    }
    if (!usuario?.id) return Alert.alert("Usuario no cargado");

    try {
      await AuthService.db.runAsync(
        `UPDATE usuarios SET correo = ? WHERE id = ?`,
        [nuevoCorreo, usuario.id]
      );

      const updated = { ...usuario, correo: nuevoCorreo };
      setUsuario(updated);
      setCurrentEmail(nuevoCorreo);
      await AsyncStorage.setItem("sessionUser", JSON.stringify(updated));
      await AsyncStorage.setItem("userSession", JSON.stringify(updated));

      setModalCorreo(false);
      setNuevoCorreo("");
      Alert.alert("Éxito", "Correo actualizado.");
    } catch (err) {
      console.log("guardarCorreo err:", err);
      Alert.alert("Error", "Ese correo ya está registrado o no se pudo actualizar");
    }
  };

  // guardar password (usa AuthService.actualizarPassword)
  const guardarPassword = async () => {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(nuevaPass)) {
      return Alert.alert("Debe tener 8 caracteres, mayúscula y número");
    }
    try {
      await AuthService.actualizarPassword(currentEmail, nuevaPass);
      setModalPassword(false);
      setNuevaPass("");
      Alert.alert("Éxito", "Contraseña actualizada.");
    } catch (err) {
      console.log("guardarPassword err:", err);
      Alert.alert("Error", "No se pudo actualizar la contraseña.");
    }
  };

  // confirmar logout
  const confirmarLogout = async () => {
    try {
      await AsyncStorage.removeItem("sessionUser");
      await AsyncStorage.removeItem("userSession");
    } catch (err) {
      console.log("error removing sessionUser", err);
    }
    navigation.reset({ index: 0, routes: [{ name: "LogIn" }] });
  };

  // -------------------------
  // NOTIFICACIONES (generadas desde TransaccionesService)
  // -------------------------
  const generarNotificaciones = async () => {
    try {
      const datos = await TransaccionesService.obtenerTodos();
      if (!datos || !Array.isArray(datos)) {
        setNotificaciones([]);
        return;
      }

      const nots = [];

      // últimos 5 movimientos (más recientes)
      const ultimos = datos.slice(-5).reverse();
      ultimos.forEach((t) => {
        const sign = t.tipo === "ingreso" ? "+" : "-";
        nots.push(`${t.nombre} ${sign}$${t.monto} (${t.categoria}) - ${t.fecha}`);
      });

      // alertas automáticas: egresos grandes
      const thresholdEgreso = 1000; // configurable
      const grandes = datos.filter((t) => t.tipo === "egreso" && t.monto >= thresholdEgreso);
      grandes.slice(-3).forEach((g) => {
        nots.unshift(
          `Alerta: gasto grande de $${g.monto} en ${g.categoria} (${g.nombre}) el ${g.fecha}`
        );
      });

      // alertas automáticas: ingresos grandes
      const thresholdIngreso = 2000;
      const ingresosGrandes = datos.filter((t) => t.tipo === "ingreso" && t.monto >= thresholdIngreso);
      ingresosGrandes.slice(-2).forEach((ig) => {
        nots.unshift(`¡Ingreso importante! +$${ig.monto} (${ig.categoria}) el ${ig.fecha}`);
      });

      // resumen semanal ficticio / ejemplo (si hay suficientes registros)
      if (datos.length >= 1) {
        const sumaSemana = datos.slice(-7).reduce((acc, x) => acc + Number(x.monto || 0), 0);
        nots.push(`Resumen: últimos ${Math.min(7, datos.length)} movimientos suman $${sumaSemana.toFixed(2)}`);
      }

      setNotificaciones(nots);
    } catch (err) {
      console.log("generarNotificaciones err:", err);
      setNotificaciones([]);
    }
  };

  // Generar notificaciones cuando se abra modal de notificaciones o al montar
  useEffect(() => {
    generarNotificaciones();
  }, []);

  // -------------------------
  // UI
  // -------------------------
  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Image source={require("../assets/Images/logoo.png")} style={styles.logoTop} />
        <TouchableOpacity onPress={() => { generarNotificaciones(); setModalNotificacionesFull(true); }}>
          <Ionicons name="notifications-outline" size={24} color="#000033" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.userInfoCard}>
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={profileImage ? { uri: profileImage } : require("../assets/Images/UsuarioIcon.png")}
              style={styles.profilePic}
            />
          </TouchableOpacity>

          <Text style={styles.userName}>{nombreUsuario} {apellidoUsuario}</Text>
          <Text style={styles.userEmail}>{currentEmail}</Text>

          <TouchableOpacity style={styles.editButton} onPress={onOpenEditar}>
            <Ionicons name="create-outline" size={18} color="white" />
            <Text style={styles.editButtonText}>Editar datos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.option} onPress={() => setModalMenuCuenta(true)}>
            <Ionicons name="person-circle-outline" size={24} color="#000033" />
            <Text style={styles.optionText}>Seguridad y Cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Presupuesto")}>
            <Feather name="bar-chart-2" size={22} color="#000033" />
            <Text style={styles.optionText}>Presupuesto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("TarjetasBancos")}>
            <Feather name="credit-card" size={22} color="#000033" />
            <Text style={styles.optionText}>Tarjetas y Bancos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.option} onPress={() => setModalConfigApp(true)}>
            <Ionicons name="settings-outline" size={22} color="#000033" />
            <Text style={styles.optionText}>Configuración de App</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("PrivacidadDatos")}>
            <Feather name="shield" size={22} color="#000033" />
            <Text style={styles.optionText}>Privacidad y Datos</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logout} onPress={() => setModalLogout(true)}>
          <Ionicons name="log-out-outline" size={22} color="#000033" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ----------------- MODALES ----------------- */}

      {/* Opciones cuenta */}
      <Modal transparent visible={modalMenuCuenta} animationType="slide">
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>Opciones de Cuenta</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalMenuCuenta(false);
                onOpenEditar();
              }}
            >
              <Ionicons name="person-outline" size={20} color="#000033" />
              <Text style={styles.modalOptionText}>Cambiar Nombre</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#000033" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setModalMenuCuenta(false);
                setModalCorreo(true);
              }}
            >
              <MaterialIcons name="email" size={20} color="#000033" />
              <Text style={styles.modalOptionText}>Cambiar correo</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#000033" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalOption, { borderBottomWidth: 0 }]}
              onPress={() => {
                setModalMenuCuenta(false);
                setModalPassword(true);
              }}
            >
              <Feather name="lock" size={20} color="#000033" />
              <Text style={styles.modalOptionText}>Cambiar contraseña</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#000033" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar, styles.localBtn]}
              onPress={() => setModalMenuCuenta(false)}
            >
              <Text style={[GlobalStyles.botonCancelarTexto, styles.localCancelText]}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal cambiar nombre/apellido */}
      <Modal transparent visible={modalNombreApellido} animationType="slide">
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>Cambiar Nombre y Apellido</Text>

            <TextInput
              style={GlobalStyles.modalInput}
              placeholder="Nombre"
              value={newNombre}
              onChangeText={setNewNombre}
            />
            <TextInput
              style={GlobalStyles.modalInput}
              placeholder="Apellido"
              value={newApellido}
              onChangeText={setNewApellido}
            />

            <View style={GlobalStyles.modalBotones}>
              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar, styles.localBtn]}
                onPress={() => setModalNombreApellido(false)}
              >
                <Text style={[GlobalStyles.botonCancelarTexto, styles.localCancelText]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar, styles.localBtn]}
                onPress={guardarNombreApellido}
              >
                <Text style={[GlobalStyles.botonGuardarTexto, styles.localSaveText]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cambiar correo */}
      <Modal transparent visible={modalCorreo} animationType="slide">
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>Cambiar Correo</Text>
            <TextInput
              style={GlobalStyles.modalInput}
              placeholder="Nuevo correo"
              autoCapitalize="none"
              value={nuevoCorreo}
              onChangeText={setNuevoCorreo}
            />
            <View style={GlobalStyles.modalBotones}>
              <TouchableOpacity style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar, styles.localBtn]} onPress={() => setModalCorreo(false)}>
                <Text style={[GlobalStyles.botonCancelarTexto, styles.localCancelText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar, styles.localBtn]} onPress={guardarCorreo}>
                <Text style={[GlobalStyles.botonGuardarTexto, styles.localSaveText]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cambiar contraseña */}
      <Modal transparent visible={modalPassword} animationType="slide">
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>Cambiar Contraseña</Text>
            <TextInput secureTextEntry style={GlobalStyles.modalInput} placeholder="Nueva contraseña" value={nuevaPass} onChangeText={setNuevaPass} />
            <View style={GlobalStyles.modalBotones}>
              <TouchableOpacity style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar, styles.localBtn]} onPress={() => setModalPassword(false)}>
                <Text style={[GlobalStyles.botonCancelarTexto, styles.localCancelText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar, styles.localBtn]} onPress={guardarPassword}>
                <Text style={[GlobalStyles.botonGuardarTexto, styles.localSaveText]}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Notificaciones full screen */}
      <Modal visible={modalNotificacionesFull} transparent={false}>
        <NotificacionesScreen onClose={() => setModalNotificacionesFull(false)} notificaciones={notificaciones} />
      </Modal>

      {/* Config app */}
      <Modal transparent visible={modalConfigApp}>
        <ConfigAppModal onClose={() => setModalConfigApp(false)} notificacionesEnabled={notificacionesEnabled} setNotificacionesEnabled={setNotificacionesEnabled} />
      </Modal>

      {/* Logout confirm */}
      <Modal transparent visible={modalLogout}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>¿Seguro que deseas cerrar sesión?</Text>
            <View style={GlobalStyles.modalBotones}>
              <TouchableOpacity style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar, styles.localBtn]} onPress={() => setModalLogout(false)}>
                <Text style={[GlobalStyles.botonCancelarTexto, styles.localCancelText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar, styles.localBtn]} onPress={confirmarLogout}>
                <Text style={[GlobalStyles.botonGuardarTexto, styles.localSaveText]}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomMenu />
    </View>
  );
}

// -----------------------------
// Styles (añadí overrides locales para botones)
// -----------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scroll: { paddingBottom: 80, paddingHorizontal: 20 },

  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  logoTop: { width: 120, height: 30, resizeMode: "contain" },

  userInfoCard: {
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
  },

  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 80,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#000033",
  },

  userName: { fontSize: 20, fontWeight: "bold", color: "#000033", marginTop: 5 },
  userEmail: { fontSize: 14, color: "#777" },

  editButton: {
    marginTop: 10,
    backgroundColor: "#000033",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  editButtonText: { color: "white", fontWeight: "bold", marginLeft: 6 },

  optionsSection: {
    marginBottom: 20,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    padding: 5,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 5,
  },

  optionText: { fontSize: 16, marginLeft: 15, color: "#000033" },

  logout: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    padding: 12,
    marginTop: 10,
  },

  logoutText: {
    marginLeft: 15,
    color: "#000033",
    fontSize: 16,
    fontWeight: "bold",
  },

  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  modalOptionText: {
    flex: 1,
    fontSize: 16,
    color: "#000033",
    marginLeft: 10,
  },

  fullModal: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    borderRadius: 0,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 40,
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000033",
  },
  notificationItem: {
    fontSize: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    color: "#000033",
  },
  notificationRow: { marginBottom: 8 },

  modalOptionConfig: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  // overrides locales para asegurar visibilidad botones
  localBtn: { paddingVertical: 10, paddingHorizontal: 14 },
  localCancelText: { color: "#333", fontWeight: "600" },
  localSaveText: { color: "#fff", fontWeight: "700" },
});
