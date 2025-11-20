import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function BottomMenu() {
 const navigation = useNavigation();

 return (
 <View style={styles.bottomBar}>
 <TouchableOpacity onPress={() => navigation.navigate("Principal")}>
 <Ionicons name="home-outline" size={26} color="white" />
 </TouchableOpacity>

 <TouchableOpacity onPress={() => navigation.navigate("Registros")}>
 <Feather name="folder" size={26} color="white" />
 </TouchableOpacity>

 <TouchableOpacity onPress={() => navigation.navigate("Graficas")}>
 <Ionicons name="bar-chart-outline" size={26} color="white" />
 </TouchableOpacity>

 <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
 <FontAwesome5 name="user-circle" size={26} color="white" />
 </TouchableOpacity>
 </View>
 );
}

const styles = StyleSheet.create({
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