import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from "react-native";
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

  const [evolucionGastosDias, setEvolucionGastosDias] = useState([]);
  const [evolucionGastosMontos, setEvolucionGastosMontos] = useState([]);

  const [balanceMes, setBalanceMes] = useState([]);
  const [balanceLabels, setBalanceLabels] = useState([]);

  const [resumen, setResumen] = useState({
    ingresos: 0,
    egresos: 0,
    balance: 0,
  });

  const { width } = useWindowDimensions();
  const chartWidth = width - 40;

  const coloresPie = [
    "#003f91",
    "#005fcd",
    "#007bff",
    "#00a6ff",
    "#00c2ff",
    "#009dd1",
    "#006b99",
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const trans = await TransaccionesService.obtenerTodos();
    const ingresos = {};
    const egresos = {};

    trans.forEach((t) => {
      if (t.tipo === "ingreso") {
        ingresos[t.categoria] = (ingresos[t.categoria] || 0) + t.monto;
      } else if (t.tipo === "egreso") {
        egresos[t.categoria] = (egresos[t.categoria] || 0) + t.monto;
      }
    });

    setPieIngresos(
      Object.keys(ingresos).map((cat, i) => ({
        name: cat,
        population: ingresos[cat],
        color: coloresPie[i % coloresPie.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      }))
    );

    setPieEgresos(
      Object.keys(egresos).map((cat, i) => ({
        name: cat,
        population: egresos[cat],
        color: coloresPie[i % coloresPie.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 12,
      }))
    );

    const mesActual = new Date().getMonth() + 1;

    const ingresosMes = [];
    const egresosMes = [];

    const gastosPorDia = {};

    trans.forEach((t) => {
      const [dia, mes] = t.fecha.split("/").map(Number);

      if (mes === mesActual) {
        if (t.tipo === "ingreso") ingresosMes.push(t.monto);
        if (t.tipo === "egreso") egresosMes.push(t.monto);

        if (t.tipo === "egreso") {
          gastosPorDia[dia] = (gastosPorDia[dia] || 0) + t.monto;
        }
      }
    });

    setMensualesIngresos(ingresosMes);
    setMensualesEgresos(egresosMes);

    // Evolución diaria gastos
    const dias = Object.keys(gastosPorDia).sort((a, b) => a - b);
    setEvolucionGastosDias(dias.map((d) => d.toString()));
    setEvolucionGastosMontos(dias.map((d) => gastosPorDia[d]));

    // Dashboard resumen
    const totalIn = ingresosMes.reduce((a, b) => a + b, 0);
    const totalEg = egresosMes.reduce((a, b) => a + b, 0);

    setResumen({
      ingresos: totalIn,
      egresos: totalEg,
      balance: totalIn - totalEg,
    });

    // Balance mensual (últimos 4 meses)
    const balance = {};
    trans.forEach((t) => {
      const partes = t.fecha.split("/");
      const mes = Number(partes[1]);

      if (!balance[mes]) balance[mes] = { ingresos: 0, egresos: 0 };

      if (t.tipo === "ingreso") balance[mes].ingresos += t.monto;
      else balance[mes].egresos += t.monto;
    });

    const sorted = Object.keys(balance).slice(-4).map(Number);

    setBalanceLabels(sorted.map((m) => `Mes ${m}`));
    setBalanceMes(sorted.map((m) => balance[m].ingresos - balance[m].egresos));
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    fillShadowGradient: "#003f91",
    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => `rgba(0, 63, 145, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 26, 114, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#e3e3e3",
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráficas</Text>

      {/* SWITCH */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, vista === "categoria" && styles.tabActive]}
          onPress={() => setVista("categoria")}
        >
          <Ionicons
            name="pie-chart-outline"
            size={18}
            color={vista === "categoria" ? "#fff" : "#003f91"}
          />
          <Text
            style={[styles.tabText, vista === "categoria" && styles.tabTextActive]}
          >
            Categoría
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, vista === "mes" && styles.tabActive]}
          onPress={() => setVista("mes")}
        >
          <Ionicons
            name="stats-chart-outline"
            size={18}
            color={vista === "mes" ? "#fff" : "#003f91"}
          />
          <Text style={[styles.tabText, vista === "mes" && styles.tabTextActive]}>
            Mes
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* ===========================
              PIE CATEGORÍA
           =========================== */}
        {vista === "categoria" && (
          <>
            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Ingresos por Categoría</Text>
              <PieChart
                data={pieIngresos}
                width={chartWidth}
                height={230}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                chartConfig={chartConfig}
              />
            </View>

            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Egresos por Categoría</Text>
              <PieChart
                data={pieEgresos}
                width={chartWidth}
                height={230}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                chartConfig={chartConfig}
              />
            </View>
          </>
        )}

        {/* ===========================
              MES (todas tus nuevas gráficas)
           =========================== */}
        {vista === "mes" && (
          <>
            {/* DASHBOARD */}
            <View style={styles.cardsContainer}>
              <View style={[styles.card, { backgroundColor: "#cde7ff" }]}>
                <Text style={styles.cardTitle}>Ingresos</Text>
                <Text style={styles.cardNumber}>${resumen.ingresos}</Text>
              </View>

              <View style={[styles.card, { backgroundColor: "#ffd6d6" }]}>
                <Text style={styles.cardTitle}>Egresos</Text>
                <Text style={styles.cardNumber}>${resumen.egresos}</Text>
              </View>

              <View style={[styles.card, { backgroundColor: "#d9ffdc" }]}>
                <Text style={styles.cardTitle}>Balance</Text>
                <Text style={styles.cardNumber}>${resumen.balance}</Text>
              </View>
            </View>

            {/* COMPARATIVA INGRESOS VS EGRESOS */}
            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Ingresos VS Egresos</Text>
              <BarChart
                data={{
                  labels: ["Ingresos", "Egresos"],
                  datasets: [{ data: [resumen.ingresos, resumen.egresos] }],
                }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                fromZero={true}
              />
            </View>

            {/* GRÁFICA EVOLUCIÓN DE GASTOS */}
            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Evolución diaria de Gastos</Text>
              <LineChart
                data={{
                  labels: evolucionGastosDias,
                  datasets: [{ data: evolucionGastosMontos }],
                }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                fromZero
              />
            </View>

            {/* GRÁFICA BALANCE MENSUAL */}
            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Balance mensual</Text>
              <LineChart
                data={{
                  labels: balanceLabels,
                  datasets: [{ data: balanceMes }],
                }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                fromZero
              />
            </View>

            {/* BARRAS INGRESOS */}
            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Ingresos del Mes</Text>
              <BarChart
                data={{
                  labels: mensualesIngresos.map((_, i) => `#${i + 1}`),
                  datasets: [{ data: mensualesIngresos }],
                }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                fromZero
                yAxisLabel="$"
              />
            </View>

            {/* BARRAS EGRESOS */}
            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Egresos del Mes</Text>
              <BarChart
                data={{
                  labels: mensualesEgresos.map((_, i) => `#${i + 1}`),
                  datasets: [{ data: mensualesEgresos }],
                }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                fromZero
                yAxisLabel="$"
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
  container: { flex: 1, backgroundColor: "#fff" },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 35,
    textAlign: "center",
    color: "#003f91",
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },

  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#003f91",
    borderRadius: 12,
    marginHorizontal: 8,
  },

  tabActive: {
    backgroundColor: "#003f91",
  },

  tabText: {
    marginLeft: 6,
    fontWeight: "bold",
    color: "#003f91",
  },

  tabTextActive: {
    color: "#fff",
  },

  grafContainer: {
    backgroundColor: "#eef4ff",
    padding: 16,
    marginHorizontal: 10,
    borderRadius: 16,
    marginBottom: 18,
  },

  chartTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#003f91",
    marginBottom: 10,
    textAlign: "center",
  },

  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 20,
  },

  card: {
    width: "32%",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },

  cardNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
});
