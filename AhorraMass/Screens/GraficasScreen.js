import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomMenu from "./BottomMenu";

export default function GraficasScreen() {
  const [vista, setVista] = useState("categoria");

  const ingresosCategoria = [
    { categoria: "Salario", monto: 6000, color: "#003f91" },
    { categoria: "Ventas", monto: 2100, color: "#005fcd" },
    { categoria: "Regalos", monto: 800, color: "#007bff" },
  ];

  const egresosCategoria = [
    { categoria: "Comida", monto: 1200, color: "#003f91" },
    { categoria: "Transporte", monto: 450, color: "#005fcd" },
    { categoria: "Ropa", monto: 800, color: "#007bff" },
    { categoria: "Diversión", monto: 600, color: "#00a6ff" },
  ];

  const ingresosMes = [
    { categoria: "Enero", monto: 7000, color: "#003f91" },
    { categoria: "Febrero", monto: 6500, color: "#005fcd" },
    { categoria: "Marzo", monto: 7200, color: "#007bff" },
  ];

  const egresosMes = [
    { categoria: "Enero", monto: 3000, color: "#003f91" },
    { categoria: "Febrero", monto: 2800, color: "#005fcd" },
    { categoria: "Marzo", monto: 3500, color: "#007bff" },
  ];

  const renderGrafica = (titulo, datos, icono) => {
    const maxMonto = Math.max(...datos.map((d) => d.monto));

    return (
      <View style={styles.grafContainer}>
        <View style={styles.subTitleRow}>
          <Ionicons name={icono} size={22} color="#001A72" />
          <Text style={styles.subTitle}>{titulo}</Text>
        </View>

        {datos.map((d, i) => (
          <View key={i} style={styles.row}>
            <View style={styles.iconLabel}>
              <Ionicons name="analytics-outline" size={18} color="#003f91" />
              <Text style={styles.label}>{d.categoria}</Text>
            </View>

            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${(d.monto / maxMonto) * 100}%`,
                    backgroundColor: d.color,
                  },
                ]}
              />
            </View>

            <Text style={styles.monto}>${d.monto}</Text>
          </View>
        ))}
      </View>
    );
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
            name="pricetags-outline"
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
            name="calendar-outline"
            size={18}
            color={vista === "mes" ? "#fff" : "#003f91"}
          />
          <Text style={[styles.tabText, vista === "mes" && styles.tabTextActive]}>
            Mes
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ paddingHorizontal: 20 }}>
        {vista === "categoria" && (
          <>
            {renderGrafica("Ingresos por Categoría", ingresosCategoria, "trending-up-outline")}
            {renderGrafica("Egresos por Categoría", egresosCategoria, "trending-down-outline")}
          </>
        )}

        {vista === "mes" && (
          <>
            {renderGrafica("Ingresos Mensuales", ingresosMes, "bar-chart-outline")}
            {renderGrafica("Egresos Mensuales", egresosMes, "pie-chart-outline")}
          </>
        )}

        <View style={{ height: 130 }} />
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
    marginBottom: 45,
    backgroundColor: "#f5f7ff",
    padding: 18,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },

  subTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },

  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#001A72",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  iconLabel: {
    width: 130,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  label: {
    fontSize: 15,
    color: "#003f91",
    fontWeight: "600",
  },

  barBackground: {
    flex: 1,
    height: 22,
    backgroundColor: "#dfe8ff",
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 10,
  },

  barFill: {
    height: "100%",
    borderRadius: 15,
  },

  monto: {
    width: 70,
    textAlign: "right",
    fontWeight: "700",
    color: "#222",
  },
});
