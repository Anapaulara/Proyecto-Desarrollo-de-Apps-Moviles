import React, { useState } from "react";
import PresupuestoScreen from "./Screens/PresupuestoScreen.js";
import RegistroScreen from "./Screens/RegistroScreen.js";
import RegistrosScreen from "./Screens/RegistrosScreen.js";
import GraficasScreen from "./Screens/GraficasScreen.js";
// import LoginScreen from "./Screens/LogInScreen.js";
// import PrincipalScreen from "./Screens/PrincipalScreen.js";
// import PerfilyConfiguraciones from "./Screens/PerfilyConfiguraciones.js";

export default function App() {
  // Pantalla inicial
  const [pantalla, setPantalla] = useState("Presupuesto");

  return (
    <>
      {pantalla === "Presupuesto" && (
        <PresupuestoScreen cambiarPantalla={setPantalla} />
      )}

      {pantalla === "Registro" && (
        <RegistroScreen cambiarPantalla={setPantalla} />
      )}

      {pantalla === "Registros" && (
        <RegistrosScreen cambiarPantalla={setPantalla} />
      )}

      {pantalla === "Graficas" && (
        <GraficasScreen cambiarPantalla={setPantalla} />
      )}

      
      {/* {pantalla === "Login" && <LoginScreen cambiarPantalla={setPantalla} />} */}
      {/* {pantalla === "Principal" && <PrincipalScreen cambiarPantalla={setPantalla} />} */}
      {/* {pantalla === "Perfil" && <PerfilyConfiguraciones cambiarPantalla={setPantalla} />} */}
    </>
  );
}
