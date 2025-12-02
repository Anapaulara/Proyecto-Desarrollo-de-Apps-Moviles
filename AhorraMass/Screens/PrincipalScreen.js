import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomMenu from "./BottomMenu";
import GoalCard from "./GoalCard";
import TransaccionesService from "../src/services/TransaccionesService";
import AuthService from "../src/services/AuthService";

export default function PrincipalScreen() {
  const [usuario, setUsuario] = useState("Usuario");
  
  const [saldo, setSaldo] = useState(0);
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [ahorro, setAhorro] = useState(0);
  const [limite, setLimite] = useState(0);

  const [novedades, setNovedades] = useState([]);
  const [comprasFuertes, setComprasFuertes] = useState([]);

  useEffect(() => {
    cargarUsuarioReal();
    cargarResumen();
  }, []);

  // ================================
  // ✔ Cargar usuario REAL DEL LOGIN
  // ================================
  const cargarUsuarioReal = async () => {
    try {
      const data = await AsyncStorage.getItem("userSession");

      if (!data) return;

      const user = JSON.parse(data);

      setUsuario(user.nombre);
    } catch (err) {
      console.log("❌ ERROR CARGAR USUARIO:", err);
    }
  };

  // ================================
  // ✔ Resumen transacciones
  // ================================
  const cargarResumen = async () => {
    const datos = await TransaccionesService.obtenerTodos();

    let sumaIngresos = 0;
    let sumaEgresos = 0;

    datos.forEach((t) => {
      if (t.tipo === "ingreso") sumaIngresos += t.monto;
      else sumaEgresos += t.monto;
    });

    setIngresos(sumaIngresos);
    setEgresos(sumaEgresos);
    setSaldo(sumaIngresos - sumaEgresos);
    setAhorro((sumaIngresos - sumaEgresos) * 0.10);
    setLimite(500);

    setNovedades(datos.slice(-5).reverse());

    const fuertes = datos.filter(
      (t) => t.tipo === "egreso" && t.monto >= 2000
    );
    setComprasFuertes(fuertes.slice(-2));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.titulo}>Hola, <Text style={styles.usuario}>{usuario}</Text>.</Text>
        </View>

        <View style={styles.saldoActualCard}>
          <Text style={styles.saldoLabel}>Saldo Actual</Text>
          <Text style={styles.saldoMonto}>${saldo.toFixed(2)}</Text>
        </View>

        <Text style={styles.subtituloMetas}>Mis Compras Fuertes.</Text>

        {comprasFuertes.length === 0 && (
          <Text style={styles.noCompras}>No tienes compras fuertes aún.</Text>
        )}

        {comprasFuertes.map((c) => (
          <GoalCard
            key={c.id}
            title={c.nombre}
            currentAmount={c.monto}
            targetAmount={c.monto * 2}
            percentage={50}
          />
        ))}

        <View style={styles.Contenido}>
          <View style={styles.ContenidoIngresos}>
            <Text style={styles.txtIngresos}>Ingresos</Text>
            <Text style={styles.NoIngresos}>${ingresos.toFixed(2)}</Text>
          </View>

          <View style={styles.ContenidoEgresos}>
            <Text style={styles.txtEgresos}>Egresos</Text>
            <Text style={styles.NoEgresos}>${egresos.toFixed(2)}</Text>
          </View>

          <View style={styles.ContenidoPred}>
            <Text style={styles.txtPred}>Ahorros</Text>
            <Text style={styles.NoPred}>${ahorro.toFixed(2)}</Text>
          </View>

          <View style={styles.ContenidoPred}>
            <Text style={styles.txtPred}>Límite</Text>
            <Text style={styles.NoPred}>${limite.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.subtitulo}>Novedades:</Text>

        {novedades.map((n) => (
          <View key={n.id} style={styles.box}>
            <Text style={styles.novedadTitle}>{n.nombre}</Text>
            <Text style={styles.novedadDetail}>
              {n.tipo === "ingreso" ? "+" : "-"}${n.monto} ({n.categoria})
            </Text>
          </View>
        ))}

      </ScrollView>

      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { alignItems: "center", paddingTop: 40, paddingBottom: 100 },

  header: { width: "90%", marginBottom: 20 },
  
  titulo: {
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: 35,
    color: "#0D074D",
  },
  usuario: { color: "#4A42F4" },

  saldoActualCard: {
    backgroundColor: "#f7f7f7",
    width: "90%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 4,
  },

  saldoLabel: { fontSize: 18, color: "#666" },
  saldoMonto: { fontSize: 40, fontWeight: "bold", color: "#0D074D" },

  subtituloMetas: {
    fontSize: 20,
    fontWeight: "bold",
    width: "90%",
    marginBottom: 5,
  },

  noCompras: { width: "90%", textAlign: "left", color: "#777" },

  Contenido: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  ContenidoIngresos: {
    alignItems: "center",
    backgroundColor: "#48ff54b3",
    width: "48%",
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: "center",
    marginBottom: 15,
  },
  ContenidoEgresos: {
    alignItems: "center",
    backgroundColor: "#ff4747b3",
    width: "48%",
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: "center",
    marginBottom: 15,
  },
  ContenidoPred: {
    alignItems: "center",
    backgroundColor: "#f6f6f6ff",
    width: "48%",
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: "center",
    marginBottom: 15,
    borderColor: "#0D074D",
    borderWidth: 2,
  },

  txtPred: { fontWeight: "bold", color: "#0D074D", fontSize: 20, top: -10 },
  NoPred: { color: "#0D074D", fontSize: 28, top: -5 },

  txtIngresos: { fontWeight: "bold", color: "#0e4101", fontSize: 20, top: -10 },
  NoIngresos: { color: "#0e4101", fontSize: 28, top: -5 },

  txtEgresos: { fontWeight: "bold", color: "#700000", fontSize: 20, top: -10 },
  NoEgresos: { color: "#700000", fontSize: 28, top: -5 },

  subtitulo: {
    fontWeight: "bold",
    fontSize: 20,
    width: "90%",
    marginTop: 10,
    marginBottom: 5,
  },

  box: {
    backgroundColor: "#ececec",
    width: "90%",
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    elevation: 2,
  },
  novedadTitle: { fontWeight: "bold", fontSize: 16, color: "#0D074D" },
  novedadDetail: { color: "#666", fontSize: 14 },
});
