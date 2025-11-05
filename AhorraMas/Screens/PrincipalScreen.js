import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PerfilScreen from './PerfilScreen';


export default function PrincipalScreen() {
  const [mostrarPerfil, setMostrarPerfil] = React.useState(false);

  if (mostrarPerfil) {
  return <PerfilScreen />;
}

  return (

    <View style={styles.container}>
        <Text style={styles.titulo}>Bienvenido, User</Text>
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
        <Text style={styles.txtPred}>Limite</Text>
        <Text style={styles.NoPred}>$50.00</Text>
        </View>
        </View>

        <Text style={styles.subtitulo}>Novedades:</Text>

        <View style={styles.box}>

        </View>
        <View style={styles.box}>
            
        </View>
        <View style={styles.box}>
            
        </View>

      <View style={styles.pie}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('¡Botón Casa!')}
        >
          <Image
            source={require('../assets/Images/HouseIcon.png')} 
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('¡Botón Registro!')}
        >
          <Image
            source={require('../assets/Images/RegistroIcon.png')} 
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert('¡Botón Graficas!')}
        >
          <Image
            source={require('../assets/Images/GraficaIcon.png')} 
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setMostrarPerfil(true)}
        >
        <Image
          source={require('../assets/Images/UsuarioIcon.png')} 
          style={styles.icon}
        />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#ffffff',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingTop: 40,
},
  pie: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    backgroundColor: '#0f1344',
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    borderRadius: 10,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
 Contenido: {
  alignItems: 'center',
  backgroundColor: '#ffffffff',
  width: '100%',
  padding: 10,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
},
  ContenidoIngresos: {
  alignItems: 'center',
  backgroundColor: '#48ff54b3',
  width: '45%',
  aspectRatio: 1, 
  borderRadius: 15,
  justifyContent: 'center',
},
ContenidoEgresos: {
  alignItems: 'center',
  backgroundColor: '#ff4747b3',
  width: '45%',
  aspectRatio: 1,
  borderRadius: 15,
  justifyContent: 'center',
  marginVertical: 5,
},
ContenidoPred: {
  alignItems: 'center',
  backgroundColor: '#f6f6f6ff',
  width: '45%',
  aspectRatio: 1,
  borderRadius: 15,
  justifyContent: 'center',
  marginVertical: 10,
  borderColor: '#0D074D',
  borderWidth: 2,
},
txtPred: {
  fontFamily: 'Arial',
  fontWeight: 'bold',
  color: '#0D074D',
  fontSize: 25,
  marginVertical: '15',
  top: '0',
  position: 'absolute',
  },
  NoPred: {
  fontFamily: 'Arial',
  color: '#0D074D',
  fontSize: 30,
  top: '70',
  position: 'absolute',
  },
txtIngresos: {
  fontFamily: 'Arial',
  fontWeight: 'bold',
  color: '#0e4101ff',
  fontSize: 25,
  marginVertical: '15',
  top: '0',
  position: 'absolute',
  },
NoIngresos: {
  fontFamily: 'Arial',
  color: '#0e4101ff',
  fontSize: 30,
  top: '70',
  position: 'absolute',
  },
txtEgresos: {
  fontFamily: 'Arial',
  fontWeight: 'bold',
  color: '#700000ff',
  fontSize: 25,
  marginVertical: '15',
  top: '0',
  position: 'absolute',
  },
  NoEgresos: {
  fontFamily: 'Arial',
  color: '#700000ff',
  fontSize: 30,
  top: '70',
  position: 'absolute',
  },
  titulo: {
  fontFamily: 'Arial',
  fontWeight: 'bold',
  fontSize: 40,
  },
  subtitulo: {
  fontFamily: 'Arial',
  fontWeight: 'bold',
  fontSize: 25,
  },
  box: {
    backgroundColor: '#dededeff',
    width: '90%',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

});
