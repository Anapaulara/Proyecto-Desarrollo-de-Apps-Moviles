import React, { useState } from "react";
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
} from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../Styles/GlobalStyles";
import BottomMenu from "./BottomMenu";

const NotificacionesScreen = ({ onClose }) => {
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
          <Text style={styles.notificationItem}>
            <Feather name="bell" size={16} color="#000033" /> ¡Felicidades! Lograste tu objetivo de ahorro de Diciembre.
          </Text>
          <Text style={styles.notificationItem}>
            <Ionicons name="warning-outline" size={16} color="#B80000" /> Tu presupuesto de **comida** ha llegado al 80%.
          </Text>
          <Text style={styles.notificationItem}>
            <Ionicons name="stats-chart-outline" size={16} color="#000033" /> Nuevo resumen mensual de gastos disponible.
          </Text>
          <Text style={styles.notificationItem}>
            <Feather name="credit-card" size={16} color="#000033" /> Se cargó el pago automático de tu tarjeta de crédito.
          </Text>
          <View style={{ height: 50 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const ConfigAppModal = ({ onClose, notificaciones, setNotificaciones }) => {
    return (
        <View style={GlobalStyles.modalContenedor}>
            <View style={GlobalStyles.modalVista}>
                <Text style={GlobalStyles.modalTitulo}>Configuración de App</Text>
                
                <View style={styles.modalOptionConfig}>
                    <Ionicons name="notifications-outline" size={22} color="#000033" />
                    <Text style={styles.modalOptionText}>Activar notificaciones</Text>
                    <Switch 
                        value={notificaciones} 
                        onValueChange={setNotificaciones} 
                        trackColor={{ false: "#ccc", true: "#4A90E2" }}
                        thumbColor={notificaciones ? "#000033" : "#f4f3f4"}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.modalOptionConfig, { borderBottomWidth: 0 }]}
                    onPress={() => Alert.alert("Función futura", "Configuración de Idioma")}
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


export default function PerfilScreen() {
  const navigation = useNavigation();

  const [modalMenuCuenta, setModalMenuCuenta] = useState(false); 
  const [modalNombreApellido, setModalNombreApellido] = useState(false);
  const [modalCorreo, setModalCorreo] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const [modalNotificacionesFull, setModalNotificacionesFull] = useState(false);
  const [modalConfigApp, setModalConfigApp] = useState(false);


  const [nombreUsuario, setNombreUsuario] = useState("Paulina");
  const [ApellidoUsuario, setApellidoUsuario] = useState("Lara");
  const [currentEmail, setCurrentEmail] = useState("correoprueba@gmail.com");

  const [NewUsername, SetNewUsername] = useState("");
  const [NewLastname, SetNewLastname] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [nuevaPass, setNuevaPass] = useState("");
  
  const [notificaciones, setNotificaciones] = useState(true); 

  const guardarNombreApellido = () => {
    if (!NewUsername || !NewLastname) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (NewUsername === nombreUsuario && NewLastname === ApellidoUsuario) {
      Alert.alert("Error", "Los datos deben ser diferentes a los actuales");
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
    if (nuevoCorreo === currentEmail) {
        Alert.alert("Error", "El correo debe ser diferente al actual.");
        return;
    }
    
    setCurrentEmail(nuevoCorreo);
    Alert.alert("Éxito", "Correo actualizado.");
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

    Alert.alert("Éxito", "Contraseña actualizada (Simulado el guardado).");
    setNuevaPass("");
    setModalPassword(false);
  };

  const confirmarLogout = () => {
    setModalLogout(false);
    Alert.alert("Cerrar Sesión", "Navegando a LogIn simuladamente");
  };

  const goToPresupuesto = () => navigation.navigate("Presupuesto");
  const goToTarjetas = () => navigation.navigate("TarjetasBancos"); 
  const goToSeguridad = () => navigation.navigate("PrivacidadDatos");


  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Image
          source={require("../assets/Images/logoo.png")}
          style={styles.logoTop}
        />
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => setModalNotificacionesFull(true)}
        >
          <Ionicons name="notifications-outline" size={24} color="#000033" />
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.userInfoCard}>
            <Image
            source={require("../assets/Images/UsuarioIcon.png")}
            style={styles.profilePic}
            />

            <Text style={styles.userName}>
            {nombreUsuario} {ApellidoUsuario}
            </Text>
            <Text style={styles.userEmail}>{currentEmail}</Text>
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => setModalMenuCuenta(true)}
          >
            <Ionicons name="person-circle-outline" size={24} color="#000033" />
            <Text style={styles.optionText}>Seguridad y Cuenta</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.option}
            onPress={goToPresupuesto}
          >
            <Feather name="bar-chart-2" size={22} color="#000033" />
            <Text style={styles.optionText}>Presupuesto</Text>
          </TouchableOpacity>
          
           <TouchableOpacity
            style={styles.option}
            onPress={goToTarjetas}
          >
            <Feather name="credit-card" size={22} color="#000033" />
            <Text style={styles.optionText}>Tarjetas y Bancos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => setModalConfigApp(true)}
          >
            <Ionicons name="settings-outline" size={22} color="#000033" />
            <Text style={styles.optionText}>Configuración de App</Text>
          </TouchableOpacity>
          
           <TouchableOpacity
            style={styles.option}
            onPress={goToSeguridad}
          >
            <Feather name="shield" size={22} color="#000033" />
            <Text style={styles.optionText}>Privacidad y Datos</Text>
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

      <Modal animationType="slide" transparent={true} visible={modalMenuCuenta} onRequestClose={() => setModalMenuCuenta(false)}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>
              Opciones de Cuenta
            </Text>
            
            <TouchableOpacity style={styles.modalOption} onPress={() => { setModalMenuCuenta(false); setModalNombreApellido(true); }}>
                <Ionicons name="person-outline" size={20} color="#000033" />
                <Text style={styles.modalOptionText}>Cambiar Nombre y Apellido</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#000033" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={() => { setModalMenuCuenta(false); setModalCorreo(true); }}>
                <MaterialIcons name="email" size={20} color="#000033" />
                <Text style={styles.modalOptionText}>Cambiar correo</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#000033" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalOption, { borderBottomWidth: 0 }]} onPress={() => { setModalMenuCuenta(false); setModalPassword(true); }}>
                <Feather name="lock" size={20} color="#000033" />
                <Text style={styles.modalOptionText}>Cambiar contraseña</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#000033" />
            </TouchableOpacity>
            

            <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar, { marginTop: 20 }]}
                onPress={() => setModalMenuCuenta(false)}
            >
                <Text style={GlobalStyles.botonCancelarTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalNombreApellido} onRequestClose={() => setModalNombreApellido(false)}>
        <View style={GlobalStyles.modalContenedor}>
          <View style={GlobalStyles.modalVista}>
            <Text style={GlobalStyles.modalTitulo}>
              Cambiar Nombre y Apellido
            </Text>

            <TextInput
              style={GlobalStyles.modalInput}
              placeholder="Nuevo Nombre"
              placeholderTextColor="#888"
              value={NewUsername}
              onChangeText={SetNewUsername}
            />

            <TextInput
              style={GlobalStyles.modalInput}
              placeholder="Nuevo Apellido/s"
              placeholderTextColor="#888"
              value={NewLastname}
              onChangeText={SetNewLastname}
            />

            <View style={GlobalStyles.modalBotones}>
              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar]}
                onPress={() => setModalNombreApellido(false)}
              >
                <Text style={GlobalStyles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar]}
                onPress={guardarNombreApellido}
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

      <Modal animationType="slide" transparent={false} visible={modalNotificacionesFull} onRequestClose={() => setModalNotificacionesFull(false)}>
        <NotificacionesScreen onClose={() => setModalNotificacionesFull(false)} />
      </Modal>
      
      <Modal animationType="slide" transparent={true} visible={modalConfigApp} onRequestClose={() => setModalConfigApp(false)}>
        <ConfigAppModal 
            onClose={() => setModalConfigApp(false)}
            notificaciones={notificaciones}
            setNotificaciones={setNotificaciones}
        />
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
  scroll: { paddingBottom: 80, paddingHorizontal: 20 },
  
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  logoTop: { width: 120, height: 30, resizeMode: "contain" },
  notificationButton: {
    padding: 5,
  },

  userInfoCard: { 
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    padding: 20,
    marginVertical: 15,
  },
  profilePic: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  userName: { fontSize: 18, fontWeight: "bold", color: "#000033" },
  userEmail: { fontSize: 14, color: "#777" },

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
  logoutText: { marginLeft: 15, color: "#000033", fontSize: 16, fontWeight: 'bold' },

  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalOptionText: { 
      fontSize: 16, 
      color: "#000033", 
      flex: 1, 
      marginLeft: 10 
  },

  fullModal: { 
      height: '100%', 
      width: '100%', 
      position: 'absolute', 
      top: 0, 
      borderRadius: 0,
      padding: 0 
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  notificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000033',
  },
  notificationItem: {
    fontSize: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    color: '#000033',
  },
  
  modalOptionConfig: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 10
  },
});