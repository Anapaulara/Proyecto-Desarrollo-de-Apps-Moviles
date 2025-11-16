import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Alert, TextInput } from "react-native";
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from "@expo/vector-icons";
import GlobalStyles from '../Styles/GlobalStyles';
import LogInScreen from "./LogInScreen";
import PresupuestoScreen from "./PresupuestoScreen";

export default function PerfilScreen() {
  const [cerrarSesion, setCerrarSesion] = useState(false);
  const [presupuesto, setpresupuesto] = useState(false);
  const [editarPerfil, setEditarPerfil] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("Paulina");
  const [ApellidoUsuario, setApellidoUsuario] = useState("Lara");
  const [NewUsername, SetNewUsername] = useState('');
  const [NewLastname, SetNewLastname] = useState('');

  const botonGuardar = () => {
  if (!NewUsername) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
  }

  if (NewUsername === nombreUsuario) {
      Alert.alert('Error', 'El nuevo nombre debe ser diferente al actual');
      return;
  }

  if (NewUsername.length < 3 || NewUsername.length > 20) {
      Alert.alert('Error', 'El nombre de usuario debe tener al menos 3 caracteres y máximo 20');
      return;
  }

  setApellidoUsuario(NewLastname);
  setNombreUsuario(NewUsername);
  setEditarPerfil(false);
  SetNewUsername('');
  SetNewLastname('')
};
    const botonCerrar = () => {setEditarPerfil(false); SetNewUsername('');};

  if (cerrarSesion) {
    return <LogInScreen />;
  }
  if (presupuesto) {
    return <PresupuestoScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Image source={require("../assets/Images/logoo.png")} style={styles.logo} />
          <View style={styles.userInfo}>
            <Image
              source={require("../assets/Images/UsuarioIcon.png")}
              style={styles.profilePic}
            />
            <Text style={styles.userName}>{nombreUsuario} {ApellidoUsuario}</Text>
            <Text style={styles.userEmail}>correoprueba@gmail.com</Text>
          </View>
        </View>

        <View style={styles.options}>
          <TouchableOpacity style={styles.option} onPress={() => setEditarPerfil(true)}>
            <Ionicons name="person-outline" size={22} color="#000033" />
            <Text style={styles.optionText}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option} onPress={() => setpresupuesto(true)}>
            <Feather name="upload" size={22} color="#000033" />
            <Text style={styles.optionText}>Presupuesto</Text>

          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <MaterialIcons name="email" size={22} color="#000033" />
            <Text style={styles.optionText}>Cambiar correo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Feather name="lock" size={22} color="#000033" />
            <Text style={styles.optionText}>Cambiar contraseña</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
            <Ionicons name="notifications-outline" size={22} color="#000033" />
            <Text style={styles.optionText}>Notificaciones</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logout} onPress={() => setCerrarSesion(true)}>
          <Ionicons name="log-out-outline" size={22} color="#000033" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={editarPerfil} onRequestClose={botonCerrar}>
              
              <View style={GlobalStyles.modalContenedor}>
                
                <View style={GlobalStyles.modalVista}>
                  
                  <Text style={GlobalStyles.modalTitulo}>Cambiar nombre de usuario</Text>
      
                  <TextInput style={GlobalStyles.modalInput} placeholder="Nombre" placeholderTextColor="#888" value={NewUsername} onChangeText= {SetNewUsername}/>
      
                  <TextInput style={GlobalStyles.modalInput} placeholder="Apellido/s" placeholderTextColor="#888" value={NewLastname} onChangeText= {SetNewLastname}/>

                  <View style={GlobalStyles.modalBotones}>
                    
                    <TouchableOpacity style={[GlobalStyles.botonBase, GlobalStyles.botonCancelar]} onPress={botonCerrar}>
                      <Text style={GlobalStyles.botonCancelarTexto}>Cancelar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={[GlobalStyles.botonBase, GlobalStyles.botonGuardar]} onPress={botonGuardar}>
                      <Text style={GlobalStyles.botonGuardarTexto}>Guardar</Text>
                    </TouchableOpacity>
      
                  </View>
      
                </View>
      
              </View>
      
            </Modal>

      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="folder" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="time-outline" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="user-circle" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scroll: {
    paddingBottom: 80,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  logo: {
    width: 140,
    height: 40,
    resizeMode: "contain",
    marginBottom: 10,
  },
  userInfo: {
    alignItems: "center",
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000033",
  },
  userEmail: {
    fontSize: 13,
    color: "#777",
  },
  options: {
    padding: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 15,
    marginLeft: 10,
    color: "#000033",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  logoutText: {
    marginLeft: 10,
    color: "#000033",
    fontSize: 15,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000033",
    width: "100%",
    paddingVertical: 10,
  },
});
