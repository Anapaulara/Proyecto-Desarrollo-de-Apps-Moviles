import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import { useIsFocused } from "@react-navigation/native";
import TransaccionesService from "../src/services/TransaccionesService";

export default function GraficasScreen() {
  const [vista, setVista] = useState("categoria");
  const isFocused = useIsFocused();
  const { width } = useWindowDimensions();
  const chartWidth = width - 40;

  const [loading, setLoading] = useState(true);
  const [ingresosPieData, setIngresosPieData] = useState([]);
  const [egresosPieData, setEgresosPieData] = useState([]);
  const [ingresosBarData, setIngresosBarData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [egresosLineData, setEgresosLineData] = useState({ labels: [], datasets: [{ data: [] }] });

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
      stroke: "#e3e3e3"
    }
  };

  const processData = async () => {
    try {
      setLoading(true);
      const allData = await TransaccionesService.obtenerTodos();

      // --- PIE CHARTS (By Category) ---
      const groupByCategory = (type) => {
        const filtered = allData.filter(t => t.tipo === type);
        const grouped = filtered.reduce((acc, curr) => {
          acc[curr.categoria] = (acc[curr.categoria] || 0) + curr.monto;
          return acc;
        }, {});

        return Object.keys(grouped).map((key, index) => ({
          name: key,
          population: grouped[key],
          color: getRandomColor(index),
          legendFontColor: "#7F7F7F",
          legendFontSize: 12
        }));
      };

      setIngresosPieData(groupByCategory("ingreso"));
      setEgresosPieData(groupByCategory("egreso"));

      // --- MONTHLY CHARTS ---
      // Group by YYYY-MM
      const groupByMonth = (type) => {
        const filtered = allData.filter(t => t.tipo === type);
        // Assuming t.fecha is 'YYYY-MM-DD'
        const grouped = filtered.reduce((acc, curr) => {
          const month = curr.fecha.substring(0, 7); // YYYY-MM
          acc[month] = (acc[month] || 0) + curr.monto;
          return acc;
        }, {});

        // Sort by date key
        const sortedKeys = Object.keys(grouped).sort();
        // Take last 6 months for readability
        const recentKeys = sortedKeys.slice(-6);

        return {
          labels: recentKeys.length ? recentKeys.map(k => getMonthName(k)) : ["Sin datos"],
          datasets: [{ data: recentKeys.length ? recentKeys.map(k => grouped[k]) : [0] }]
        };
      };

      setIngresosBarData(groupByMonth("ingreso"));
      setEgresosLineData(groupByMonth("egreso"));

    } catch (e) {
      console.error("Error processing charts:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      processData();
    }
  }, [isFocused]);

  const getRandomColor = (index) => {
    const colors = ["#003f91", "#005fcd", "#007bff", "#00a6ff", "#4da6ff", "#80bfff"];
    return colors[index % colors.length];
  };

  const getMonthName = (yyyymm) => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const [y, m] = yyyymm.split("-");
    const idx = parseInt(m, 10) - 1;
    return months[idx] || m;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003f91" />
        <Text>Cargando gráficas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Gráficas</Text>

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
          <Text style={[styles.tabText, vista === "categoria" && styles.tabTextActive]}>
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

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>

        {vista === "categoria" && (
          <>
            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Ingresos por Categoría</Text>
              {ingresosPieData.length > 0 ? (
                <PieChart
                  data={ingresosPieData}
                  width={chartWidth}
                  height={220}
                  chartConfig={chartConfig}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                />
              ) : <Text style={styles.noData}>Sin datos de ingresos</Text>}
            </View>

            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Egresos por Categoría</Text>
              {egresosPieData.length > 0 ? (
                <PieChart
                  data={egresosPieData}
                  width={chartWidth}
                  height={220}
                  chartConfig={chartConfig}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"15"}
                />
              ) : <Text style={styles.noData}>Sin datos de egresos</Text>}
            </View>
          </>
        )}

        {vista === "mes" && (
          <>
            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Ingresos Mensuales</Text>
              <BarChart
                data={ingresosBarData}
                width={chartWidth - 20}
                height={220}
                yAxisLabel="$"
                chartConfig={chartConfig}
                showValuesOnTopOfBars={true}
                fromZero={true}
              />
            </View>

            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Comportamiento de Gastos</Text>
              <LineChart
                data={egresosLineData}
                width={chartWidth - 20}
                height={220}
                yAxisLabel="$"
                chartConfig={{
                  ...chartConfig,
                  fillShadowGradient: "#00a6ff",
                  color: (opacity = 1) => `rgba(0, 166, 255, ${opacity})`,
                }}
                bezier
                style={{ borderRadius: 16 }}
                fromZero={true}
              />
            </View>
          </>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    color: "#001A72",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
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
  tabActive: {
    backgroundColor: "#003f91",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003f91",
  },
  tabTextActive: {
    color: "#fff",
  },
  grafContainer: {
    marginBottom: 25,
    marginHorizontal: 20,
    backgroundColor: "#f5f7ff",
    padding: 10,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#001A72",
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 10
  },
  noData: {
    marginVertical: 20,
    color: '#666',
    fontStyle: 'italic'
  }
});