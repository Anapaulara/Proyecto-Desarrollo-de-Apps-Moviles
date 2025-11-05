import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from "@expo/vector-icons";

export default function PrincipalScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image source={require("../assets/Images/logoo.png")} style={styles.logo} />
          <View style={styles.userInfo}>
            <Image
              source={require("../assets/Images/UsuarioIcon.png")}
              style={styles.profilePic}
            />
            <Text style={styles.userName}>Ivan Isay Guerra Lopez</Text>
            <Text style={styles.userEmail}>Ivan_Isay@upq.edu.mx</Text>
          </View>
        </View>
 
        {/* Opciones */}
        <View style={styles.options}>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="person-outline" size={22} color="#000033" />
            <Text style={styles.optionText}>Editar perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.option}>
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

        {/* Cerrar sesión */}
        <TouchableOpacity style={styles.logout}>
          <Ionicons name="log-out-outline" size={22} color="#000033" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Barra inferior */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={26} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="folder" size={26} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="time-outline" size={26} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="user-circle" size={26} color="black" />
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
