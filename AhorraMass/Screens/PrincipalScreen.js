import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import GoalCard from "./GoalCard";
import AuthService from "../src/services/AuthService";
import TransaccionesService from "../src/services/TransaccionesService";

export default function PrincipalScreen() {
  const isFocused = useIsFocused();
  const [load, setLoad] = useState(true);
  const [user, setUser] = useState({ nombre: "User" });
  const [balance, setBalance] = useState({ ingresos: 0, egresos: 0, total: 0 });

  const loadData = async () => {
    setLoad(true);
    try {
      const u = await AuthService.getSession();
      if (u) setUser(u);

      const bal = await TransaccionesService.obtenerBalance();
      setBalance(bal);

    } catch (e) {
      console.error(e);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  if (load) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000033" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Hola, {user.nombre}.</Text>
        </View>
        <View style={styles.saldoActualCard}>
          <Text style={styles.saldoLabel}>Saldo Actual</Text>
          <Text style={[styles.saldoMonto, { color: balance.total >= 0 ? '#0D074D' : '#D32F2F' }]}>
            ${balance.total.toFixed(2)}
          </Text>
        </View>

        <Text style={styles.subtituloMetas}>Mis Compras Fuertes (Demo)</Text>
        <GoalCard
          title="Sala Nueva"
          currentAmount="2500"
          targetAmount="5,000"
          percentage={50}
        />

        <GoalCard
          title="Camioneta Sierra"
          currentAmount="100,000"
          targetAmount="1,070,200"
          percentage={9.34}
        />

        <View style={styles.Contenido}>
          <View style={styles.ContenidoIngresos}>
            <Text style={styles.txtIngresos}>Ingresos</Text>
            <Text style={styles.NoIngresos}>${balance.ingresos.toFixed(2)}</Text>
          </View>
          <View style={styles.ContenidoEgresos}>
            <Text style={styles.txtEgresos}>Egresos</Text>
            <Text style={styles.NoEgresos}>${balance.egresos.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.subtitulo}>Novedades de la App:</Text>
        <View style={styles.box}>
          <Text style={styles.novedadTitle}>¡Bienvenido!</Text>
          <Text style={styles.novedadDetail}>Ahora puedes gestionar tus presupuestos.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 100,
  },
  header: {
    width: '90%',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  saldoActualCard: {
    backgroundColor: '#f6f6f6ff',
    width: '90%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  saldoLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  saldoMonto: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  Contenido: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  ContenidoIngresos: {
    alignItems: 'center',
    backgroundColor: '#48ff54b3',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    marginBottom: 15,
  },
  ContenidoEgresos: {
    alignItems: 'center',
    backgroundColor: '#ff4747b3',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    marginBottom: 15,
  },
  txtIngresos: {
    fontWeight: 'bold',
    color: '#0e4101ff',
    fontSize: 20,
    marginBottom: 5
  },
  NoIngresos: {
    color: '#0e4101ff',
    fontSize: 22,
  },
  txtEgresos: {
    fontWeight: 'bold',
    color: '#700000ff',
    fontSize: 20,
    marginBottom: 5
  },
  NoEgresos: {
    color: '#700000ff',
    fontSize: 22,
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 35,
    color: '#000033'
  },
  subtitulo: {
    fontWeight: 'bold',
    fontSize: 20,
    width: '90%',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 5,
    color: '#000033'
  },
  subtituloMetas: {
    fontWeight: 'bold',
    fontSize: 20,
    width: '90%',
    textAlign: 'left',
    marginBottom: 5,
    color: '#000033'
  },
  box: {
    backgroundColor: '#dededeff',
    width: '90%',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  novedadTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0D074D',
  },
  novedadDetail: {
    fontSize: 14,
    color: '#666',
  },
});