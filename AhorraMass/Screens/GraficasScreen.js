import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import { useIsFocused } from "@react-navigation/native";
import TransaccionesService from "../src/services/TransaccionesService";

export default function GraficasScreen() {
  const [vista, setVista] = useState("categoria"); // categoria, mes, balance
  const isFocused = useIsFocused();
  const { width } = useWindowDimensions();
  const chartWidth = width - 40;

  const [loading, setLoading] = useState(true);
  const [ingresosPieData, setIngresosPieData] = useState([]);
  const [egresosPieData, setEgresosPieData] = useState([]);
  const [ingresosBarData, setIngresosBarData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [egresosLineData, setEgresosLineData] = useState({ labels: [], datasets: [{ data: [] }] });
  const [balanceData, setBalanceData] = useState([]); // Data for the comparison table

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

      // --- MONTHLY CHARTS & TABLE ---
      // 1. Group all transactions by YYYY-MM
      const monthlyGroups = allData.reduce((acc, curr) => {
        // Handle potential date format changes over time, safest is standardized YYYY-MM-DD
        // We assume standard ISO or similar where first 7 chars are YYYY-MM
        // If robust parsing needed (like in Budget), apply it. 
        // For now trusting the service or basic slice if format is YYYY-MM* or YYYY/MM*

        let monthKey = "";
        const cleanDate = curr.fecha.replace(/\//g, '-');
        const parts = cleanDate.split('-');
        if (parts.length === 3) {
          if (parts[0].length === 4) monthKey = `${parts[0]}-${parts[1]}`;
          else if (parts[2].length === 4) monthKey = `${parts[2]}-${parts[1]}`;
        } else {
          monthKey = cleanDate.substring(0, 7);
        }

        if (!acc[monthKey]) acc[monthKey] = { income: 0, expense: 0 };

        if (curr.tipo === 'ingreso') acc[monthKey].income += curr.monto;
        else if (curr.tipo === 'egreso') acc[monthKey].expense += curr.monto;

        return acc;
      }, {});

      // 2. Sort keys
      const sortedKeys = Object.keys(monthlyGroups).sort();

      // 3. Prepare Chart Data (Last 6 months)
      const recentKeys = sortedKeys.slice(-6);

      setIngresosBarData({
        labels: recentKeys.length ? recentKeys.map(k => getMonthName(k)) : ["Sin datos"],
        datasets: [{ data: recentKeys.length ? recentKeys.map(k => monthlyGroups[k].income) : [0] }]
      });

      setEgresosLineData({
        labels: recentKeys.length ? recentKeys.map(k => getMonthName(k)) : ["Sin datos"],
        datasets: [{ data: recentKeys.length ? recentKeys.map(k => monthlyGroups[k].expense) : [0] }]
      });

      // 4. Prepare Table Data (All months or last 12, reversed for newest first)
      const tableRows = sortedKeys.reverse().map(key => ({
        month: getMonthName(key) + " " + key.split('-')[0], // e.g. "Dic 2025"
        income: monthlyGroups[key].income,
        expense: monthlyGroups[key].expense,
        balance: monthlyGroups[key].income - monthlyGroups[key].expense
      }));
      setBalanceData(tableRows);

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
    if (!yyyymm) return "";
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const parts = yyyymm.split("-");
    if (parts.length < 2) return yyyymm;
    const m = parts[1];
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

      <Text style={styles.title}>Estadísticas</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, vista === "categoria" && styles.tabActive]}
          onPress={() => setVista("categoria")}
        >
          <Ionicons name="pie-chart-outline" size={18} color={vista === "categoria" ? "#fff" : "#003f91"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, vista === "mes" && styles.tabActive]}
          onPress={() => setVista("mes")}
        >
          <Ionicons name="stats-chart-outline" size={18} color={vista === "mes" ? "#fff" : "#003f91"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, vista === "balance" && styles.tabActive]}
          onPress={() => setVista("balance")}
        >
          <Ionicons name="list-outline" size={18} color={vista === "balance" ? "#fff" : "#003f91"} />
          <Text style={[styles.tabText, vista === "balance" && styles.tabTextActive, { marginLeft: 5 }]}>Tabla</Text>
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

        {vista === "balance" && (
          <View style={styles.tableContainer}>
            <Text style={styles.chartTitle}>Comparativa Mensual</Text>

            <View style={styles.tableHeader}>
              <Text style={[styles.tableResultHeader, { flex: 1.2, textAlign: 'left' }]}>Mes</Text>
              <Text style={styles.tableResultHeader}>Ingreso</Text>
              <Text style={styles.tableResultHeader}>Egreso</Text>
              <Text style={styles.tableResultHeader}>Balance</Text>
            </View>

            {balanceData.length > 0 ? (
              balanceData.map((row, index) => (
                <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
                  <Text style={[styles.tableCell, { flex: 1.2, textAlign: 'left', fontWeight: 'bold' }]}>
                    {row.month}
                  </Text>
                  <Text style={[styles.tableCell, { color: '#2E7D32' }]}>
                    +${row.income.toFixed(0)}
                  </Text>
                  <Text style={[styles.tableCell, { color: '#C62828' }]}>
                    -${row.expense.toFixed(0)}
                  </Text>
                  <Text style={[styles.tableCell, { fontWeight: 'bold', color: row.balance >= 0 ? '#003f91' : '#D32F2F' }]}>
                    ${row.balance.toFixed(0)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noData}>No hay transacciones registradas.</Text>
            )}
          </View>
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
    fontSize: 28,
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
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: "#e6eeff",
    minWidth: 60
  },
  tabActive: {
    backgroundColor: "#003f91",
  },
  tabText: {
    fontSize: 14,
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
    marginBottom: 15,
    alignSelf: 'center', // Centered title for table
    marginTop: 10
  },
  noData: {
    marginVertical: 20,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center'
  },

  // Table Styles
  tableContainer: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#003f91',
    paddingBottom: 10,
    marginBottom: 5,
  },
  tableResultHeader: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    color: '#003f91',
    textAlign: 'right'
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tableRowAlt: {
    backgroundColor: '#f9fbff',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'right'
  }
});