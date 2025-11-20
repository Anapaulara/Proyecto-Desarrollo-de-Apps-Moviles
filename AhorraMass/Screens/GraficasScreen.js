import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import BottomMenu from './BottomMenu';

export default function GraficasScreen() {

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Ahorra</Text>
          <Text style={styles.logoPlus}>+</Text>
          <Text style={styles.logoSub}> App</Text>
        </View>
      </View>

     <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 50,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center' 
  },
  logoImage: {
    width: 32, 
    height: 32, 
    resizeMode: 'contain', 
    marginRight: 6 
  },
  logoText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#002060' 
  },
  logoPlus: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#00A3FF' 
  },
  logoSub: { 
    fontSize: 16, 
    color: '#00A3FF' 
  },
  leyenda: { 
    marginTop: 10, 
    paddingHorizontal: 20 
  },
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
  leyendaText: { 
    color: '#001A72', 
    fontWeight: '600' 
  },
});
