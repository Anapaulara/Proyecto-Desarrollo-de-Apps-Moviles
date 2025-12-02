import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import BottomMenu from './BottomMenu';
import TransaccionesService from "../src/services/TransaccionesService";

// ⭐ CATEGORÍAS OFICIALES
const categoriasIngresos = ["Sueldo", "Negocio", "Intereses", "Otros"];
const categoriasEgresos = ["Comida", "Transporte", "Entretenimiento", "Hogar", "Ropa", "Salud", "Otros"];

export default function RegScreen() {
  const [registros, setRegistros] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editId, setEditId] = useState(null);

  const [tipo, setTipo] = useState("egreso");
  const [categoria, setCategoria] = useState('');
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');

  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    try {
      const data = await TransaccionesService.obtenerTodos();
      setRegistros(data);
    } catch (error) {
      console.log("Error cargando registros:", error);
    }
  };

  // ⭐ Abrir modal para agregar
  const abrirAgregar = () => {
    setModalMode('add');
    setEditId(null);
    setTipo("egreso");
    setCategoria('');
    setNombre('');
    setMonto('');
    setDescripcion('');
    setFecha('');
    setModalVisible(true);
  };

  // ⭐ Abrir modal para editar
  const abrirEditar = (item) => {
    setModalMode('edit');
    setEditId(item.id);
    setTipo(item.tipo);
    setCategoria(item.categoria);
    setNombre(item.nombre);
    setMonto(String(item.monto));
    setDescripcion(item.descripcion);
    setFecha(item.fecha);
    setModalVisible(true);
  };

  // ⭐ Guardar transacción
  const guardarRegistro = async () => {
    if (!nombre.trim() || !monto.trim() || !categoria.trim() || !fecha.trim()) {
      Alert.alert("Error", "Completa todos los campos obligatorios.");
      return;
    }

    try {
      if (modalMode === 'add') {
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
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el registro.");
      console.log("ERROR guardar:", error);
    }
  };

  const eliminarRegistro = (id) => {
    Alert.alert("Confirmar", "¿Eliminar este registro?", [
      { text: "Cancelar" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          await TransaccionesService.eliminar(id);
          cargarRegistros();
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>

      {/* ENCABEZADO */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Transacciones</Text>
      </View>

      {/* FILTRO POR CATEGORÍA */}
      <View style={styles.filtros}>
        <Text style={{ fontWeight: "bold" }}>Filtrar categoría:</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
          { [...categoriasIngresos, ...categoriasEgresos].map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.catBtn,
                filtroCategoria === cat && { backgroundColor: "#001A72" }
              ]}
              onPress={() => setFiltroCategoria(cat)}
            >
              <Text style={[
                styles.catText,
                filtroCategoria === cat && { color: "#fff" }
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.btnFiltro}
          onPress={async () => {
            if (!filtroCategoria) return cargarRegistros();
            const data = await TransaccionesService.filtrarPorCategoria(filtroCategoria);
            setRegistros(data);
          }}
        >
          <Text style={{ color: "#fff" }}>Aplicar filtro</Text>
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <ScrollView style={styles.lista}>
        {registros.map(item => (
          <View key={item.id} style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitulo}>{item.nombre}</Text>
              <Text style={styles.itemSub}>{item.tipo} - {item.categoria} • {item.fecha}</Text>
              <Text style={styles.itemDesc}>{item.descripcion}</Text>
            </View>

            <Text style={[styles.monto, { color: item.tipo === "ingreso" ? "green" : "red" }]}>
              ${item.monto}
            </Text>

            <TouchableOpacity onPress={() => abrirEditar(item)}>
              <FontAwesome5 name="pen" size={18} color="#001A72" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => eliminarRegistro(item.id)} style={{ marginLeft: 12 }}>
              <FontAwesome5 name="trash" size={18} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* BOTÓN AGREGAR */}
      <TouchableOpacity style={styles.addButton} onPress={abrirAgregar}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>

            <Text style={styles.modalTitulo}>
              {modalMode === "add" ? "Agregar transacción" : "Editar transacción"}
            </Text>

            {/* TIPO */}
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.tipoBtn, tipo === "ingreso" && styles.tipoSeleccionado]}
                onPress={() => setTipo("ingreso")}
              >
                <Text style={styles.tipoText}>Ingreso</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tipoBtn, tipo === "egreso" && styles.tipoSeleccionado]}
                onPress={() => setTipo("egreso")}
              >
                <Text style={styles.tipoText}>Egreso</Text>
              </TouchableOpacity>
            </View>

            {/* CATEGORÍAS */}
            <Text style={{ marginTop: 10 }}>Categoría:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(tipo === "ingreso" ? categoriasIngresos : categoriasEgresos).map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.catBtn,
                    categoria === cat && { backgroundColor: "#001A72" }
                  ]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text style={[
                    styles.catText,
                    categoria === cat && { color: "#fff" }
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* CAMPOS */}
            <TextInput style={styles.modalInput} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.modalInput} placeholder="Monto" keyboardType="numeric" value={monto} onChangeText={setMonto} />
            <TextInput style={styles.modalInput} placeholder="Fecha (YYYY-MM-DD)" value={fecha} onChangeText={setFecha} />
            <TextInput style={styles.modalInput} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />

            {/* BOTONES */}
            <View style={styles.modalBotones}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: "#888" }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn, { backgroundColor: "#001A72" }]} onPress={guardarRegistro}>
                <Text style={[styles.btnText, { color: "#fff" }]}>Guardar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingTop: 40, alignItems: "center" },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#001A72" },

  filtros: { padding: 10 },
  btnFiltro: { backgroundColor: "#001A72", padding: 10, borderRadius: 10, alignItems: "center", marginBottom: 10 },

  catBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#ddd",
    borderRadius: 15,
    marginRight: 8
  },
  catText: { fontSize: 14 },

  lista: { padding: 10 },
  item: { flexDirection: "row", backgroundColor: "#E9E9E9", padding: 15, borderRadius: 20, marginBottom: 10 },
  itemTitulo: { fontSize: 18, fontWeight: "bold" },
  itemSub: { color: "#444" },
  itemDesc: { fontSize: 12, color: "#666" },
  monto: { fontWeight: "bold", marginHorizontal: 12, fontSize: 17 },

  addButton: { backgroundColor: "#001A72", width: "90%", padding: 15, borderRadius: 20, alignSelf: "center", alignItems: "center", marginBottom: 70 },
  addText: { color: "#fff", fontSize: 30 },

  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalView: { backgroundColor: "#fff", width: "85%", padding: 20, borderRadius: 20 },

  modalTitulo: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 12 },
  modalInput: { borderWidth: 1, borderColor: "#aaa", borderRadius: 10, padding: 10, marginBottom: 10 },

  modalBotones: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  btn: { flex: 1, padding: 12, borderRadius: 10, marginHorizontal: 5, alignItems: "center" },
  btnText: { fontWeight: "bold" },

  row: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  tipoBtn: { padding: 10, borderRadius: 10, backgroundColor: "#ddd", width: "45%", alignItems: "center" },
  tipoSeleccionado: { backgroundColor: "#001A72" },
  tipoText: { color: "#000", fontWeight: "bold" }
});
