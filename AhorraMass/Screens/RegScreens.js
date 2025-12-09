import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert, Platform } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import TransaccionesService from "../src/services/TransaccionesService";
import NotificacionesService from "../src/services/NotificacionesService";

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
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

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

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    let normalized = dateStr.replace(/\//g, '-');
    const parts = normalized.split('-');

    if (parts.length !== 3) return null;

    let y, m, d;
    if (parts[0].length === 4) {
      y = parts[0]; m = parts[1]; d = parts[2];
    } else if (parts[2].length === 4) {
      y = parts[2]; m = parts[1]; d = parts[0];
    } else {
      return null;
    }

    if (parseInt(m) > 12 || parseInt(d) > 31) return null;

    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  };

  const aplicarFiltros = async () => {
    try {
      let data = await TransaccionesService.obtenerTodos();

      if (filtroCategoria) {
        data = data.filter(item => item.categoria === filtroCategoria);
      }

      const inicio = parseDate(fechaInicio);
      const fin = parseDate(fechaFin);

      if (inicio || fin) {
        data = data.filter(item => {
          const itemDate = parseDate(item.fecha);
          if (!itemDate) return false;

          if (inicio && itemDate < inicio) return false;
          if (fin && itemDate > fin) return false;

          return true;
        });
      }

      setRegistros(data);

      if (data.length === 0) {
      }

    } catch (error) {
      console.error("Filtro Error:", error);
    }
  };

  const limpiarFiltros = () => {
    setFiltroCategoria('');
    setFechaInicio('');
    setFechaFin('');
    cargarRegistros();
  };

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

        await NotificacionesService.agregar(
          "Nuevo Movimiento",
          `Has registrado un ${tipo} de $${monto} en ${categoria}.`,
          tipo === 'ingreso' ? 'success' : 'warning'
        );
        Alert.alert("Éxito", "Movimiento registrado y notificado.");

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

      <View style={styles.header}>
        <Text style={styles.titulo}>Transacciones</Text>
      </View>

      <View style={styles.filtros}>
        <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Filtrar por Categoría:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {[...categoriasIngresos, ...categoriasEgresos].map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.catBtn,
                filtroCategoria === cat && { backgroundColor: "#001A72" }
              ]}
              onPress={() => setFiltroCategoria(filtroCategoria === cat ? '' : cat)}
            >
              <Text style={[
                styles.catText,
                filtroCategoria === cat && { color: "#fff" }
              ]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.dateFilterRow}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={styles.labelDates}>Desde:</Text>
            <TextInput
              style={styles.inputDate}
              placeholder="YYYY-MM-DD"
              value={fechaInicio}
              onChangeText={setFechaInicio}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={styles.labelDates}>Hasta:</Text>
            <TextInput
              style={styles.inputDate}
              placeholder="YYYY-MM-DD"
              value={fechaFin}
              onChangeText={setFechaFin}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity style={styles.btnFiltro} onPress={aplicarFiltros}>
            <MaterialCommunityIcons name="filter" size={20} color="#fff" style={{ marginRight: 5 }} />
            <Text style={{ color: "#fff", fontWeight: 'bold' }}>Aplicar Filtros</Text>
          </TouchableOpacity>

          {(filtroCategoria || fechaInicio || fechaFin) && (
            <TouchableOpacity style={[styles.btnFiltro, { backgroundColor: '#D32F2F', marginLeft: 10 }]} onPress={limpiarFiltros}>
              <MaterialCommunityIcons name="filter-remove" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

      </View>

      <ScrollView style={styles.lista}>
        {registros.length > 0 ? (
          registros.map(item => (
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
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>No se encontraron transacciones con estos filtros.</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={abrirAgregar}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitulo}>{modalMode === "add" ? "Agregar" : "Editar"}</Text>
            {/* ... Modal inputs ... */}
            <View style={styles.row}>
              <TouchableOpacity style={[styles.tipoBtn, tipo === "ingreso" && styles.tipoSeleccionado]} onPress={() => setTipo("ingreso")}>
                <Text style={styles.tipoText}>Ingreso</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tipoBtn, tipo === "egreso" && styles.tipoSeleccionado]} onPress={() => setTipo("egreso")}>
                <Text style={styles.tipoText}>Egreso</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ marginTop: 10 }}>Categoría:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {(tipo === "ingreso" ? categoriasIngresos : categoriasEgresos).map((cat, index) => (
                <TouchableOpacity key={index} style={[styles.catBtn, categoria === cat && { backgroundColor: "#001A72" }]} onPress={() => setCategoria(cat)}>
                  <Text style={[styles.catText, categoria === cat && { color: "#fff" }]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TextInput style={styles.modalInput} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
            <TextInput style={styles.modalInput} placeholder="Monto" keyboardType="numeric" value={monto} onChangeText={setMonto} />
            <TextInput style={styles.modalInput} placeholder="Fecha (YYYY-MM-DD)" value={fecha} onChangeText={setFecha} />
            <TextInput style={styles.modalInput} placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} />
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingTop: 40, alignItems: "center", paddingBottom: 10, elevation: 2, backgroundColor: '#fff' },
  titulo: { fontSize: 26, fontWeight: "bold", color: "#001A72" },

  filtros: { padding: 15, backgroundColor: '#F4F6F8', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  btnFiltro: {
    flexDirection: 'row',
    backgroundColor: "#001A72",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 5
  },

  catBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#fff", borderRadius: 15, marginRight: 8, borderWidth: 1, borderColor: '#ddd' },
  catText: { fontSize: 13, color: '#333' },

  dateFilterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  labelDates: { fontSize: 12, fontWeight: 'bold', color: '#555', marginBottom: 2 },
  inputDate: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, fontSize: 13 },

  lista: { padding: 10 },
  item: { flexDirection: "row", backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 10, elevation: 1, borderWidth: 1, borderColor: '#eee' },
  itemTitulo: { fontSize: 16, fontWeight: "bold", color: '#333' },
  itemSub: { color: "#666", fontSize: 12, marginTop: 2 },
  itemDesc: { fontSize: 12, color: "#999", marginTop: 2, fontStyle: 'italic' },
  monto: { fontWeight: "bold", marginHorizontal: 10, fontSize: 16, alignSelf: 'center' },

  addButton: { position: 'absolute', bottom: 30, right: 30, backgroundColor: "#001A72", width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: 'center', elevation: 5 },
  addText: { color: "#fff", fontSize: 30, marginTop: -2 },

  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalView: { backgroundColor: "#fff", width: "90%", padding: 20, borderRadius: 20 },
  modalTitulo: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 12 },
  modalInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 16 },
  modalBotones: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  btn: { flex: 1, padding: 12, borderRadius: 10, marginHorizontal: 5, alignItems: "center" },
  btnText: { fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  tipoBtn: { padding: 10, borderRadius: 10, backgroundColor: "#ddd", width: "45%", alignItems: "center" },
  tipoSeleccionado: { backgroundColor: "#001A72" },
  tipoText: { color: "#000", fontWeight: "bold" }
});
