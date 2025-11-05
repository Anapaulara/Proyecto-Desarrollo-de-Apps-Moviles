import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Logo from '../assets/Recursos/logo.png';

export default function RegistrosScreen({ cambiarPantalla }) {
  const [registros, setRegistros] = useState([
    { id: 1, categoria: 'Alimentos', icon: 'shopping-cart', monto: -2500, nota: 'Lorem ipsum' },
    { id: 2, categoria: 'Entretenimiento', icon: 'play-circle', monto: 500, nota: 'Lorem ipsum' },
    { id: 3, categoria: 'Salud', icon: 'heart', monto: -1500, nota: 'Lorem ipsum' },
    { id: 4, categoria: 'Entretenimiento', icon: 'play-circle', monto: 500, nota: 'Lorem ipsum' },
  ]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => cambiarPantalla('Principal')}>
          <Ionicons name="arrow-back" size={26} color="#001A72" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logoImage} />
          <Text style={styles.logoText}>Ahorra</Text>
          <Text style={styles.logoPlus}>+</Text>
          <Text style={styles.logoSub}> App</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="#001A72" />
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>Registros</Text>

      {/* Lista */}
      <View style={styles.listaContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {registros.map((item) => (
            <View key={item.id} style={styles.item}>
              <FontAwesome5
                name={item.icon}
                size={20}
                color="#001A72"
                style={{ marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitulo}>{item.categoria}</Text>
                <Text style={styles.itemSub}>{item.nota}</Text>
              </View>
              <Text
                style={[
                  styles.monto,
                  { color: item.monto < 0 ? '#b30000' : 'green' },
                ]}
              >
                {item.monto < 0 ? `-$${Math.abs(item.monto)}` : `+$${item.monto}`}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Botón + */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>

      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => cambiarPantalla('Principal')}>
          <Ionicons name="home-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => cambiarPantalla('Presupuesto')}>
          <Ionicons name="folder-open-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="time-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => cambiarPantalla('Graficas')}>
          <Ionicons name="person-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 50,
  },

  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 32, height: 32, resizeMode: 'contain', marginRight: 6 },
  logoText: { fontSize: 22, fontWeight: 'bold', color: '#002060' },
  logoPlus: { fontSize: 22, fontWeight: 'bold', color: '#00A3FF' },
  logoSub: { fontSize: 16, color: '#00A3FF' },

  titulo: {
    fontSize: 26,
    color: '#001A72',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 10,
  },

  listaContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    marginHorizontal: 15,
    padding: 12,
    flex: 1,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    borderRadius: 25,
    padding: 14,
    marginBottom: 10,
  },

  itemTitulo: { fontSize: 17, fontWeight: '600', color: '#001A72' },
  itemSub: { color: '#555' },
  monto: { fontSize: 18, fontWeight: 'bold' },

  addButton: {
    backgroundColor: '#001A72',
    width: '90%',
    height: 60,
    borderRadius: 25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  addText: { fontSize: 32, color: '#fff', fontWeight: 'bold' },

  navbar: {
    backgroundColor: '#001A72',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
