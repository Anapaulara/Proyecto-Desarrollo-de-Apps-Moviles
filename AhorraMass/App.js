import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LogInScreen from "./Screens/LogInScreen";
import SignInScreen from "./Screens/SignInScreen";
import PrincipalScreen from "./Screens/PrincipalScreen";
import RegScreens from "./Screens/RegScreens";
import GraficasScreen from "./Screens/GraficasScreen";
import PerfilScreen from "./Screens/PerfilScreen";
import BottomMenu from "./Screens/BottomMenu";
import PresupuestoScreen from "./Screens/PresupuestoScreen";
import RecuperarPasswordScreen from "./Screens/RecuperarPasswordScreen";
import TarjetasBancosScreen from './Screens/TarjetasBancosScreen';
import PrivacidadDatosScreen from './Screens/PrivacidadDatosScreen';

import TransaccionesService from "./src/services/TransaccionesService";
import AuthService from "./src/services/AuthService";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // inicializar DBs (sync API)
    TransaccionesService.initialize();
    AuthService.initialize();
    console.log("Bases inicializadas");
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Principal" component={PrincipalScreen} />
        <Stack.Screen name="Registros" component={RegScreens} />
        <Stack.Screen name="Graficas" component={GraficasScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="BottomMenu" component={BottomMenu} />
        <Stack.Screen name="Presupuesto" component={PresupuestoScreen} />
        <Stack.Screen name="Recuperar" component={RecuperarPasswordScreen} />
        <Stack.Screen name="TarjetasBancos" component={TarjetasBancosScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PrivacidadDatos" component={PrivacidadDatosScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
