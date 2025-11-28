import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Students from "../pages/Students.jsx";
import Teaching from "../pages/Teaching.jsx"
import Challenges from "../pages/Challenges.jsx";
import Attendance from "../pages/Attendance.jsx";
import StudentSelfRegister from "../pages/StudentSelfRegister.jsx";
import Classrooms from "../pages/Classrooms.jsx";
import WeeklyCalendar from "../components/WeeklyCalendar";
import EvaluationPage from "../pages/Evaluation.jsx";
import Invitations from "../pages/Invitations.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* App ahora funciona como layout para todas las rutas hijas */}
        <Route path="/" element={<App />}>
          {/* Rutas anidadas que heredan el layout */}
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="teaching" element={<Teaching />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="classrooms" element={<Classrooms />} />
          <Route path="classroom-schedule" element={<WeeklyCalendar />} />
          <Route path="evaluationPage" element={<EvaluationPage />} />
          <Route path="invitations" element={<Invitations />} />
        </Route>
        {/* Ruta independiente sin layout para auto-registro */}
        <Route path="/register" element={<StudentSelfRegister />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);