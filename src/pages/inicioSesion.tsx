import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Importamos nuestra api configurada
import '../css/cuenta.css';
import logo from '../img/logo.png';

interface InicioSesionProps {
  onLoginSuccess: (email: string) => void; // Mantenemos props por compatibilidad
  onNavigateToRegister: () => void;
}

const InicioSesion: React.FC<InicioSesionProps> = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [nombreUsuario, setNombreUsuario] = useState(''); // Cambiado de email a nombreUsuario según tu backend
  const [contrasena, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
        // Petición al endpoint definido en LoginController.java
        const response = await api.post('/api/v1/auth/login', {
            nombreUsuario: nombreUsuario,
            contrasena: contrasena
        });

        // Guardamos datos críticos en LocalStorage
        const { token, usuario_id, nombre_usuario, rol_id } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('usuario_id', String(usuario_id));
        localStorage.setItem('nombre_usuario', nombre_usuario);
        localStorage.setItem('rol_id', String(rol_id));

        alert(`¡Bienvenido ${nombre_usuario}!`);
        navigate('/principal');

    } catch (err: any) {
        console.error(err);
        setError("Credenciales incorrectas o error en el servidor.");
    } finally {
        setCargando(false);
    }
  }

  return (
    <div className="contenedor-form-inicio">
      <img src={logo} alt="Logo de PixelHub" className="navbar-logo" />
      
      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        
        <div className="mb-3">
          <label className="form-label text-white">Nombre de Usuario</label>
          <input
            type="text"
            className="form-control"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-white">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={contrasena}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-light w-100" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <div className="separator">O</div>

        <button type="button" className="btn btn-light w-100" onClick={onNavigateToRegister}>
          Registrate
        </button>
      </form>
    </div>
  );
};

export default InicioSesion;