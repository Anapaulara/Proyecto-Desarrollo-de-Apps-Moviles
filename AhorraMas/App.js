import React, { useState } from "react";

import LoginScreen from "./Screens/LogInScreen";
import PrincipalScreen from "./Screens/PrincipalScreen";
import PresupuestoScreen from "./Screens/PresupuestoScreen";
import RegistroScreen from "./Screens/RegistroScreen";
import PerfilyConfiguraciones from "./Screens/PerfilyConfiguraciones";

export default function App() {
  const [pantalla, setPantalla] = useState("Login"); 

  return (
    <>
      {pantalla === "Login" && (
        <LoginScreen cambiarPantalla={setPantalla} />
      )}

      {pantalla === "Principal" && (
        <PrincipalScreen cambiarPantalla={setPantalla} />
      )}

      {pantalla === "Presupuesto" && (
        <PresupuestoScreen cambiarPantalla={setPantalla} />
      )}

      {pantalla === "Registro" && (
        <RegistroScreen cambiarPantalla={setPantalla} />
      )}

      {pantalla === "Perfil" && (
        <PerfilyConfiguraciones cambiarPantalla={setPantalla} />
      )}
    </>
  );
}
