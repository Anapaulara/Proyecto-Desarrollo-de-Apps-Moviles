import React, { useState } from "react";
import PresupuestoScreen from "./Screens/PresupuestoScreen.js";
import RegistrosScreen from "./Screens/RegistrosScreen.js";
import PrincipalScreen from "./Screens/PrincipalScreen.js";
import GraficasScreen from "./Screens/GraficasScreen.js";

export default function App() {
  const [pantalla, setPantalla] = useState("Principal");

  return (
    <>
      {pantalla === "Principal" && (
        <PrincipalScreen cambiarPantalla={setPantalla} />
      )}

      {pantalla === "Presupuesto" && (
        <PresupuestoScreen cambiarPantalla={setPantalla} />
      )}

      {pantalla === "Registro" && (
        <RegistrosScreen cambiarPantalla={setPantalla} />
      )}

      {pantalla === "Graficas" && ( 
        <GraficasScreen cambiarPantalla={setPantalla} />
      )}
    </>
  );
}
