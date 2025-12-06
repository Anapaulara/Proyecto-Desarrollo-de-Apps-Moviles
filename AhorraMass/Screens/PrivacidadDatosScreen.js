import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import GlobalStyles from "../Styles/GlobalStyles";
// BottomMenu import removed


const PrivacidadDatosScreen = () => {
  const navigation = useNavigation();

  const [biometriaActiva, setBiometriaActiva] = useState(false);
  const [compartirDatos, setCompartirDatos] = useState(true);
  const [almacenamientoLocal, setAlmacenamientoLocal] = useState(true);

  const toggleBiometria = () => setBiometriaActiva(previousState => !previousState);
  const toggleCompartirDatos = () => setCompartirDatos(previousState => !previousState);
  const toggleAlmacenamientoLocal = () => setAlmacenamientoLocal(previousState => !previousState);

  const SettingItem = ({ icon, text, onPress, isToggle = false, value, onValueChange }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={!isToggle ? onPress : undefined}
      disabled={isToggle}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={icon} size={24} color="#000033" style={{ marginRight: 15 }} />
        <Text style={styles.settingText}>{text}</Text>
      </View>

      {isToggle ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#ccc", true: "#4A90E2" }}
          thumbColor={value ? "#000033" : "#f4f3f4"}
        />
      ) : (
        <Ionicons name="chevron-forward-outline" size={24} color="#000033" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000033" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidad y Datos</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} alwaysBounceVertical={false} >

        <Text style={styles.sectionTitle}>Seguridad de la Cuenta</Text>
        <View style={styles.sectionContainer}>
          <SettingItem
            icon="finger-print-outline"
            text="Habilitar Acceso por Biometría"
            isToggle
            value={biometriaActiva}
            onValueChange={toggleBiometria}
          />
          <SettingItem
            icon="lock-closed-outline"
            text="Ver Política de Seguridad"
            onPress={() => Alert.alert("Información", "Abriendo política de seguridad...")}
          />
        </View>

        <Text style={styles.sectionTitle}>Gestión de Datos</Text>
        <View style={styles.sectionContainer}>
          <SettingItem
            icon="swap-horizontal-outline"
            text="Permitir compartir datos anónimos"
            isToggle
            value={compartirDatos}
            onValueChange={toggleCompartirDatos}
          />
          <SettingItem
            icon="cloud-offline-outline"
            text="Modo de Almacenamiento Local"
            isToggle
            value={almacenamientoLocal}
            onValueChange={toggleAlmacenamientoLocal}
          />
          <SettingItem
            icon="download-outline"
            text="Descargar mi historial de datos"
            onPress={() => Alert.alert("Proceso", "Generando archivo CSV...")}
          />
          <SettingItem
            icon="trash-outline"
            text="Eliminar mi cuenta y datos"
            onPress={() => Alert.alert("Advertencia", "Esta acción es irreversible.")}
          />
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* BottomMenu removed */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000033',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 265,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000033',
    marginTop: 15,
    marginBottom: 10,
  },
  sectionContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 15,
    paddingHorizontal: 15,
  },

  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingText: {
    fontSize: 16,
    color: '#000033',
    flex: 1,
  },
});

export default PrivacidadDatosScreen;