import React from 'react';
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import './App.css';

// --- IMPORTACIÓN DE PÁGINAS ---
import Principal from './pages/principal';
import InicioSesion from './pages/inicioSesion';
import Cuenta from './pages/cuenta';
import Registro from './pages/registro';
import Contacto from "./pages/contacto";
import Donaciones from "./pages/donaciones";   // <-- Nueva página
import HiloDetalle from "./pages/hiloDetalle"; // <-- Nueva página dinámica

// --- COMPONENTE NAVBAR ---
function Navbar() {
  return (
    <div className="navbar-wrapper">
      <nav className="navbar navbar-expand-lg mi-navbar">
        <div className="container-fluid">
          <Link className="nav-link navbar-brand-custom" to="/principal">PixelHub</Link>
          
          {/* Botón hamburguesa para móviles */}
          <button 
            className="navbar-toggler bg-light" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              {/* --- NUEVO ENLACE: DONACIONES --- */}
              <li className="nav-item">
                <Link className="nav-link" to="/donaciones">Donaciones</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cuenta">Cuenta</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL APP ---
function App() {
  
  const navigate = useNavigate();

  // Funciones auxiliares para el manejo de sesión (opcional según tu lógica actual)
  const handleLoginSuccess = (email: string) => {
    alert(`Gracias ${email}, has iniciado sesión!`);
    navigate('/principal');
  };

  const handleNavigateToRegister = () => {
    navigate('/registro');
  };

  return (
    <div className="App">
      {/* Barra de Navegación Superior */}
      <Navbar />

      {/* Contenido Principal Dinámico */}
      <div className="main-content">
        <Routes>
          {/* Ruta por defecto (Registro) */}
          <Route path="/" element={<Registro />} />
          
          {/* Autenticación */}
          <Route 
            path="/inicioSesion" 
            element={
              <InicioSesion 
                onLoginSuccess={handleLoginSuccess}
                onNavigateToRegister={handleNavigateToRegister}
              />
            } 
          />
          <Route path="/registro" element={<Registro />} />

          {/* Páginas Principales */}
          <Route path="/principal" element={<Principal />} />
          <Route path="/cuenta" element={<Cuenta />} />
          <Route path="/contacto" element={<Contacto />} />
          
          {/* --- NUEVAS RUTAS --- */}
          <Route path="/donaciones" element={<Donaciones />} />
          
          {/* Ruta dinámica para ver el detalle de un hilo específico */}
          <Route path="/hilo/:id" element={<HiloDetalle />} />

        </Routes>
      </div>

      {/* Pie de página */}
      <footer className="footer">
        © 2025 PixelHub - Todos los derechos reservados
      </footer>
    </div>
  );
}

export default App;