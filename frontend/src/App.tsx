import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FormularioSelector from './pages/FormularioSelector';
import FormModificacion from './pages/FormModificacion';
import FormIndividual from './pages/FormIndividual';
import FormAlta from './pages/FormAlta';
import LandingPage from './pages/LandingPage';
import ClavePrivada from './pages/ClavePrivada';
import RegisterForm from './pages/RegisterForm';
import './index.css';

// Componentes sencillos para los otros formularios
const FormActualizacion = () => (
  <div className="min-h-screen flex items-center justify-center">
    <h2 className="text-2xl">Formulario de Actualización de Datos</h2>
    {/* Este formulario se desarrollaría completo en una implementación real */}
  </div>
);

const FormConsulta = () => (
  <div className="min-h-screen flex items-center justify-center">
    <h2 className="text-2xl">Formulario de Consulta de Trámites</h2>
    {/* Este formulario se desarrollaría completo en una implementación real */}
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/clave" element={<ClavePrivada />} />
        <Route path="/register/form" element={<RegisterForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/formulario" element={<FormularioSelector />} />
        <Route path="/formulario/modificacion" element={<FormModificacion />} />
        <Route path="/formulario/individual" element={<FormIndividual />} />
        <Route path="/formulario/alta" element={<FormAlta />} />
        <Route path="/formulario/actualizacion" element={<FormActualizacion />} />
        <Route path="/formulario/consulta" element={<FormConsulta />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
