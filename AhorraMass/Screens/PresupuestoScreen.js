import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import PresupuestosService from "../src/services/PresupuestosService";
import TransaccionesService from "../src/services/TransaccionesService";
import AuthService from "../src/services/AuthService";

export default function PresupuestoScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryAmount, setNewCategoryAmount] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);

  const loadData = async (uid) => {
    try {
      setLoading(true);
      // Pass User ID
      const budgets = await PresupuestosService.obtenerTodos(uid);

      const today = new Date();
      const currentMonth = today.toISOString().slice(0, 7);

      const budgetsWithStatus = await Promise.all(budgets.map(async (b) => {
        // Pass User ID
        const transactions = await TransaccionesService.filtrarPorCategoria(b.categoria, uid);

        const totalSpent = transactions
          .filter(t => {
            if (t.tipo !== 'egreso') return false;

            const cleanDate = t.fecha.replace(/\//g, '-');
            const parts = cleanDate.split('-');

            let tMonth = "";

            if (parts.length === 3) {
              if (parts[0].length === 4) {
                tMonth = `${parts[0]}-${parts[1]}`;
              } else if (parts[2].length === 4) {
                tMonth = `${parts[2]}-${parts[1]}`;
              }
            } else {
              tMonth = cleanDate.substring(0, 7);
            }

            return tMonth === currentMonth;
          })
          .reduce((sum, t) => sum + t.monto, 0);

        return {
          ...b,
          spent: totalSpent,
          isExceeded: totalSpent > b.montoLimit,
          name: b.categoria,
          amount: b.montoLimit
        };
      }));

      setCategories(budgetsWithStatus);

      const exceeded = budgetsWithStatus.filter(b => b.isExceeded);
      if (exceeded.length > 0) {
        Alert.alert("¡Alerta de Presupuesto!", `Has excedido el presupuesto en: ${exceeded.map(b => b.categoria).join(", ")}`);
      }

    } catch (e) {
      console.error("Error al cargar presupuestos: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      AuthService.getSession().then(u => {
        if (u) {
          setCurrentUser(u);
          loadData(u.id);
        }
      });
    }
  }, [isFocused]);

  const handleSaveCategory = async () => {
    if (!currentUser) return;
    if (!newCategoryName || !newCategoryAmount) {
      Alert.alert("Error", "Debes ingresar una categoría y un monto.");
      return;
    }

    const amountValue = parseFloat(newCategoryAmount);
    if (isNaN(amountValue)) {
      Alert.alert("Error", "El monto debe ser un número válido.");
      return;
    }

    try {
      const today = new Date();
      const currentMonth = today.toISOString().slice(0, 7);

      if (editingCategory) {
        await PresupuestosService.editar(editingCategory.id, newCategoryName, amountValue, currentMonth);
        Alert.alert("Éxito", "Presupuesto actualizado.");
      } else {
        await PresupuestosService.agregar(newCategoryName, amountValue, currentMonth, currentUser.id);
        Alert.alert("Éxito", "Presupuesto creado.");
      }

      setModalVisible(false);
      setNewCategoryName('');
      setNewCategoryAmount('');
      setEditingCategory(null);
      loadData(currentUser.id);

    } catch (e) {
      console.error("Error saving budget", e);
      Alert.alert("Error", "No se pudo guardar el presupuesto.");
    }
  };

  const handleDelete = (id) => {
    if (!currentUser) return;
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar este presupuesto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            await PresupuestosService.eliminar(id);
            loadData(currentUser.id);
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleDeleteAll = () => {
    Alert.alert("Info", "Función no disponible por seguridad.");
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.categoria);
    setNewCategoryAmount(category.montoLimit.toString());
    setModalVisible(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryAmount('');
    setModalVisible(true);
  };

  const renderCategoryItem = ({ item }) => {
    const isExceeded = item.spent > item.amount;

    return (
      <View style={[styles.category, isExceeded && styles.categoryExceeded]}>
        <View style={styles.categoryDetails}>
          <View style={styles.categoryHeader}>
            <Ionicons name="wallet-outline" size={24} color="#0f1530" />
            <Text style={styles.categoryText}>{item.name}</Text>
            {isExceeded && <Ionicons name="warning" size={20} color="red" style={{ marginLeft: 10 }} />}
          </View>
          <View style={styles.amountBox}>
            <View>
              <Text style={styles.amountLabel}>Límite</Text>
              <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
            </View>
            <View>
              <Text style={styles.amountLabel}>Gastado</Text>
              <Text style={[styles.amount, { color: isExceeded ? 'red' : 'green' }]}>
                ${item.spent.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.categoryActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEdit(item)}
          >
            <MaterialIcons name="edit" size={20} color="#2A7CF7" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item.id)}
          >
            <MaterialIcons name="delete" size={20} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A7CF7" />
        <Text style={styles.loadingText}>Cargando presupuestos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Ahorra<Text style={{ color: '#2A7CF7' }}>+</Text> App</Text>
      </View>

      <Text style={styles.title}>Presupuesto Mensual</Text>

      {/* ... ListHeader, List, Modal ... same structure */}
      <View style={styles.listHeader}>
        <Text style={styles.subtitle}>Mis Presupuestos</Text>
        <TouchableOpacity style={styles.addButtonIcon} onPress={handleAddCategory}>
          <Ionicons name="add-circle" size={30} color="#2A7CF7" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No hay presupuestos definidos.</Text>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editingCategory ? "Editar Presupuesto" : "Nuevo Presupuesto"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Categoría (ej. Comida)"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <TextInput
              style={styles.input}
              placeholder="Monto Límite"
              value={newCategoryAmount}
              onChangeText={setNewCategoryAmount}
              keyboardType="numeric"
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleSaveCategory}
              >
                <Text style={styles.modalSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingBottom: 60 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16 },
  header: { padding: 20, paddingTop: 40, alignItems: 'center' },
  logoText: { fontSize: 24, fontWeight: '700', color: '#0f1530' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 15, color: '#0f1530' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10, alignItems: 'center' },
  subtitle: { fontSize: 18, fontWeight: '600', color: '#0f1530' },
  addButtonIcon: { padding: 5 },
  flatListContent: { paddingHorizontal: 20, paddingBottom: 20 },
  category: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f7f7f7', borderRadius: 12, padding: 15, marginBottom: 15, elevation: 2 },
  categoryExceeded: { borderWidth: 1, borderColor: 'red', backgroundColor: '#fff0f0' },
  categoryDetails: { flex: 1 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  categoryText: { fontSize: 16, fontWeight: '500', marginLeft: 8, color: '#0f1530' },
  amountBox: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#ededed', borderRadius: 8, padding: 8, marginTop: 5 },
  amountLabel: { fontSize: 12, color: '#666' },
  amount: { fontSize: 16, fontWeight: '600', color: '#0f1530' },
  categoryActions: { marginLeft: 10 },
  actionButton: { marginVertical: 5 },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#666' },
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { width: '85%', backgroundColor: "white", borderRadius: 20, padding: 25, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { height: 45, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 15, paddingHorizontal: 10 },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { borderRadius: 10, paddingVertical: 12, width: '48%', alignItems: 'center' },
  modalCancelButton: { backgroundColor: '#bfbfbf' },
  modalSaveButton: { backgroundColor: '#2A7CF7' },
  modalCancelText: { fontWeight: 'bold' },
  modalSaveText: { color: '#fff', fontWeight: 'bold' },
});