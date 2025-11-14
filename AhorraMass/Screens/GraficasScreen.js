import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';


const screenWidth = Dimensions.get('window').width;

export default function GraficasScreen() {
  const data = [
    { name: 'Saldo disponible', population: 70, color: '#00A3FF', legendFontColor: '#001A72', legendFontSize: 14 },
    { name: 'Alimentos', population: 16, color: '#4db5ff', legendFontColor: '#001A72', legendFontSize: 14 },
    { name: 'Entretenimiento', population: 3, color: '#88c7ff', legendFontColor: '#001A72', legendFontSize: 14 },
    { name: 'Salud', population: 10, color: '#a7dbff', legendFontColor: '#001A72', legendFontSize: 14 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => cambiarPantalla('Registro')}>
          <Ionicons name="arrow-back" size={26} color="#001A72" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logoImage} />
          <Text style={styles.logoText}>Ahorra</Text>
          <Text style={styles.logoPlus}>+</Text>
          <Text style={styles.logoSub}> App</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="settings-sharp" size={24} color="#001A72" />
        </TouchableOpacity>
      </View>

      {/* Gráfica */}
      <PieChart
        data={data}
        width={screenWidth}
        height={230}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(0, 26, 114, ${opacity})`,
        }}
        accessor={'population'}
        backgroundColor={'transparent'}
        paddingLeft={'0'}
        center={[0, 0]}
        absolute
      />

      {/* Leyenda */}
      <View style={styles.leyenda}>
        {data.map((item, i) => (
          <View key={i} style={styles.leyendaItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.leyendaText}>
              {item.name} {item.population}%
            </Text>
          </View>
        ))}
      </View>

      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => cambiarPantalla('Principal')}>
          <Ionicons name="home-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => cambiarPantalla('Registro')}>
          <Ionicons name="folder-open-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="time-outline" size={26} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 50,
  },

  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 32, height: 32, resizeMode: 'contain', marginRight: 6 },
  logoText: { fontSize: 22, fontWeight: 'bold', color: '#002060' },
  logoPlus: { fontSize: 22, fontWeight: 'bold', color: '#00A3FF' },
  logoSub: { fontSize: 16, color: '#00A3FF' },

  leyenda: { marginTop: 10, paddingHorizontal: 20 },
  leyendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorBox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
  },
  leyendaText: { color: '#001A72', fontWeight: '600' },

  navbar: {
    backgroundColor: '#001A72',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 'auto',
  },
});
