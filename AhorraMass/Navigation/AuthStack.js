import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogInScreen from "../Screens/LogInScreen";
import SignInScreen from "../Screens/SignInScreen";
import RecuperarPasswordScreen from "../Screens/RecuperarPasswordScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LogInScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="RecuperarPassword" component={RecuperarPasswordScreen} />
    </Stack.Navigator>
  );
}
