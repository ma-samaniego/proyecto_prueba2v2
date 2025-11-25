import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Usamos tu instancia de Axios configurada
import '../css/cuenta.css';
import logo from '../img/logo.png';

const Cuenta: React.FC = () => {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correoelectronico, setCorreoelectronico] = useState('');
  
  // Estados para guardar los datos originales y comparar cambios
  const [originalNombre, setOriginalNombre] = useState('');
  const [originalCorreo, setOriginalCorreo] = useState('');
  
  // Estado de carga
  const [cargando, setCargando] = useState(true);

  const [errores, setErrores] = useState({
    nombreUsuario: "",
    correoelectronico: "",
  });

  // --- EFECTO: CARGAR DATOS DEL USUARIO ---
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      const usuarioId = localStorage.getItem('usuario_id');
      
      if (!usuarioId) {
        alert("No hay sesión activa.");
        navigate('/inicioSesion');
        return;
      }

      try {
        // Petición GET al backend: /api/v1/users/{id}
        const response = await api.get(`/api/v1/users/${usuarioId}`);
        const usuario = response.data;

        // Mapeamos los datos del backend (nombre_usuario) al estado del frontend
        setNombreUsuario(usuario.nombre_usuario);
        setCorreoelectronico(usuario.correo);

        // Guardamos originales
        setOriginalNombre(usuario.nombre_usuario);
        setOriginalCorreo(usuario.correo);
        
      } catch (error) {
        console.error("Error cargando perfil:", error);
        alert("Error al cargar los datos del usuario.");
      } finally {
        setCargando(false);
      }
    };

    cargarDatosUsuario();
  }, [navigate]);

  // --- VALIDACIÓN ---
  const validarFormulario = () => {
    const nuevosErrores = { nombreUsuario: "", correoelectronico: "" };
    if (!nombreUsuario.trim()) {
      nuevosErrores.nombreUsuario = "El nombre de usuario es obligatorio.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoelectronico.trim()) {
      nuevosErrores.correoelectronico = "El correo electrónico es obligatorio.";
    } else if (!emailRegex.test(correoelectronico)) {
      nuevosErrores.correoelectronico = "Formato de email no válido.";
    }
    setErrores(nuevosErrores);
    return nuevosErrores;
  };

  // --- FUNCIÓN DE ACTUALIZACIÓN (PUT) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultadoErrores = validarFormulario();

    // Si hay errores visuales en la validación, detenemos
    if (resultadoErrores.nombreUsuario || resultadoErrores.correoelectronico) {
        return;
    }

    try {
        const usuarioId = localStorage.getItem('usuario_id');
        
        // Preparamos el objeto para el backend
        // Nota: Solo enviamos lo que queremos cambiar. El backend espera "nombre_usuario" y "correo"
        const datosActualizados = {
            nombre_usuario: nombreUsuario,
            correo: correoelectronico,
            // telefono, contrasena, estado, etc. se pueden agregar si el form crece
        };

        // Petición PUT al backend: /api/v1/users/{id}
        await api.put(`/api/v1/users/${usuarioId}`, datosActualizados);

        alert("¡Datos actualizados correctamente en el servidor!");

        // Actualizamos los valores "originales"
        setOriginalNombre(nombreUsuario);
        setOriginalCorreo(correoelectronico);
        
        // Actualizamos también el localStorage por si el nombre cambió (para mostrarlo en otros lados)
        localStorage.setItem('nombre_usuario', nombreUsuario);

    } catch (error) {
        console.error("Error actualizando perfil:", error);
        alert("Hubo un error al guardar los cambios.");
    }
  };

  const handleNavigateToPrincipal = () => {
    navigate('/principal');
  };

  // Comprobar cambios
  const sinCambios = 
    (nombreUsuario === originalNombre) && 
    (correoelectronico === originalCorreo);

  const botonDeshabilitado =
    !!errores.nombreUsuario ||
    !!errores.correoelectronico ||
    !nombreUsuario.trim() ||
    !correoelectronico.trim() ||
    sinCambios;

  if (cargando) {
      return <div className="text-white text-center mt-5">Cargando perfil...</div>;
  }

  return (
    <div className="contenedor-form-inicio">
      
      <img 
        src={logo} 
        alt="Logo de PixelHub" 
        className="navbar-logo" 
      />
      
      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
        <h3 className="text-white mb-4 text-center">Configuración de Cuenta</h3>
        
        {/* --- CAMPOS DEL FORMULARIO --- */}
        
        <div className="mb-3">
          <label htmlFor="nombreUsuario" className="form-label text-white">Nombre de Usuario</label>
          <input 
            type="text"
            id="nombreUsuario"
            className="form-control"
            value={nombreUsuario}
            onChange={(e) => { setNombreUsuario(e.target.value); }} 
            onBlur={validarFormulario} // Validar al salir del campo
          />
          {errores.nombreUsuario && <div className="text-danger">{errores.nombreUsuario}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="correo" className="form-label text-white">Correo Electrónico</label>
          <input 
            type="email"
            id="correo"
            className="form-control"
            value={correoelectronico}
            onChange={(e) => { setCorreoelectronico(e.target.value); }}
            onBlur={validarFormulario}
          />
          {errores.correoelectronico && <div className="text-danger">{errores.correoelectronico}</div>}
        </div>

        <button type="submit" className="btn btn-light w-100" disabled={botonDeshabilitado}>
          Guardar Cambios
        </button>

        <div className="separator">O</div>

        <button type="button" className="btn btn-secondary w-100" onClick={handleNavigateToPrincipal}>
          Volver a Principal
        </button>
        
      </form> 
    </div>
  );
};

export default Cuenta;