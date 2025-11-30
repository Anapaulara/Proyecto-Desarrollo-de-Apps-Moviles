import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Alert, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const STORAGE_KEY = '@presupuesto_categories';
const initialCategories = [
  { id: '1', name: 'Canasta Básica', icon: 'shopping-cart', amount: 150.00, iconType: 'MaterialIcons' },
  { id: '2', name: 'Salud', icon: 'heart-outline', amount: 50.00, iconType: 'Ionicons' },
  { id: '3', name: 'Entretenimiento', icon: 'play-circle', amount: 30.00, iconType: 'FontAwesome5' },
];

export default function PresupuestoScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryAmount, setNewCategoryAmount] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = async () => {
    try {
      const storedCategories = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCategories !== null) {
        setCategories(JSON.parse(storedCategories));
      } else {
        setCategories(initialCategories);
      }
    } catch (e) {
      console.error("Error al cargar categorías: ", e);
      setCategories(initialCategories);
    } finally {
      setLoading(false);
    }
  };

  const saveCategories = async (newCategories) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCategories));
    } catch (e) {
      console.error("Error al guardar categorías: ", e);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveCategories(categories);
    }
  }, [categories, loading]);

  const handleUpdateCategories = (newCategories) => {
    setCategories(newCategories);
  };

  const handleSaveCategory = () => {
    if (!newCategoryName || !newCategoryAmount) {
      Alert.alert("Error", "Debes ingresar un nombre y un monto.");
      return;
    }

    const amountValue = parseFloat(newCategoryAmount);
    if (isNaN(amountValue)) {
      Alert.alert("Error", "El monto debe ser un número válido.");
      return;
    }

    let updatedCategories;

    if (editingCategory) {
      updatedCategories = categories.map(cat => 
        cat.id === editingCategory.id
          ? { ...cat, name: newCategoryName, amount: amountValue }
          : cat
      );
      Alert.alert("Éxito", "Categoría actualizada.");
    } else {
      const newCategory = {
        id: Date.now().toString(),
        name: newCategoryName,
        amount: amountValue,
        icon: 'folder-outline',
        iconType: 'Ionicons',
      };
      updatedCategories = [...categories, newCategory];
      Alert.alert("Éxito", "Categoría creada.");
    }

    handleUpdateCategories(updatedCategories);

    setModalVisible(false);
    setNewCategoryName('');
    setNewCategoryAmount('');
    setEditingCategory(null);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que quieres eliminar esta categoría?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Eliminar", 
          onPress: () => {
            const updatedCategories = categories.filter(cat => cat.id !== id);
            handleUpdateCategories(updatedCategories);
            Alert.alert("Éxito", "Categoría eliminada.");
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleDeleteAll = () => {
    if (categories.length === 0) {
      Alert.alert("Información", "No hay presupuestos para eliminar.");
      return;
    }

    Alert.alert(
      "Confirmar Eliminación Total",
      "¡Cuidado! ¿Estás seguro de que quieres eliminar TODOS los presupuestos?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Eliminar Todo", 
          onPress: () => {
            handleUpdateCategories([]);
            Alert.alert("Éxito", "Todos los presupuestos han sido eliminados.");
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryAmount(category.amount.toString());
    setModalVisible(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryAmount('');
    setModalVisible(true);
  };

  const renderCategoryItem = ({ item }) => {
    const IconComponent = item.iconType === 'MaterialIcons' ? MaterialIcons : 
                          item.iconType === 'FontAwesome5' ? FontAwesome5 : 
                          Ionicons;

    return (
      <View style={styles.category}>
        <View style={styles.categoryDetails}>
          <View style={styles.categoryHeader}>
            <IconComponent name={item.icon} size={24} color="#0f1530" />
            <Text style={styles.categoryText}>{item.name}</Text>
          </View>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Monto</Text>
            <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
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
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Perfil")}>
          <Ionicons name="arrow-back" size={24} color="#0f1530" />
        </TouchableOpacity>
        <Text style={styles.logoText}>Ahorra<Text style={{ color: '#2A7CF7' }}>+</Text> App</Text>
      </View>

      <Text style={styles.title}>Presupuesto</Text>
      
      <View style={styles.listHeader}>
        <Text style={styles.subtitle}>Categorías</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.deleteAllButton} onPress={handleDeleteAll}>
            <MaterialIcons name="delete-sweep" size={24} color="#D32F2F" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
            <Ionicons name="add-circle" size={30} color="#2A7CF7" />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flatListContent}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No hay categorías de presupuesto añadidas. ¡Agrega una!</Text>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setEditingCategory(null);
          setNewCategoryName('');
          setNewCategoryAmount('');
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre de la Categoría"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <TextInput
              style={styles.input}
              placeholder="Monto Presupuestado"
              value={newCategoryAmount}
              onChangeText={setNewCategoryAmount}
              keyboardType="numeric"
            />
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingCategory(null);
                  setNewCategoryName('');
                  setNewCategoryAmount('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={handleSaveCategory}
              >
                <Text style={styles.modalSaveText}>{editingCategory ? "Actualizar" : "Guardar"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0f1530',
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20 
  },
  logoText: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginLeft: 10, 
    color: '#0f1530' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    textAlign: 'center', 
    color: '#0f1530',
    marginBottom: 10,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  subtitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#0f1530' 
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteAllButton: {
    marginRight: 10,
    padding: 5,
  },
  addButton: {
  },
  flatListContent: { 
    paddingHorizontal: 20, 
    paddingBottom: 20 
  },
  category: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f7f7', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  categoryText: { 
    fontSize: 16, 
    fontWeight: '500', 
    marginLeft: 8, 
    color: '#0f1530' 
  },
  amountBox: {
    backgroundColor: '#ededed', 
    borderRadius: 10,
    paddingVertical: 8, 
    paddingHorizontal: 10,
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  amountLabel: { 
    fontSize: 16, 
    color: '#0f1530' 
  },
  amount: { 
    fontSize: 16, 
    fontWeight: '600',
    color: '#0f1530' 
  },
  categoryActions: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  actionButton: {
    marginLeft: 10,
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "stretch",
    elevation: 5,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f1530',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    borderRadius: 10, 
    paddingVertical: 12, 
    width: '48%', 
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#bfbfbf', 
  },
  modalSaveButton: {
    backgroundColor: '#2A7CF7', 
  },
  modalCancelText: { 
    color: '#0f1530', 
    fontWeight: 'bold' 
  },
  modalSaveText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
});