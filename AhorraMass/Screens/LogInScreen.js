import React, { useState } from 'react';
import { Pressable , View, Text, StyleSheet, TextInput, Button, Alert, Modal, TouchableOpacity } from 'react-native';
import PrincipalScreen from './PrincipalScreen';
import SignInScreen from './SignInScreen';

export default function LogInScreen() {
  const [contrasena, setContrasena] = useState('');
  const [mail, setMail] = useState('');
  const [SignIn, setSignIn] = useState(false);
  const [showPrincipal, setShowPrincipal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [NewPassword, SetNewPassword] = useState('');
  const [CNewPassword, setCNewPassword] = useState('');
const botonGuardar = () => {
        if (!NewPassword || !CNewPassword) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (NewPassword !== CNewPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(NewPassword)) {
        Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
        return;
    }

    setModalVisible(false);
  SetNewPassword('');
  setCNewPassword('');
    };
  const botonCerrar = () => {setModalVisible(false); SetNewPassword(''); setCNewPassword('');};


  const mostrarAlerta = () => {
    if (mail.trim() === '' || contrasena.trim() === '') {
      Alert.alert("Error", "Por favor, ingresa todos los campos correctamente.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(mail)) {
      Alert.alert("Error", "Por favor, ingresa un correo electrónico válido.");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(contrasena)) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
      return;
    }

 setShowPrincipal(true);
      
  };

  if (SignIn) {
        return <SignInScreen/>;
      }

 if (showPrincipal) {
  return <PrincipalScreen />;
}

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ahorra+</Text>

      <View style={styles.mainOverlay}>
        <Text style={styles.welcome}>Bienvenido a Ahorra+!</Text>
        <Text style={styles.splashTitle}>Inicio de sesión</Text>

        <Text style={styles.splashSubtitle}>Correo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Gmail"
          placeholderTextColor="#bbb"
          value={mail}
          onChangeText={setMail}
          keyboardType="email-address"
        />

        <Text style={styles.splashSubtitle}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
        />
      </View>

      <View style={styles.button}>
      <Button title="Iniciar sesión" onPress={mostrarAlerta} color='#0f1344'/>
        </View>

        <Pressable
            onPress={() => setModalVisible(true)}
            style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1, }, ]} >
  <Text style={{ color: 'blue',  fontSize: 18, padding: 10, }}>
    No recuerdas tu contraseña?
  </Text>
</Pressable>

    <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={botonCerrar}>
        
        <View style={styles.modalContenedor}>
          
          <View style={styles.modalVista}>
            
            <Text style={styles.modalTitulo}>Renovar contraseña</Text>

            <TextInput style={styles.modalInput} placeholder="Escribe tu Contraseña nueva" placeholderTextColor="#888" value={NewPassword} onChangeText= {SetNewPassword}/>
            <TextInput style={styles.modalInput} placeholder="Confirmar contraseña" placeholderTextColor="#888" value={CNewPassword} onChangeText={setCNewPassword}/>

            <View style={styles.modalBotones}>
              
              <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={botonCerrar}>
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.botonBase, styles.botonGuardar]} onPress={botonGuardar}>
                <Text style={styles.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>

      </Modal>


      <View style={styles.switchRow}>
          <Text style={styles.splashSubtitle}>No tienes una cuenta?</Text>
         <Button title="Registrate" color="#1a26aaff" onPress={()=>setSignIn(true)}/>
        </View>

      <View style={styles.pie}></View>
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
    padding: 35,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  titulo: {
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: 40,
    color: '#0f1344',
  },
  mainOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(47, 127, 255, 0.26)',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    marginTop: 30,
    marginBottom: 30,
  },
  welcome: {
    color: '#000',
    fontSize: 22,
    marginBottom: 20,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'space-evenly',
    width: '100%',
    borderRadius: 8,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    width: '80%',
    padding: 10,
    marginBottom: 15,
    color: '#000',
  },
  splashTitle: {
    color: '#000',
    fontSize: 26,
    fontWeight: '700',
  },
  splashSubtitle: {
    color: '#333',
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderRadius: 8,
  },
  modalContenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modalVista: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20, 
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24, 
    color: '#1F2937', 
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderColor: '#E5E7EB', 
    borderWidth: 1,
    borderRadius: 10, 
    paddingHorizontal: 15,
    marginBottom: 20, 
    backgroundColor: '#F9FAFB', 
    color: '#1F2937', 
    fontSize: 16,
  },
  switchContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
  },
  switchTexto: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 12,
    color: '#6B7280',
  },
  switchTextoActivoVerde: {
    color: '#22C55E',
    fontWeight: 'bold',
  },
  switchTextoActivoRojo: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  botonBase: {
    flex: 1, 
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 6, 
  },
  botonGuardar: {
    backgroundColor: '#007AFF',
  },
  botonGuardarTexto: {
    color: '#FFFFFF', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  botonCancelar: {
    backgroundColor: '#F3F4F6', 
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  botonCancelarTexto: {
    color: '#374151', 
    fontWeight: 'bold',
    fontSize: 16,
  },
});
