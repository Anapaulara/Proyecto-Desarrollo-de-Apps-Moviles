import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import BottomMenu from "./BottomMenu";
import TransaccionesService from "../src/services/TransaccionesService";

export default function GraficasScreen() {
  const [vista, setVista] = useState("categoria");

  const [pieIngresos, setPieIngresos] = useState([]);
  const [pieEgresos, setPieEgresos] = useState([]);

  const [mensualesIngresos, setMensualesIngresos] = useState([]);
  const [mensualesEgresos, setMensualesEgresos] = useState([]);

  const { width } = useWindowDimensions();
  const chartWidth = width - 40;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const trans = await TransaccionesService.obtenerTransacciones();

    // AGRUPAR POR CATEGORÍA
    const ingresos = {};
    const egresos = {};

    trans.forEach(t => {
      if (t.tipo === "Ingreso") {
        ingresos[t.categoria] = (ingresos[t.categoria] || 0) + t.monto;
      } else {
        egresos[t.categoria] = (egresos[t.categoria] || 0) + t.monto;
      }
    });

    // Convertir a formato PieChart
    setPieIngresos(
      Object.keys(ingresos).map((cat, i) => ({
        name: cat,
        population: ingresos[cat],
        color: coloresPie[i % coloresPie.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 12
      }))
    );

    setPieEgresos(
      Object.keys(egresos).map((cat, i) => ({
        name: cat,
        population: egresos[cat],
        color: coloresPie[i % coloresPie.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 12
      }))
    );

    // DATOS MENSUALES (solo mes actual)
    const mesActual = new Date().getMonth() + 1;

    const ingresosMes = trans
      .filter(t => t.tipo === "Ingreso" && Number(t.fecha.split("-")[1]) === mesActual)
      .map(t => t.monto);

    const egresosMes = trans
      .filter(t => t.tipo === "Egreso" && Number(t.fecha.split("-")[1]) === mesActual)
      .map(t => t.monto);

    setMensualesIngresos(ingresosMes);
    setMensualesEgresos(egresosMes);
  };

  const coloresPie = ["#003f91", "#005fcd", "#007bff", "#00a6ff", "#00c2ff", "#009dd1"];

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    fillShadowGradient: "#003f91",
    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => `rgba(0, 63, 145, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 26, 114, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#e3e3e3",
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráficas</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, vista === "categoria" && styles.tabActive]}
          onPress={() => setVista("categoria")}
        >
          <Ionicons name="pie-chart-outline" size={18} color={vista === "categoria" ? "#fff" : "#003f91"} />
          <Text style={[styles.tabText, vista === "categoria" && styles.tabTextActive]}>Categoría</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, vista === "mes" && styles.tabActive]}
          onPress={() => setVista("mes")}
        >
          <Ionicons name="stats-chart-outline" size={18} color={vista === "mes" ? "#fff" : "#003f91"} />
          <Text style={[styles.tabText, vista === "mes" && styles.tabTextActive]}>Mes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* PIE CHART CATEGORÍAS */}
        {vista === "categoria" && (
          <>
            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Ingresos por Categoría</Text>
              <PieChart
                data={pieIngresos}
                width={chartWidth}
                height={220}
                accessor="population"
                chartConfig={chartConfig}
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </View>

            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Egresos por Categoría</Text>
              <PieChart
                data={pieEgresos}
                width={chartWidth}
                height={220}
                accessor="population"
                chartConfig={chartConfig}
                backgroundColor="transparent"
                paddingLeft="15"
              />
            </View>
          </>
        )}

        {/* BARRAS Y LÍNEAS (MES) */}
        {vista === "mes" && (
          <>
            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Ingresos del Mes</Text>
              <BarChart
                data={{
                  labels: mensualesIngresos.map((_, i) => `#${i + 1}`),
                  datasets: [{ data: mensualesIngresos }]
                }}
                width={chartWidth}
                height={220}
                yAxisLabel="$"
                fromZero={true}
                chartConfig={chartConfig}
              />
            </View>

            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Gastos del Mes</Text>
              <LineChart
                data={{
                  labels: mensualesEgresos.map((_, i) => `#${i + 1}`),
                  datasets: [{ data: mensualesEgresos }]
                }}
                width={chartWidth}
                height={220}
                yAxisLabel="$"
                chartConfig={chartConfig}
                bezier
                fromZero={true}
              />
            </View>
          </>
        )}
      </ScrollView>

      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  title: {
    fontSize: 32,
    color: "#001A72",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 15,
  },
  tabContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 22,
    marginHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#e6eeff",
  },
  tabActive: { backgroundColor: "#003f91" },
  tabText: { fontSize: 16, fontWeight: "600", color: "#003f91" },
  tabTextActive: { color: "#fff" },
  grafContainer: {
    marginBottom: 25,
    marginHorizontal: 20,
    backgroundColor: "#f5f7ff",
    padding: 10,
    borderRadius: 18,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#001A72",
    marginBottom: 10,
    marginTop: 10,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
});
