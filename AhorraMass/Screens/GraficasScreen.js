// GraficasScreen.js
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
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const chartWidth = Math.max(300, width - 40);

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

  // Helper: parse fecha flexible -> { dia, mes }
  const extraerFecha = (fecha) => {
    try {
      if (!fecha || typeof fecha !== "string") return { dia: 0, mes: 0 };

      // yyyy-mm-dd
      if (fecha.includes("-")) {
        const partes = fecha.split("-");
        const mes = Number(partes[1]) || 0;
        const dia = Number(partes[2]) || 0;
        return { dia, mes };
      }

      // dd/mm/yyyy
      if (fecha.includes("/")) {
        const partes = fecha.split("/");
        const dia = Number(partes[0]) || 0;
        const mes = Number(partes[1]) || 0;
        return { dia, mes };
      }

      // try timestamp number string
      const n = Number(fecha);
      if (!Number.isNaN(n)) {
        const d = new Date(n);
        return { dia: d.getDate(), mes: d.getMonth() + 1 };
      }
    } catch (e) {
      // ignore parse error
    }
    return { dia: 0, mes: 0 };
  };

  // evita pasar arreglos vacíos a los charts (puede causar errores)
  const safeChartArray = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return [0];
    return arr;
  };

  const safeLabels = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return ["-"];
    return arr;
  };

  const cargarDatos = async () => {
    try {
      const sessionStr = await AsyncStorage.getItem("userSession");
      if (!sessionStr) {
        console.log("Graficas: no hay sesión (userSession).");
        // limpiar estados para evitar crash charts
        setPieIngresos([]);
        setPieEgresos([]);
        setMensualesIngresos([]);
        setMensualesEgresos([]);
        setEvolucionGastosDias([]);
        setEvolucionGastosMontos([]);
        setBalanceLabels([]);
        setBalanceMes([]);
        setResumen({ ingresos: 0, egresos: 0, balance: 0 });
        return;
      }

      const user = JSON.parse(sessionStr);
      const user_id = user?.id;
      if (!user_id) {
        console.log("Graficas: user_id no encontrado en session.");
        return;
      }

      // solicitar transacciones del usuario
      const trans = (await TransaccionesService.obtenerTodos(user_id)) || [];

      // Categorías para pie charts
      const ingresosObj = {};
      const egresosObj = {};

      // Variables para mes actual
      const mesActual = new Date().getMonth() + 1;
      const ingresosMesArr = [];
      const egresosMesArr = [];
      const gastosPorDia = {};

      // Balance por mes (obj {mes: {ingresos, egresos}})
      const balance = {};

      // recorrer transacciones con validaciones
      trans.forEach((t) => {
        if (!t) return;
        const tipo = String(t.tipo || "").toLowerCase();
        const monto = Number(t.monto || 0);
        const categoria = t.categoria || "Otros";

        // llenar categorías
        if (tipo === "ingreso") ingresosObj[categoria] = (ingresosObj[categoria] || 0) + monto;
        else if (tipo === "egreso") egresosObj[categoria] = (egresosObj[categoria] || 0) + monto;

        // extraer fecha segura
        const { dia, mes } = extraerFecha(t.fecha);

        // datos del mes actual
        if (mes === mesActual) {
          if (tipo === "ingreso") ingresosMesArr.push(monto);
          if (tipo === "egreso") egresosMesArr.push(monto);
          if (tipo === "egreso") {
            gastosPorDia[dia] = (gastosPorDia[dia] || 0) + monto;
          }
        }

        // acumulado para balance mensual (usar mes > 0)
        if (mes > 0) {
          if (!balance[mes]) balance[mes] = { ingresos: 0, egresos: 0 };
          if (tipo === "ingreso") balance[mes].ingresos += monto;
          else if (tipo === "egreso") balance[mes].egresos += monto;
        }
      });

      // preparar pie data (filtrar 0)
      const pieIn = Object.keys(ingresosObj)
        .filter((k) => ingresosObj[k] > 0)
        .map((cat, i) => ({
          name: cat,
          population: ingresosObj[cat],
          color: coloresPie[i % coloresPie.length],
          legendFontColor: "#7F7F7F",
          legendFontSize: 12,
        }));

      const pieEg = Object.keys(egresosObj)
        .filter((k) => egresosObj[k] > 0)
        .map((cat, i) => ({
          name: cat,
          population: egresosObj[cat],
          color: coloresPie[i % coloresPie.length],
          legendFontColor: "#7F7F7F",
          legendFontSize: 12,
        }));

      setPieIngresos(pieIn);
      setPieEgresos(pieEg);

      // arrays para charts por mes
      setMensualesIngresos(ingresosMesArr);
      setMensualesEgresos(egresosMesArr);

      const dias = Object.keys(gastosPorDia)
        .map(Number)
        .filter((d) => !Number.isNaN(d))
        .sort((a, b) => a - b);

      setEvolucionGastosDias(dias.map(String));
      setEvolucionGastosMontos(dias.map((d) => gastosPorDia[d]));

      // resumen
      const totalIn = ingresosMesArr.reduce((a, b) => a + b, 0);
      const totalEg = egresosMesArr.reduce((a, b) => a + b, 0);

      setResumen({ ingresos: totalIn, egresos: totalEg, balance: totalIn - totalEg });

      // balance mensual: ordenar meses y tomar últimos 4
      const mesesOrdenados = Object.keys(balance)
        .map(Number)
        .filter((m) => m > 0)
        .sort((a, b) => a - b);

      const ult4 = mesesOrdenados.slice(-4);
      if (ult4.length === 0) {
        setBalanceLabels(["-"]);
        setBalanceMes([0]);
      } else {
        setBalanceLabels(ult4.map((m) => `Mes ${m}`));
        setBalanceMes(ult4.map((m) => (balance[m] ? balance[m].ingresos - balance[m].egresos : 0)));
      }
    } catch (err) {
      console.log("❌ ERROR CARGAR GRAFICAS:", err);
      // asegurar estados válidos para que los charts no fallen
      setPieIngresos([]);
      setPieEgresos([]);
      setMensualesIngresos([]);
      setMensualesEgresos([]);
      setEvolucionGastosDias([]);
      setEvolucionGastosMontos([]);
      setBalanceLabels([]);
      setBalanceMes([]);
      setResumen({ ingresos: 0, egresos: 0, balance: 0 });
    }
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

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, vista === "categoria" && styles.tabActive]}
          onPress={() => setVista("categoria")}
        >
          <Ionicons name="pie-chart-outline" size={18} color={vista === "categoria" ? "#fff" : "#003f91"} />
          <Text style={[styles.tabText, vista === "categoria" && styles.tabTextActive]}>Categoría</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, vista === "mes" && styles.tabActive]} onPress={() => setVista("mes")}>
          <Ionicons name="stats-chart-outline" size={18} color={vista === "mes" ? "#fff" : "#003f91"} />
          <Text style={[styles.tabText, vista === "mes" && styles.tabTextActive]}>Mes</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* CATEGORÍA */}
        {vista === "categoria" && (
          <>
            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Ingresos por Categoría</Text>
              <PieChart
                data={pieIngresos.length ? pieIngresos : [{ name: "-", population: 1, color: "#eee", legendFontColor: "#7F7F7F", legendFontSize: 12 }]}
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
                data={pieEgresos.length ? pieEgresos : [{ name: "-", population: 1, color: "#eee", legendFontColor: "#7F7F7F", legendFontSize: 12 }]}
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

        {/* MES */}
        {vista === "mes" && (
          <>
            <View style={styles.cardsContainer}>
              <View style={[styles.card, { backgroundColor: "#cde7ff" }]}>
                <Text style={styles.cardTitle}>Ingresos</Text>
                <Text style={styles.cardNumber}>${resumen.ingresos.toFixed(2)}</Text>
              </View>

              <View style={[styles.card, { backgroundColor: "#ffd6d6" }]}>
                <Text style={styles.cardTitle}>Egresos</Text>
                <Text style={styles.cardNumber}>${resumen.egresos.toFixed(2)}</Text>
              </View>

              <View style={[styles.card, { backgroundColor: "#d9ffdc" }]}>
                <Text style={styles.cardTitle}>Balance</Text>
                <Text style={styles.cardNumber}>${resumen.balance.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Ingresos VS Egresos</Text>
              <BarChart
                data={{
                  labels: ["Ingresos", "Egresos"],
                  datasets: [{ data: [resumen.ingresos || 0, resumen.egresos || 0] }],
                }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                fromZero
              />
            </View>

            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Evolución diaria de Gastos</Text>
              <LineChart
                data={{
                  labels: evolucionGastosDias.length ? evolucionGastosDias : ["-"],
                  datasets: [{ data: evolucionGastosMontos.length ? evolucionGastosMontos : [0] }],
                }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                fromZero
              />
            </View>

            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Balance mensual</Text>
              <LineChart
                data={{
                  labels: balanceLabels.length ? balanceLabels : ["-"],
                  datasets: [{ data: balanceMes.length ? balanceMes : [0] }],
                }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                bezier
                fromZero
              />
            </View>

            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Ingresos del Mes</Text>
              <BarChart
                data={{
                  labels: (mensualesIngresos.length ? mensualesIngresos : [0]).map((_, i) => `#${i + 1}`),
                  datasets: [{ data: safeChartArray(mensualesIngresos) }],
                }}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                fromZero
                yAxisLabel="$"
              />
            </View>

            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Egresos del Mes</Text>
              <BarChart
                data={{
                  labels: (mensualesEgresos.length ? mensualesEgresos : [0]).map((_, i) => `#${i + 1}`),
                  datasets: [{ data: safeChartArray(mensualesEgresos) }],
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
