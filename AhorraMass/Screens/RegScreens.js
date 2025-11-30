import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Modal, Alert } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import BottomMenu from './BottomMenu';

export default function RegScreens() {
  const [registros, setRegistros] = useState([
    { id: 1, nombre: "Gasolina", monto: "350", categoria: "Carro" },
    { id: 2, nombre: "Comida", monto: "120", categoria: "Supermercado" },
    { id: 3, nombre: "Netflix", monto: "199", categoria: "Suscripción" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [editId, setEditId] = useState(null);

  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');

  const abrirAgregar = () => {
    setModalMode('add');
    setEditId(null);
    setNombre('');
    setMonto('');
    setCategoria('');
    setModalVisible(true);
  };

  const abrirEditar = (item) => {
    setModalMode('edit');
    setEditId(item.id);
    setNombre(item.nombre);
    setMonto(String(item.monto));
    setCategoria(item.categoria);
    setModalVisible(true);
  };

  const guardarRegistro = () => {
    if (!nombre.trim() || !monto.trim() || !categoria.trim()) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }

    if (modalMode === 'add') {
      const nuevo = {
        id: Date.now(),
        nombre: nombre.trim(),
        monto: monto.trim(),
        categoria: categoria.trim(),
      };
      setRegistros(prev => [nuevo, ...prev]);
    } else {
      setRegistros(prev =>
        prev.map(r =>
          r.id === editId ? { ...r, nombre: nombre.trim(), monto: monto.trim(), categoria: categoria.trim() } : r
        )
      );
    }

    setModalVisible(false);
    setNombre('');
    setMonto('');
    setCategoria('');
    setEditId(null);
    setModalMode('add');
  };

  const eliminarRegistro = (id) => {
    Alert.alert('Confirmar', '¿Eliminar este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => setRegistros(prev => prev.filter(r => r.id !== id))
      }
    ]);
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.logoImage}
          />
          <Text style={styles.logoText}>Ahorra</Text>
          <Text style={styles.logoPlus}>+</Text>
          <Text style={styles.logoSub}> App</Text>
        </View>

        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="#001A72" />
        </TouchableOpacity>
      </View>

      <Text style={styles.titulo}>Registros</Text>

      <ScrollView style={styles.listaContainer} contentContainerStyle={{ paddingBottom: 10 }}>
        {registros.length === 0 && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#555' }}>No hay registros. Agrega uno con el botón +</Text>
          </View>
        )}

        {registros.map(item => (
          <View key={item.id} style={styles.item}>
            <FontAwesome5 name="wallet" size={20} color="#001A72" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitulo}>{item.nombre}</Text>
              <Text style={styles.itemSub}>{item.categoria}</Text>
            </View>

            <Text style={styles.monto}>${item.monto}</Text>

            <TouchableOpacity onPress={() => abrirEditar(item)} style={{ marginHorizontal: 10 }}>
              <FontAwesome5 name="pen" size={18} color="#001A72" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => eliminarRegistro(item.id)}>
              <FontAwesome5 name="trash" size={18} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={abrirAgregar}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>

            <Text style={styles.modalTitulo}>{modalMode === 'add' ? 'Agregar registro' : 'Editar registro'}</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              returnKeyType="next"
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Monto"
              keyboardType="numeric"
              value={monto}
              onChangeText={setMonto}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Categoría"
              value={categoria}
              onChangeText={setCategoria}
            />

            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={[styles.botonBase, { backgroundColor: "#999" }]}
                onPress={() => {
                  setModalVisible(false);
                  setEditId(null);
                }}
              >
                <Text style={styles.botonTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.botonBase, { backgroundColor: "#001A72" }]}
                onPress={guardarRegistro}
              >
                <Text style={[styles.botonTexto, { color: "#fff" }]}>Guardar</Text>
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
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 50,
  },

  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 32, height: 32, resizeMode: 'contain', marginRight: 6 },
  logoText: { fontSize: 22, fontWeight: 'bold', color: '#002060' },
  logoPlus: { fontSize: 22, fontWeight: 'bold', color: '#00A3FF' },
  logoSub: { fontSize: 16, color: '#00A3FF' },

  titulo: {
    fontSize: 26,
    color: '#001A72',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 18,
  },

  listaContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    marginHorizontal: 15,
    padding: 12,
    flex: 1,
    marginBottom: 20,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6E6E6',
    borderRadius: 25,
    padding: 14,
    marginBottom: 10,
  },

  itemTitulo: { fontSize: 17, fontWeight: '600', color: '#001A72' },
  itemSub: { color: '#555' },
  monto: { fontSize: 18, fontWeight: 'bold', marginRight: 10 },

  addButton: {
    backgroundColor: '#001A72',
    width: '90%',
    height: 60,
    borderRadius: 25,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
    marginTop: 10,
  },

  addText: { fontSize: 32, color: '#fff', fontWeight: 'bold' },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 20,
    padding: 20,
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#001A72',
    textAlign: 'center',
  },

  modalInput: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },

  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  botonBase: {
    padding: 12,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },

  botonTexto: {
    fontSize: 16,
    fontWeight: '600',
  }
});
