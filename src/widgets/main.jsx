import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import Students from "../pages/Students.jsx";
import Teaching from "../pages/Teaching.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* App ahora funciona como layout para todas las rutas hijas */}
        <Route path="/" element={<App />}>
          {/* Rutas anidadas que heredan el layout */}
          <Route index element={<div>Página de inicio</div>} />
          <Route path="students" element={<Students />} />
          <Route path="teachings" element={<Teaching />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);