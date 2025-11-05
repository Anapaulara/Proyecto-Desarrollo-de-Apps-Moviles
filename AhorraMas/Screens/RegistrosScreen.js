import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../assets/Recursos/logo.png';

// Key para AsyncStorage
const STORAGE_KEY = '@ahorra_registros_v1';

// Valores por defecto
const defaultRegistros = [
  { id: 1, titulo: 'Alimentos', categoria: 'Comida', tipo: 'Gasto', monto: -2500, fecha: '2025-11-01', nota: 'Supermercado' },
  { id: 2, titulo: 'Cine', categoria: 'Entretenimiento', tipo: 'Ingreso', monto: 500, fecha: '2025-11-02', nota: 'Devolución' },
  { id: 3, titulo: 'Medicinas', categoria: 'Salud', tipo: 'Gasto', monto: -1500, fecha: '2025-11-03', nota: 'Farmacia' },
];

// Habilitar LayoutAnimation en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RegistrosScreen() {
  const [screen, setScreen] = useState('list');
  const [registros, setRegistros] = useState([]);
  const [selected, setSelected] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('Gasto');
  const [categoria, setCategoria] = useState('Otros');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [nota, setNota] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    load();
    Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    save();
  }, [registros]);

  async function load() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setRegistros(JSON.parse(raw));
      else setRegistros(defaultRegistros);
    } catch (e) {
      console.warn('Error cargando registros', e);
      setRegistros(defaultRegistros);
    }
  }

  async function save() {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
    } catch (e) {
      console.warn('Error guardando registros', e);
    }
  }

  function agregarRegistro() {
    if (!titulo.trim() || !monto.toString().trim()) {
      Alert.alert('Error', 'Título y monto son obligatorios');
      return;
    }

    const m = Number(monto);
    if (isNaN(m)) {
      Alert.alert('Error', 'El monto debe ser un número');
      return;
    }

    const nuevo = {
      id: Date.now(),
      titulo: titulo.trim(),
      categoria: categoria || 'Otros',
      tipo: tipo,
      monto: tipo === 'Gasto' ? -Math.abs(m) : Math.abs(m),
      fecha: fecha,
      nota: nota.trim(),
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRegistros(prev => [nuevo, ...prev]);

    setTitulo('');
    setMonto('');
    setTipo('Gasto');
    setCategoria('Otros');
    setFecha(new Date().toISOString().slice(0, 10));
    setNota('');

    setScreen('list');
  }

  function eliminarRegistro(id) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRegistros(prev => prev.filter(r => r.id !== id));
    setScreen('list');
  }

  function abrirDetalle(item) {
    setSelected(item);
    setScreen('detail');
  }

  const totalIngresos = registros.filter(r => r.monto > 0).reduce((s, r) => s + r.monto, 0);
  const totalEgresos = registros.filter(r => r.monto < 0).reduce((s, r) => s + r.monto, 0);
  const balance = totalIngresos + totalEgresos;

  const categorias = registros.reduce((acc, r) => {
    const key = r.categoria || 'Otros';
    acc[key] = (acc[key] || 0) + Math.abs(r.monto);
    return acc;
  }, {});

  function Header() {
    return (
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => setScreen('list')}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logoImage} />
          <Text style={styles.logoText}>Ahorra</Text>
          <Text style={styles.logoPlus}>+</Text>
          <Text style={styles.logoSub}> App</Text>
        </View>

        <TouchableOpacity onPress={() => Alert.alert('Filtros', 'Aquí puedes aplicar filtros (próximamente)')}>
          <Ionicons name="filter" size={26} color="#000" />
        </TouchableOpacity>
      </View>
    );
  }

  function ListView() {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Header />
        <Text style={styles.tituloSeccion}>Registros</Text>

        <View style={styles.cardBackground}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
            {registros.length === 0 && (
              <View style={{ padding: 20 }}>
                <Text style={{ textAlign: 'center', color: '#555' }}>No hay registros aún. Agrega uno con +</Text>
              </View>
            )}

            {registros.map(item => (
              <TouchableOpacity key={item.id} style={styles.item} onPress={() => abrirDetalle(item)}>
                <FontAwesome5 name={item.tipo === 'Gasto' ? 'shopping-bag' : 'hand-holding-dollar'} size={20} color="#000" style={styles.icon} />
                <View style={styles.itemText}>
                  <Text style={styles.itemTitle}>{item.titulo}</Text>
                  <Text style={styles.itemSubtitle}>{item.categoria} • {item.fecha}</Text>
                </View>
                <Text style={[styles.amount, { color: item.monto < 0 ? '#b30000' : '#008000' }]}>
                  {item.monto < 0 ? `-$${Math.abs(item.monto)}` : `+$${item.monto}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Botón + abajo, no flotante */}
        <TouchableOpacity style={styles.addButtonBottom} onPress={() => setScreen('add')}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>

        <Navbar />
      </Animated.View>
    );
  }

  function AddView() {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.tituloSeccion}>Agregar Registro</Text>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
          <Text style={styles.label}>Título</Text>
          <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ej. Cena" />

          <Text style={styles.label}>Monto</Text>
          <TextInput style={styles.input} value={monto} onChangeText={setMonto} placeholder="Ej. 1500" keyboardType="numeric" />

          <Text style={styles.label}>Tipo</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <TouchableOpacity style={[styles.tipoBtn, tipo === 'Gasto' && styles.tipoActivo]} onPress={() => setTipo('Gasto')}>
              <Text style={tipo === 'Gasto' ? styles.tipoTxtActivo : styles.tipoTxt}>Gasto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tipoBtn, tipo === 'Ingreso' && styles.tipoActivo]} onPress={() => setTipo('Ingreso')}>
              <Text style={tipo === 'Ingreso' ? styles.tipoTxtActivo : styles.tipoTxt}>Ingreso</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Categoría</Text>
          <TextInput style={styles.input} value={categoria} onChangeText={setCategoria} placeholder="Ej. Alimentos" />

          <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
          <TextInput style={styles.input} value={fecha} onChangeText={setFecha} placeholder="2025-11-04" />

          <Text style={styles.label}>Nota</Text>
          <TextInput style={[styles.input, { height: 80 }]} value={nota} onChangeText={setNota} placeholder="Detalle..." multiline />

          <TouchableOpacity style={[styles.primaryBtn, { marginTop: 8 }]} onPress={agregarRegistro}>
            <Text style={styles.primaryBtnText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.secondaryBtn, { marginTop: 8 }]} onPress={() => setScreen('list')}>
            <Text style={styles.secondaryTxt}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>

        <Navbar />
      </View>
    );
  }

  function DetailView() {
    if (!selected) return setScreen('list');
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.tituloSeccion}>Detalle</Text>

        <View style={{ padding: 16 }}>
          <Text style={styles.detailTitle}>{selected.titulo}</Text>
          <Text style={styles.detailSubtitle}>{selected.categoria} • {selected.fecha}</Text>
          <Text style={[styles.detailAmount, { color: selected.monto < 0 ? '#b30000' : '#008000' }]}>
            {selected.monto < 0 ? `-$${Math.abs(selected.monto)}` : `+$${selected.monto}`}
          </Text>
          <Text style={{ marginTop: 12 }}>{selected.nota || '—'}</Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert('Editar', 'Edición próximamente')}>
              <Text style={styles.primaryBtnText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                Alert.alert('Eliminar', '¿Eliminar este registro?', [
                  { text: 'Cancelar' },
                  { text: 'Eliminar', style: 'destructive', onPress: () => eliminarRegistro(selected.id) },
                ]);
              }}
            >
              <Text style={styles.deleteTxt}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Navbar />
      </View>
    );
  }

  function ChartView() {
    const total = Object.values(categorias).reduce((s, v) => s + v, 0) || 1;
    const entries = Object.entries(categorias).sort((a, b) => b[1] - a[1]);

    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.tituloSeccion}>Gráficas</Text>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 160 }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>Balance: ${balance}</Text>
          <Text style={{ color: '#555', marginBottom: 8 }}>
            Ingresos: ${totalIngresos}   Egresos: ${Math.abs(totalEgresos)}
          </Text>

          {entries.length === 0 && <Text>No hay datos para graficar.</Text>}

          {entries.map(([cat, val]) => {
            const pct = Math.round((val / total) * 100);
            return (
              <View key={cat} style={{ marginBottom: 12 }}>
                <Text style={{ fontWeight: '600' }}>{cat} — ${val} ({pct}%)</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: `${pct}%` }]} />
                </View>
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity style={styles.addButtonBottom} onPress={() => setScreen('add')}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>

        <Navbar />
      </View>
    );
  }

  function Navbar() {
    return (
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => setScreen('list')}>
          <Ionicons name="home-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setScreen('chart')}>
          <Ionicons name="pie-chart-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setScreen('add')}>
          <Ionicons name="add-circle-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert('Perfil', 'Perfil (próximamente)')}>
          <Ionicons name="person-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'add') return <AddView />;
  if (screen === 'detail') return <DetailView />;
  if (screen === 'chart') return <ChartView />;
  return <ListView />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 17,
    paddingTop: 45,
  },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoText: { fontSize: 22, fontWeight: 'bold', color: '#002060' },
  logoPlus: { fontSize: 22, fontWeight: 'bold', color: '#00A3FF' },
  logoSub: { fontSize: 16, color: '#00A3FF' },

  tituloSeccion: {
    fontSize: 26, fontWeight: 'bold', color: '#002060', alignSelf: 'center', marginBottom: 8,
  },

  cardBackground: {
    backgroundColor: '#D9D9D9', borderRadius: 25, margin: 15, padding: 10, flex: 1,
  },

  item: {
    backgroundColor: '#E6E6E6', borderRadius: 25, padding: 12, marginBottom: 13,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },

  icon: { marginRight: 10, marginLeft: 5 },
  itemText: { flex: 1 },
  itemTitle: { fontSize: 18, fontWeight: '600', color: '#002060' },
  itemSubtitle: { fontSize: 13, color: '#555' },
  amount: { fontSize: 18, fontWeight: '700' },

  addButtonBottom: {
    backgroundColor: '#001A72',
    height: 60,
    width: '90%',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  addText: { fontSize: 34, color: '#fff', lineHeight: 34 },

  navbar: {
    backgroundColor: '#001A72',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },

  logoImage: {
    width: 32,
    height: 32,
    marginRight: 6,
    resizeMode: 'contain'
  },

  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10, marginBottom: 10,
  },
  label: { marginBottom: 6, fontWeight: '600', color: '#333' },
  primaryBtn: { backgroundColor: '#001A72', padding: 12, borderRadius: 10, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: { borderWidth: 1, borderColor: '#001A72', padding: 12, borderRadius: 10, alignItems: 'center' },
  secondaryTxt: { color: '#001A72', fontWeight: '700' },
  tipoBtn: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8 },
  tipoActivo: { backgroundColor: '#001A72' },
  tipoTxt: { color: '#333' },
  tipoTxtActivo: { color: '#fff' },

  detailTitle: { fontSize: 22, fontWeight: '700', color: '#002060' },
  detailSubtitle: { color: '#666', marginTop: 6 },
  detailAmount: { fontSize: 28, fontWeight: '800', marginTop: 12 },
  deleteBtn: { borderWidth: 1, borderColor: '#b30000', padding: 12, borderRadius: 10, alignItems: 'center' },
  deleteTxt: { color: '#b30000', fontWeight: '700' },

  barBg: { backgroundColor: '#eee', height: 18, borderRadius: 9, marginTop: 4 },
  barFill: { backgroundColor: '#001A72', height: 18, borderRadius: 9 },
});
