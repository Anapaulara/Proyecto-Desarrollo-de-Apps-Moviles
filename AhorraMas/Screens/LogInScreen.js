import React, { useState } from 'react';
import { Pressable , View, Text, StyleSheet, TextInput, Switch, Button, Alert } from 'react-native';
import PrincipalScreen from './PrincipalScreen';
import RegistroAhorraApp from './RegistroScreen';


export default function LoginScreen() {
  const [contrasena, setContrasena] = useState('');
  const [mail, setMail] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [mostrarPrincipal, setMostrarPrincipal] = useState(false);

  const mostrarAlerta = () => {
    if (mail.trim() === '' || contrasena.trim() === '') {
      Alert.alert("Error", "Por favor, ingresa todos los campos correctamente.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(mail)) {
      Alert.alert("Error", "Por favor, ingresa un correo electrónico válido.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(contrasena)) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
      return;
    }

    if (!aceptaTerminos) {
      Alert.alert("Error", "Debes aceptar los términos y condiciones.");
      return;
    }

    setMostrarPrincipal(true);
  };

  if (mostrarPrincipal) {
    return <PrincipalScreen />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ahorra+</Text>

      <View style={styles.mainOverlay}>
        <Text style={styles.welcome}>Bienvenido a Ahorra+!</Text>
        <Text style={styles.splashTitle}>Inicio de sesión</Text>

        <Text style={styles.splashSubtitle}>Correo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Gmail"
          placeholderTextColor="#bbb"
          value={mail}
          onChangeText={setMail}
          keyboardType="email-address"
        />

        <Text style={styles.splashSubtitle}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
        />

        <View style={styles.switchRow}>
          <Text style={styles.splashSubtitle}>Acepto los términos y condiciones</Text>
          <Switch
            onValueChange={setAceptaTerminos}
            value={aceptaTerminos}
          />
        </View>
      </View>

      <View style={styles.button}>
      <Button title="Iniciar sesión" onPress={mostrarAlerta} color='#0f1344'/>
        </View>

        <Pressable
            onPress={() => alert('¡Recuperar Contraseña!')}
            style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1, }, ]} >
  <Text style={{ color: 'blue',  fontSize: 18, padding: 10, }}>
    No recuerdas tu contraseña?
  </Text>
</Pressable>

      <View style={styles.switchRow}>
          <Text style={styles.splashSubtitle}>No tienes una cuenta?</Text>
          <Button title="Registrate" color='#1a26aaff'/>
        </View>

      <View style={styles.pie}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  pie: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    backgroundColor: '#0f1344',
    width: '100%',
    padding: 35,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  titulo: {
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: 40,
    color: '#0f1344',
  },
  mainOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(47, 127, 255, 0.26)',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    marginTop: 30,
    marginBottom: 30,
  },
  welcome: {
    color: '#000',
    fontSize: 22,
    marginBottom: 20,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-evenly',
    width: '100%',
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    width: '80%',
    padding: 10,
    marginBottom: 15,
    color: '#000',
  },
  splashTitle: {
    color: '#000',
    fontSize: 26,
    fontWeight: '700',
  },
  splashSubtitle: {
    color: '#333',
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 8,
  },
});
