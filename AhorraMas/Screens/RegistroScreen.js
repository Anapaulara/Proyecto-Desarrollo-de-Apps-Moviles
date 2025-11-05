import React, { useState } from "react";
import { Alert } from "react-native";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function RegistroScreen() {
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Encabezado */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={28} color="#0f1530" />
        <Text style={styles.logoText}>Ahorr<Text style={{ color: '#2A7CF7' }}>a+</Text> App</Text>
      </View>

      <Text style={styles.title}>Formulario de Registro{"\n"}Datos</Text>

      {/* Campo Monto */}
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Monto</Text>
        <TextInput
          style={styles.inputText}
          placeholder="00.00"
          placeholderTextColor="#7A7A7A"
          keyboardType="numeric"
          value={monto}
          onChangeText={setMonto}
        />
      </View>

      {/* Tipo */}
      <View style={styles.row}>
        <View style={styles.radio}>
          <MaterialIcons name="radio-button-unchecked" size={20} color="#0f1530" />
          <Text style={styles.radioText}>Ingreso</Text>
        </View>

        <View style={styles.radio}>
          <MaterialIcons name="radio-button-unchecked" size={20} color="#0f1530" />
          <Text style={styles.radioText}>Gasto</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>Categoría</Text>

      <View style={styles.categoryBox}>
        <Text style={styles.category}>● Alimentos</Text>
        <Text style={styles.category}>● Salud</Text>
        <Text style={styles.category}>● Entretenimiento</Text>
      </View>

      <TextInput
        style={styles.inputLarge}
        placeholder="Descripción"
        placeholderTextColor="#7A7A7A"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.inputSmall}
        placeholder="DD/MM/AAAA"
        placeholderTextColor="#7A7A7A"
        value={fecha}
        onChangeText={setFecha}
      />

      {/* Botones */}
      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn} onPress={() => Alert.alert("Guardado")}>
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: "#FFFFFF", 
    padding: 20 },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 10, 
    columnGap: 10 },
  logoText: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#0f1530" },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginVertical: 10 },
  inputRow: {
    backgroundColor: "#ECECEC",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  inputLabel: { 
    fontSize: 18 },
  inputText: { 
    fontSize: 18, 
    textAlign: "right", 
    width: 100 },
  row: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 10 },
  radio: { 
    flexDirection: "row", 
    alignItems: "center" },
  radioText: { 
    fontSize: 17, 
    marginLeft: 6 },
  subtitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 5 },
  categoryBox: { 
    backgroundColor: "#C9D7F5", 
    padding: 10, 
    borderRadius: 10, 
    marginBottom: 10 },
  category: { 
    fontSize: 17, 
    marginVertical: 3 },
  inputLarge: { 
    backgroundColor: "#ECECEC", 
    borderRadius: 10, 
    padding: 12, 
    height: 80, 
    marginBottom: 10 },
  inputSmall: { 
    backgroundColor: "#ECECEC", 
    borderRadius: 10, 
    padding: 12, 
    textAlign: "center", 
    fontSize: 16 },
  rowButtons: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 20 },
  cancelBtn: { 
    backgroundColor: "#A09E9E", 
    padding: 14, 
    borderRadius: 15, 
    width: "45%" },
  cancelText: { 
    textAlign: "center", 
    color: "#FFFFFF", 
    fontWeight: "bold", 
    fontSize: 18 },
  saveBtn: { 
    backgroundColor: "#091E63", 
    padding: 14, 
    borderRadius: 15, 
    width: "45%" },
  saveText: { textAlign: "center",
    color: "#FFFFFF",
    fontWeight: "bold", 
    fontSize: 18 },
});
