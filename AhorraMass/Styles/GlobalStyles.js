import { StyleSheet } from "react-native";

export default StyleSheet.create ({
    


    // Estilos para los modal
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
})