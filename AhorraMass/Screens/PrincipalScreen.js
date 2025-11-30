import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BottomMenu from "./BottomMenu";
import GoalCard from "./GoalCard";

export default function PrincipalScreen() {
  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Hola, User.</Text>
        </View>
        <View style={styles.saldoActualCard}>
          <Text style={styles.saldoLabel}>Saldo Actual</Text>
          <Text style={styles.saldoMonto}>$1,852.00</Text>
        </View>

        <Text style={styles.subtituloMetas}>Mis Compras Fuertes.</Text>
        <GoalCard
          title="Sala Nueva"
          currentAmount="2500"
          targetAmount="5,000"
          percentage={50}

        />

        <GoalCard
          title="Camioneta Sierra"
          currentAmount="100,000"
          targetAmount="1,070,200"
          percentage={9.34}

        />

        <View style={styles.Contenido}>
          <View style={styles.ContenidoIngresos}>
            <Text style={styles.txtIngresos}>Ingresos</Text>
            <Text style={styles.NoIngresos}>$500.00</Text>
          </View>
          <View style={styles.ContenidoEgresos}>
            <Text style={styles.txtEgresos}>Egresos</Text>
            <Text style={styles.NoEgresos}>$150.00</Text>
          </View>
          <View style={styles.ContenidoPred}>
            <Text style={styles.txtPred}>Ahorros</Text>
            <Text style={styles.NoPred}>$100.00</Text>
          </View>
          <View style={styles.ContenidoPred}>
            <Text style={styles.txtPred}>Límite</Text>
            <Text style={styles.NoPred}>$50.00</Text>
          </View>
        </View>
        <Text style={styles.subtitulo}>Novedades:</Text>
        <View style={styles.box}>
          <Text style={styles.novedadTitle}>Transferencia Recibida</Text>
          <Text style={styles.novedadDetail}>+$100.00 (Nómina)</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.novedadTitle}>Pago de Servicio</Text>
          <Text style={styles.novedadDetail}>-$40.00 (Electricidad)</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.novedadTitle}>Ahorro Automático</Text>
          <Text style={styles.novedadDetail}>-$10.00 (Fondo de Emergencia)</Text>
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 100,

  },
  header: {
    width: '90%',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  saldoActualCard: {
    backgroundColor: '#f6f6f6ff',
    width: '90%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  saldoLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  saldoMonto: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#0D074D',
  },

  Contenido: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  ContenidoIngresos: {
    alignItems: 'center',
    backgroundColor: '#48ff54b3',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    marginBottom: 15,
  },
  ContenidoEgresos: {
    alignItems: 'center',
    backgroundColor: '#ff4747b3',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    marginBottom: 15,
  },
  ContenidoPred: {
    alignItems: 'center',
    backgroundColor: '#f6f6f6ff',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    marginBottom: 15,
    borderColor: '#0D074D',
    borderWidth: 2,
  },
  txtPred: {
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#0D074D',
    fontSize: 20,
    position: 'relative',
    top: -10,
  },
  NoPred: {
    fontFamily: 'Arial',
    color: '#0D074D',
    fontSize: 28,
    position: 'relative',
    top: -5
  },
  txtIngresos: {
  fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#0e4101ff',
    fontSize: 20,
    position: 'relative',
    top: -10,
  },
  NoIngresos: {
    fontFamily: 'Arial',
    color: '#0e4101ff',
    fontSize: 28,
    position: 'relative',
    top: -5,
  },

  txtEgresos: {
    fontFamily: 'Arial',
    fontWeight: 'bold',
    color: '#700000ff',
    fontSize: 20,
    position: 'relative',
    top: -10,
  },

  NoEgresos: {
    fontFamily: 'Arial',
    color: '#700000ff',
    fontSize: 28,
    position: 'relative',
    top: -5,
  },

  titulo: {
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: 35,
  },
  subtitulo: {
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: 20,
    width: '90%',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 5,
  },
  subtituloMetas: {
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: 20,
    width: '90%',
    textAlign: 'left',
    marginBottom: 5,
  },

  box: {
    backgroundColor: '#dededeff',
    width: '90%',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  novedadTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#0D074D',
  },
  novedadDetail: {
    fontSize: 14,
    color: '#666',
  },
});