<<<<<<< HEAD
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, Platform } from 'react-native';

const logo = require('../assets/Images/logoo.png');

export default function RegistroScreen() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [año, setAño] = useState('');
  const [genero, setGenero] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const mostrarAlerta = (titulo, mensaje) => {
    if (Platform.OS === 'web') {
      alert(`${titulo}\n\n${mensaje}`);
    } else {
      Alert.alert(titulo, mensaje);
    }
  };

  const registrar = () => {
    if (!nombre || !apellido || !dia || !mes || !año || !genero || !correo || !password) {
      mostrarAlerta('Error', 'Por favor, completa todos los campos.');
      return;
    }
    mostrarAlerta('Registro exitoso', `Bienvenido/a ${nombre} ${apellido} `);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.titulo}>Registrarte</Text>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 5 }]}
            placeholder="Nombre"
            placeholderTextColor="#666"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 5 }]}
            placeholder="Apellido"
            placeholderTextColor="#666"
            value={apellido}
            onChangeText={setApellido}
          />
        </View>

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.inputFecha, { marginRight: 5 }]}
            placeholder="DD"
            keyboardType="numeric"
            maxLength={2}
            value={dia}
            onChangeText={setDia}
          />
          <TextInput
            style={[styles.inputFecha, { marginRight: 5 }]}
            placeholder="MM"
            keyboardType="numeric"
            maxLength={2}
            value={mes}
            onChangeText={setMes}
          />
          <TextInput
            style={styles.inputFecha}
            placeholder="AAAA"
            keyboardType="numeric"
            maxLength={4}
            value={año}
            onChangeText={setAño}
          />
        </View>

        <Text style={styles.label}>Género</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.botonGenero, genero === 'Mujer' && styles.generoActivo]}
            onPress={() => setGenero('Mujer')}
          >
            <Text style={styles.textoGenero}>Mujer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.botonGenero, genero === 'Hombre' && styles.generoActivo]}
            onPress={() => setGenero('Hombre')}
          >
            <Text style={styles.textoGenero}>Hombre</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#666"
          keyboardType="email-address"
          value={correo}
          onChangeText={setCorreo}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.boton} onPress={registrar}>
          <Text style={styles.textoBoton}>Registrarte</Text>
        </TouchableOpacity>

        <Text style={styles.textoFinal}>¿Ya tienes una cuenta?</Text>
      </View>
=======
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

>>>>>>> 2c788780edf3722035628bf7c6dffa1f255d0916
    </ScrollView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 25,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '600',
    color: '#0C1B4D',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F2F2F2',
    width: '100%',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  inputFecha: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  label: {
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: '500',
    color: '#0C1B4D',
  },
  botonGenero: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  generoActivo: {
    backgroundColor: '#0C1B4D',
  },
  textoGenero: {
    color: '#0C1B4D',
    fontSize: 16,
  },
  boton: {
    backgroundColor: '#0C1B4D',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textoFinal: {
    color: '#0C1B4D',
    marginTop: 15,
    fontSize: 14,
  },
}
);
=======
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
>>>>>>> 2c788780edf3722035628bf7c6dffa1f255d0916
