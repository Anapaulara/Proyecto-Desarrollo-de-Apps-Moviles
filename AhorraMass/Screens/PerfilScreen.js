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
  StatusBar,
  FlatList
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../Styles/GlobalStyles";
import AuthService from "../src/services/AuthService";
import NotificacionesService from "../src/services/NotificacionesService";

const NotificacionesScreen = ({ onClose }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get session first
    AuthService.getSession().then(u => {
      if (u) {
        setLoading(true);
        loadNotifications(u.id);
      }
    });
  }, []);

  const loadNotifications = async (uid) => {
    const data = await NotificacionesService.obtenerTodas(uid);
    setNotificaciones(data);
    setLoading(false);
  };

  const handleClear = async () => {
    const u = await AuthService.getSession();
    if (u) {
      await NotificacionesService.eliminarTodas(u.id);
      loadNotifications(u.id);
    }
  };

  const renderItem = ({ item }) => {
    let iconName = "bell";
    let iconColor = "#FFA000";

    if (item.tipo === 'warning') { iconName = "warning-outline"; iconColor = "#D32F2F"; }
    else if (item.tipo === 'success') { iconName = "checkmark-circle-outline"; iconColor = "#2E7D32"; }

    return (
      <View style={styles.notificationCard}>
        <Ionicons name={iconName} size={24} color={iconColor} style={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', color: '#1A237E' }}>{item.titulo}</Text>
          <Text style={styles.notificationText}>{item.mensaje}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={GlobalStyles.modalContenedor}>
      <View style={[GlobalStyles.modalVista, styles.fullModalFixed]}>
        <View style={styles.notificationHeader}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000033" />
          </TouchableOpacity>
          <Text style={styles.notificationTitle}>Tus Notificaciones</Text>
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="trash-outline" size={22} color="#D32F2F" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, width: '100%', paddingHorizontal: 20 }}>
          {notificaciones.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#999' }}>No tienes notificaciones nuevas.</Text>
            </View>
          ) : (
            <FlatList
              data={notificaciones}
              renderItem={renderItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
            />
          )}
        </View>

        <View style={{ padding: 20, width: '100%' }}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onClose}
          >
            <Text style={styles.primaryButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ConfigAppModal = ({ onClose, notificaciones, setNotificaciones }) => {
  return (
    <View style={GlobalStyles.modalContenedor}>
      <View style={GlobalStyles.modalVista}>
        <Text style={GlobalStyles.modalTitulo}>Configuración</Text>

        <View style={styles.configOptionContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="notifications-outline" size={22} color="#1976D2" />
            </View>
            <Text style={styles.configOptionText}>Notificaciones</Text>
          </View>
          <Switch
            value={notificaciones}
            onValueChange={setNotificaciones}
            trackColor={{ false: "#ccc", true: "#4A90E2" }}
            thumbColor={notificaciones ? "#fff" : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity
          style={styles.configOptionContainer}
          onPress={() => Alert.alert("Próximamente", "Configuración de Idioma no disponible aún.")}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
              <Feather name="globe" size={22} color="#388E3C" />
            </View>
            <Text style={styles.configOptionText}>Idioma</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, { marginTop: 20, width: '100%' }]}
          onPress={onClose}
        >
          <Text style={styles.primaryButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default function PerfilScreen() {
  const navigation = useNavigation();

  const [modalMenuCuenta, setModalMenuCuenta] = useState(false);
  const [modalNombreApellido, setModalNombreApellido] = useState(false);
  const [modalCorreo, setModalCorreo] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const [modalNotificacionesFull, setModalNotificacionesFull] = useState(false);
  const [modalConfigApp, setModalConfigApp] = useState(false);

  const [nombreUsuario, setNombreUsuario] = useState("Usuario");
  const [ApellidoUsuario, setApellidoUsuario] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");

  const [NewUsername, SetNewUsername] = useState("");
  const [NewLastname, SetNewLastname] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [nuevaPass, setNuevaPass] = useState("");

  const [notificaciones, setNotificaciones] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const u = await AuthService.getSession();
      if (u) {
        setNombreUsuario(u.nombre);
        setApellidoUsuario(u.apellido);
        setCurrentEmail(u.correo);
      }
    };
    loadSession();
  }, [modalMenuCuenta]);

  const guardarNombreApellido = () => {
    if (!NewUsername || !NewLastname) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    setNombreUsuario(NewUsername);
    setApellidoUsuario(NewLastname);
    Alert.alert("Éxito", "Nombre y apellido actualizados.");

    setModalNombreApellido(false);
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
    Alert.alert("Éxito", "Correo actualizado.");
    setNuevoCorreo("");
    setModalCorreo(false);
  };

  const guardarPassword = () => {
    Alert.alert("Éxito", "Contraseña actualizada.");
    setNuevaPass("");
    setModalPassword(false);
  };

  const confirmarLogout = async () => {
    setModalLogout(false);
    await AuthService.logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'LogIn' }],
    });
  };

  const menuOptions = [
    {
      label: "Seguridad y Cuenta",
      icon: "shield-outline",
      iconLib: Ionicons,
      color: "#5C6BC0",
      bg: "#E8EAF6",
      action: () => setModalMenuCuenta(true)
    },
    {
      label: "Presupuesto",
      icon: "pie-chart",
      iconLib: Feather,
      color: "#FFA726",
      bg: "#FFF3E0",
      action: () => navigation.navigate("PresupuestoTab")
    },
    {
      label: "Tarjetas y Bancos",
      icon: "credit-card",
      iconLib: Feather,
      color: "#29B6F6",
      bg: "#E1F5FE",
      action: () => navigation.navigate("TarjetasBancos")
    }
  ];

  const settingOptions = [
    {
      label: "Configuración de App",
      icon: "settings-outline",
      iconLib: Ionicons,
      color: "#78909C",
      bg: "#ECEFF1",
      action: () => setModalConfigApp(true)
    },
    {
      label: "Privacidad y Datos",
      icon: "lock",
      iconLib: Feather,
      color: "#8D6E63",
      bg: "#EFEBE9",
      action: () => navigation.navigate("PrivacidadDatos")
    }
  ];

  const renderOption = (item, index) => (
    <TouchableOpacity key={index} style={styles.optionRow} onPress={item.action}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.iconContainer, { backgroundColor: item.bg }]}>
          <item.iconLib name={item.icon} size={22} color={item.color} />
        </View>
        <Text style={styles.optionText}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.containerSafe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.headerBar}>
        <Image
          source={require("../assets/Images/logoo.png")}
          style={styles.logoTop}
        />
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => setModalNotificacionesFull(true)}
        >
          <Ionicons name="notifications-outline" size={26} color="#0f1530" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require("../assets/Images/UsuarioIcon.png")}
              style={styles.profilePic}
            />
          </View>
          <Text style={styles.userName}>
            {nombreUsuario} {ApellidoUsuario}
          </Text>
          <Text style={styles.userEmail}>{currentEmail}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          {menuOptions.map(renderOption)}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>General</Text>
          {settingOptions.map(renderOption)}
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setModalLogout(true)}
        >
          <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={modalMenuCuenta} onRequestClose={() => setModalMenuCuenta(false)}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>Opciones de Cuenta</Text>
            {/* ... simplified for brevity, logic remains same */}
            <TouchableOpacity style={styles.modalMenuOption} onPress={() => { setModalMenuCuenta(false); setModalNombreApellido(true); }}>
              <View style={[styles.iconContainerSm, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="person-outline" size={18} color="#1976D2" />
              </View>
              <Text style={styles.modalMenuText}>Cambiar Nombre y Apellido</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalMenuOption} onPress={() => { setModalMenuCuenta(false); setModalCorreo(true); }}>
              <View style={[styles.iconContainerSm, { backgroundColor: '#E0F2F1' }]}>
                <MaterialIcons name="email" size={18} color="#00796B" />
              </View>
              <Text style={styles.modalMenuText}>Cambiar correo</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalMenuOption} onPress={() => { setModalMenuCuenta(false); setModalPassword(true); }}>
              <View style={[styles.iconContainerSm, { backgroundColor: '#FBE9E7' }]}>
                <Feather name="lock" size={18} color="#D84315" />
              </View>
              <Text style={styles.modalMenuText}>Cambiar contraseña</Text>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, { marginTop: 25, width: '100%' }]}
              onPress={() => setModalMenuCuenta(false)}
            >
              <Text style={styles.cancelButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalNombreApellido} onRequestClose={() => setModalNombreApellido(false)}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>Editar Nombre</Text>
            <TextInput style={GlobalStyles.modalInput} placeholder="Nombre" value={NewUsername} onChangeText={SetNewUsername} />
            <TextInput style={GlobalStyles.modalInput} placeholder="Apellido" value={NewLastname} onChangeText={SetNewLastname} />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalNombreApellido(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={guardarNombreApellido}>
                <Text style={styles.primaryButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalCorreo} onRequestClose={() => setModalCorreo(false)}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>Editar Correo</Text>
            <TextInput style={GlobalStyles.modalInput} placeholder="Nuevo correo" value={nuevoCorreo} onChangeText={setNuevoCorreo} keyboardType="email-address" autoCapitalize="none" />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalCorreo(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={guardarCorreo}>
                <Text style={styles.primaryButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalPassword} onRequestClose={() => setModalPassword(false)}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>Cambiar Contraseña</Text>
            <TextInput secureTextEntry style={GlobalStyles.modalInput} placeholder="Nueva contraseña" value={nuevaPass} onChangeText={setNuevaPass} />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalPassword(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={guardarPassword}>
                <Text style={styles.primaryButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={modalLogout} onRequestClose={() => setModalLogout(false)}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>¿Cerrar Sesión?</Text>
            <Text style={{ marginBottom: 20, color: '#666', textAlign: 'center' }}>¿Estás seguro que deseas salir de tu cuenta?</Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalLogout(false)}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: '#D32F2F' }]} onPress={confirmarLogout}>
                <Text style={styles.primaryButtonText}>Salir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={false} visible={modalNotificacionesFull} onRequestClose={() => setModalNotificacionesFull(false)}>
        <NotificacionesScreen onClose={() => setModalNotificacionesFull(false)} />
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalConfigApp} onRequestClose={() => setModalConfigApp(false)}>
        <ConfigAppModal onClose={() => setModalConfigApp(false)} notificaciones={notificaciones} setNotificaciones={setNotificaciones} />
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  containerSafe: { flex: 1, backgroundColor: "#F8F9FA", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 }
  },
  logoTop: { width: 110, height: 28, resizeMode: "contain" },
  scroll: { paddingBottom: 100 },

  profileCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 20,
    padding: 25,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8
  },
  profileImageContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 15
  },
  profilePic: { width: 90, height: 90, borderRadius: 45 },
  userName: { fontSize: 22, fontWeight: "bold", color: "#1A237E", marginBottom: 5 },
  userEmail: { fontSize: 16, color: "#757575" },

  sectionContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9E9E9E',
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  optionText: { fontSize: 16, marginLeft: 15, color: "#37474F", fontWeight: '500' },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerSm: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2'
  },
  logoutText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 16, marginLeft: 10 },

  modalButtonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2979FF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2
  },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  cancelButtonText: { color: '#616161', fontWeight: 'bold', fontSize: 16 },

  modalMenuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    justifyContent: 'space-between'
  },
  modalMenuText: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
    marginLeft: 15,
    fontWeight: '500'
  },

  fullModalFixed: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    alignItems: 'flex-start',
    padding: 0
  },
  notificationHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff'
  },
  notificationTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A237E' },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2979FF',
    elevation: 1,
    width: '100%'
  },
  notificationText: { flex: 1, fontSize: 14, color: '#424242', marginTop: 2 },

  configOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  configOptionText: { fontSize: 16, color: '#333', marginLeft: 15, fontWeight: '500' },
});