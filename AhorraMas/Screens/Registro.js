import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, Platform } from 'react-native';

const logo = require('../assets/Images/logoo.png');

export default function RegistroAhorraApp() {
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
    mostrarAlerta('Registro exitoso', `Bienvenido/a ${nombre} ${apellido} 🎉`);
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
});
