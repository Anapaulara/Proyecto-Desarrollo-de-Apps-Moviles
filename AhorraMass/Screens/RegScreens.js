import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from "react-native";

import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import BottomMenu from "./BottomMenu";
import TransaccionesService from "../src/services/TransaccionesService";

// ICONOS POR CATEGORÍA
const iconosCategoria = {
  Sueldo: "briefcase",
  Negocio: "store",
  Intereses: "chart-line",
  OtrosIngresos: "coins",

  Comida: "hamburger",
  Transporte: "bus",
  Entretenimiento: "film",
  Hogar: "home",
  Ropa: "tshirt",
  Salud: "medkit",
  OtrosEgresos: "coins",
};

const categoriasIngresos = ["Sueldo", "Negocio", "Intereses", "OtrosIngresos"];
const categoriasEgresos = [
  "Comida",
  "Transporte",
  "Entretenimiento",
  "Hogar",
  "Ropa",
  "Salud",
  "OtrosEgresos",
];

export default function RegScreens() {
  const [registros, setRegistros] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editId, setEditId] = useState(null);

  const [tipo, setTipo] = useState("egreso");
  const [categoria, setCategoria] = useState("");
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");

  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    TransaccionesService.initialize();
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    const data = await TransaccionesService.obtenerTodos();
    setRegistros(data);
  };

  const abrirAgregar = () => {
    setModalMode("add");
    setEditId(null);
    setTipo("egreso");
    setCategoria("");
    setNombre("");
    setMonto("");
    setDescripcion("");
    setFecha("");
    setModalVisible(true);
  };

  const abrirEditar = (item) => {
    setModalMode("edit");
    setEditId(item.id);
    setTipo(item.tipo);
    setCategoria(item.categoria);
    setNombre(item.nombre);
    setMonto(String(item.monto));
    setDescripcion(item.descripcion);
    setFecha(item.fecha);
    setModalVisible(true);
  };

  const guardarRegistro = async () => {
    if (!nombre || !monto || !categoria || !fecha) {
      return Alert.alert("Error", "Completa todos los campos obligatorios.");
    }

    if (modalMode === "add") {
      await TransaccionesService.agregar(
        tipo,
        categoria,
        nombre,
        parseFloat(monto),
        fecha,
        descripcion
      );
    } else {
      await TransaccionesService.editar(
        editId,
        tipo,
        categoria,
        nombre,
        parseFloat(monto),
        fecha,
        descripcion
      );
    }

    setModalVisible(false);
    cargarRegistros();
  };

  const eliminarRegistro = (id) => {
    Alert.alert("Confirmar", "¿Eliminar registro?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await TransaccionesService.eliminar(id);
          cargarRegistros();
        },
      },
    ]);
  };

  const manejarFecha = (text) => {
    let limpio = text.replace(/\D/g, "");
    if (limpio.length >= 3 && limpio.length <= 4) {
      limpio = limpio.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    } else if (limpio.length >= 5) {
      limpio = limpio.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
    }
    if (limpio.length > 10) limpio = limpio.slice(0, 10);
    setFecha(limpio);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Transacciones</Text>
      </View>

      {/* FILTROS */}
      <View style={styles.filtrosBox}>
        <TouchableOpacity
          onPress={() => setMostrarFiltros(!mostrarFiltros)}
          style={styles.toggleBtn}
        >
          <Text style={styles.toggleText}>
            {mostrarFiltros ? "Ocultar categorías" : "Mostrar categorías"}
          </Text>
        </TouchableOpacity>

        {mostrarFiltros && (
          <>
            <Text style={styles.filtroTitulo}>Filtrar por categoría</Text>

            <View style={styles.filtroGrid}>
              {[...categoriasIngresos, ...categoriasEgresos].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.filtroItem,
                    filtroCategoria === cat && styles.filtroItemActivo,
                  ]}
                  onPress={() =>
                    setFiltroCategoria(filtroCategoria === cat ? "" : cat)
                  }
                >
                  <FontAwesome5
                    name={iconosCategoria[cat]}
                    size={14}
                    color={filtroCategoria === cat ? "#fff" : "#003f91"}
                  />
                  <Text
                    style={[
                      styles.filtroText,
                      filtroCategoria === cat && { color: "#fff" },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.aplicarBtn}
              onPress={async () => {
                if (!filtroCategoria) return cargarRegistros();
                const data =
                  await TransaccionesService.filtrarPorCategoria(
                    filtroCategoria
                  );
                setRegistros(data);
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Aplicar filtro
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.aplicarBtn, { backgroundColor: "#777" }]}
              onPress={() => {
                setFiltroCategoria("");
                cargarRegistros();
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Mostrar todos
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* LISTA */}
      <ScrollView style={styles.lista}>
        {registros.map((item) => (
          <View key={item.id.toString()} style={styles.card}>
            <View style={styles.iconBox}>
              <FontAwesome5
                name={iconosCategoria[item.categoria]}
                size={22}
                color="#fff"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitulo}>{item.nombre}</Text>
              <Text style={styles.cardSub}>
                {item.tipo} • {item.categoria} • {item.fecha}
              </Text>
              <Text style={styles.cardDesc}>{item.descripcion}</Text>
            </View>

            <Text
              style={[
                styles.cardMonto,
                { color: item.tipo === "ingreso" ? "#00aa33" : "#cc0000" },
              ]}
            >
              ${item.monto}
            </Text>

            <TouchableOpacity onPress={() => abrirEditar(item)}>
              <FontAwesome5 name="pen" size={18} color="#003f91" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => eliminarRegistro(item.id)}
              style={{ marginLeft: 10 }}
            >
              <FontAwesome5 name="trash" size={18} color="#cc0000" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* BOTÓN + */}
      <TouchableOpacity style={styles.addBtn} onPress={abrirAgregar}>
        <Ionicons name="add" size={34} color="#fff" />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>
              {modalMode === "add"
                ? "Agregar Transacción"
                : "Editar Transacción"}
            </Text>

            {/* Tipo */}
            <View style={styles.tipoRow}>
              <TouchableOpacity
                style={[
                  styles.tipoItem,
                  tipo === "ingreso" && styles.tipoActivo,
                ]}
                onPress={() => setTipo("ingreso")}
              >
                <MaterialIcons
                  name="arrow-upward"
                  size={20}
                  color={tipo === "ingreso" ? "#fff" : "#003f91"}
                />
                <Text
                  style={[
                    styles.tipoText,
                    tipo === "ingreso" && { color: "#fff" },
                  ]}
                >
                  Ingreso
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tipoItem,
                  tipo === "egreso" && styles.tipoActivo,
                ]}
                onPress={() => setTipo("egreso")}
              >
                <MaterialIcons
                  name="arrow-downward"
                  size={20}
                  color={tipo === "egreso" ? "#fff" : "#003f91"}
                />
                <Text
                  style={[
                    styles.tipoText,
                    tipo === "egreso" && { color: "#fff" },
                  ]}
                >
                  Egreso
                </Text>
              </TouchableOpacity>
            </View>

            {/* Categorías */}
            <Text style={styles.label}>Categoría</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(tipo === "ingreso"
                ? categoriasIngresos
                : categoriasEgresos
              ).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catModal,
                    categoria === cat && styles.catModalActive,
                  ]}
                  onPress={() => setCategoria(cat)}
                >
                  <FontAwesome5
                    name={iconosCategoria[cat]}
                    size={14}
                    color={categoria === cat ? "#fff" : "#003f91"}
                  />
                  <Text
                    style={[
                      styles.catModalText,
                      categoria === cat && { color: "#fff" },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Inputs */}
            <View style={styles.inputBox}>
              <FontAwesome5 name="tag" size={16} color="#003f91" />
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.inputBox}>
              <FontAwesome5 name="dollar-sign" size={16} color="#003f91" />
              <TextInput
                style={styles.input}
                placeholder="Monto"
                keyboardType="numeric"
                value={monto}
                onChangeText={setMonto}
              />
            </View>

            <View style={styles.inputBox}>
              <FontAwesome5 name="calendar" size={16} color="#003f91" />
              <TextInput
                style={styles.input}
                placeholder="Fecha (DD/MM/YYYY)"
                value={fecha}
                onChangeText={manejarFecha}
              />
            </View>

            <View style={styles.inputBox}>
              <FontAwesome5 name="align-left" size={16} color="#003f91" />
              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={descripcion}
                multiLine
                onChangeText={setDescripcion}
              />
            </View>

            {/* Botones */}
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#999" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#003f91" }]}
                onPress={guardarRegistro}
              >
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomMenu />
    </View>
  );
}

/* ─────────────────────────── ESTILOS ─────────────────────────── */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: { paddingTop: 50, alignItems: "center" },
  titulo: { fontSize: 28, fontWeight: "bold", color: "#003f91" },

  filtrosBox: {
    backgroundColor: "#eef4ff",
    padding: 14,
    margin: 10,
    borderRadius: 20,
  },

  toggleBtn: {
    backgroundColor: "#003f91",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  toggleText: { color: "#fff", fontWeight: "bold" },

  filtroTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#003f91",
    marginTop: 10,
    marginBottom: 10,
  },

  filtroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  filtroItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#003f91",
  },
  filtroItemActivo: { backgroundColor: "#003f91" },

  filtroText: { color: "#003f91", fontWeight: "600" },

  aplicarBtn: {
    marginTop: 10,
    backgroundColor: "#003f91",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  lista: { paddingHorizontal: 14, marginBottom: 60 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#f3f6ff",
    borderRadius: 18,
    marginBottom: 12,
    elevation: 2,
  },

  iconBox: {
    width: 45,
    height: 45,
    backgroundColor: "#003f91",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  cardTitulo: { fontSize: 18, fontWeight: "bold", color: "#003f91" },
  cardSub: { color: "#555" },
  cardDesc: { color: "#777", fontSize: 12 },

  cardMonto: { fontSize: 18, fontWeight: "bold", marginHorizontal: 10 },

  addBtn: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#003f91",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    backgroundColor: "#fff",
    width: "88%",
    borderRadius: 20,
    padding: 20,
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#003f91",
    marginBottom: 14,
  },

  tipoRow: { flexDirection: "row", justifyContent: "space-between" },

  tipoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#d9e4ff",
    padding: 10,
    borderRadius: 12,
    width: "48%",
    justifyContent: "center",
  },

  tipoActivo: { backgroundColor: "#003f91" },

  tipoText: { fontWeight: "bold", color: "#003f91" },

  label: { marginTop: 10, marginBottom: 6, fontWeight: "600" },

  catModal: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#eef4ff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#003f91",
    marginRight: 8,
  },

  catModalActive: { backgroundColor: "#003f91" },

  catModalText: { marginLeft: 6, color: "#003f91", fontWeight: "600" },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef4ff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 10,
  },

  input: { flex: 1, marginLeft: 10, fontSize: 15 },

  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 6,
  },

  modalBtnText: { fontWeight: "bold", color: "#fff" },
});
