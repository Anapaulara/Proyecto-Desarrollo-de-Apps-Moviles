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

import AuthService from "./src/services/AuthService";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    AuthService.initialize();
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
