import React, { useState } from "react";
import PresupuestoScreen from "./Screens/PresupuestoScreen.js";
import RegistroScreen from "./Screens/RegistroScreen.js";
<<<<<<< HEAD
import LoginScreen from "./Screens/LogInScreen.js";
import PrincipalScreen from "./Screens/PrincipalScreen.js";
import PerfilyConfiguraciones from "./Screens/PerfilScreen.js";
=======

// import LoginScreen from "./Screens/LogInScreen.js";
// import PrincipalScreen from "./Screens/PrincipalScreen.js";
// import PerfilyConfiguraciones from "./Screens/PerfilyConfiguraciones.js";
>>>>>>> 2c788780edf3722035628bf7c6dffa1f255d0916

export default function App() {
  const [pantalla, setPantalla] = useState("Presupuesto");

  return (
    <>

      {pantalla === "Presupuesto" && (
        <PresupuestoScreen cambiarPantalla={setPantalla} />
      )}

      {pantalla === "Registro" && (
        <RegistroScreen cambiarPantalla={setPantalla} />
      )}

<<<<<<< HEAD
      {pantalla === "Login" && <LoginScreen cambiarPantalla={setPantalla} />}
      {pantalla === "Principal" && <PrincipalScreen cambiarPantalla={setPantalla} />} 
      {pantalla === "Perfil" && <PerfilyConfiguraciones cambiarPantalla={setPantalla} />}
      </>
      );
}
=======
      {/* {pantalla === "Login" && <LoginScreen cambiarPantalla={setPantalla} />} */}
      {/* {pantalla === "Principal" && <PrincipalScreen cambiarPantalla={setPantalla} />} */}
      {/* {pantalla === "Perfil" && <PerfilyConfiguraciones cambiarPantalla={setPantalla} />} */}
    </>
  );
}
>>>>>>> 2c788780edf3722035628bf7c6dffa1f255d0916
