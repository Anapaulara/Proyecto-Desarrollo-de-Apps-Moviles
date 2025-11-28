import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import BottomMenu from "./BottomMenu";

export default function GraficasScreen() {
  const [vista, setVista] = useState("categoria");
  
  const { width } = useWindowDimensions();
  const chartWidth = width - 40; 

  const ingresosPieData = [
    { name: "Salario", population: 6000, color: "#003f91", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Ventas", population: 2100, color: "#005fcd", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Regalos", population: 800, color: "#007bff", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  ];

  const egresosPieData = [
    { name: "Comida", population: 1200, color: "#003f91", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Transp.", population: 450, color: "#005fcd", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Ropa", population: 800, color: "#007bff", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Ocio", population: 600, color: "#00a6ff", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  ];

  const ingresosBarData = {
    labels: ["Ene", "Feb", "Mar"],
    datasets: [{ data: [7000, 6500, 7200] }]
  };

  const egresosLineData = {
    labels: ["Ene", "Feb", "Mar"],
    datasets: [{ data: [3000, 2800, 3500] }]
  };

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
              <PieChart
                data={ingresosPieData}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
              />
            </View>

            <View style={styles.grafContainer}>
              <Text style={styles.chartTitle}>Egresos por Categoría</Text>
              <PieChart
                data={egresosPieData}
                width={chartWidth}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
              />
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

      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
  }
});