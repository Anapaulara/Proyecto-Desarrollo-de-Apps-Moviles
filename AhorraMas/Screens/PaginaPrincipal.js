import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function PaginaPrincipal() {
  return (

    <View style={styles.container}>


      <Text>Próximamente Página Principal</Text>

      <View style={styles.pie}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('¡Botón Casa!')}
        >
          <Image
            source={require('../assets/Images/HouseIcon.png')} // usa require directo
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('¡Botón Registro!')}
        >
          <Image
            source={require('../assets/Images/RegistroIcon.png')} // usa require directo
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('¡Botón Graficas!')}
        >
          <Image
            source={require('../assets/Images/GraficaIcon.png')} // usa require directo
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('¡Botón Perfil!')}
        >
          <Image
            source={require('../assets/Images/UsuarioIcon.png')} // usa require directo
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pie: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    backgroundColor: '#82B6ED',
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#3835d8ff',
    padding: 10,
    borderRadius: 10,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
