import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";

import LogInScreen from "./Screens/LogInScreen";
import SignInScreen from "./Screens/SignInScreen";
import PrincipalScreen from "./Screens/PrincipalScreen";
import RegScreens from "./Screens/RegScreens";
import GraficasScreen from "./Screens/GraficasScreen";
import PerfilScreen from "./Screens/PerfilScreen";
import PresupuestoScreen from "./Screens/PresupuestoScreen";
import RecuperarPasswordScreen from "./Screens/RecuperarPasswordScreen";
import TarjetasBancosScreen from './Screens/TarjetasBancosScreen';
import PrivacidadDatosScreen from './Screens/PrivacidadDatosScreen';

import TransaccionesService from "./src/services/TransaccionesService";
import AuthService from "./src/services/AuthService";
import PresupuestosService from "./src/services/PresupuestosService";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000033",
          borderTopWidth: 0,
          paddingVertical: 5,
          height: 60,
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#8888aa",
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="PrincipalTab"
        component={PrincipalScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="RegistrosTab"
        component={RegScreens}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="folder" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="GraficasTab"
        component={GraficasScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PresupuestoTab"
        component={PresupuestoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    // inicializar DBs (sync API)
    const initDB = async () => {
      try {
        await TransaccionesService.initialize();
        await AuthService.initialize();
        await PresupuestosService.initialize();
        console.log("Bases inicializadas");
      } catch (e) {
        console.error("Error init DB", e);
      }
    };
    initDB();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Auth Flow */}
        <Stack.Screen name="LogIn" component={LogInScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Recuperar" component={RecuperarPasswordScreen} />

        {/* Main App via Tabs */}
        <Stack.Screen name="Main" component={MainTabs} />

        {/* Other screens */}
        <Stack.Screen name="TarjetasBancos" component={TarjetasBancosScreen} />
        <Stack.Screen name="PrivacidadDatos" component={PrivacidadDatosScreen} />

        {/* Backwards compatibility aliases if logic inside screens navigates here */}
        <Stack.Screen name="Principal" component={MainTabs} />
        <Stack.Screen name="Registros" component={MainTabs} />
        <Stack.Screen name="Graficas" component={MainTabs} />
        <Stack.Screen name="Perfil" component={MainTabs} />
        <Stack.Screen name="Presupuesto" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
