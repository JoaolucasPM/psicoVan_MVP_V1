import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Patients from "./pages/Patients";
import CreatePatient from "./pages/CreatePatient";
import CreateTraining from "./pages/CreateTraining";
import PatientTrainings from "./pages/PatientTrainings";
import CognifitGame from "./pages/CognifitGame";
import PatientLogin from "./pages/PatientLogin";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/paciente/login" element={<PatientLogin />} />

        <Route path="/pacientes" element={<Patients />} />

        <Route
          path="/pacientes/novo"
          element={<CreatePatient />}
        />

        <Route
          path="/avaliacoes/nova"
          element={<CreateTraining />}
        />

        <Route
          path="/paciente/:patientId/avaliacoes"
          element={<PatientTrainings />}
        />

        <Route
          path="/jogo/:patientId"
          element={<CognifitGame />}
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;