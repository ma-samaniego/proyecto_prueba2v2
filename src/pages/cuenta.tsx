import React, { useState, useEffect } from "react";
import '../css/cuenta.css';
import logo from '../img/logo.png';
// <-- IMPORTANTE: Necesitarás una imagen de avatar por defecto en tu carpeta img
import defaultAvatar from '../img/default-avatar.png'; 
import { useNavigate } from "react-router-dom";

const Cuenta: React.FC = () => { // <-- CAMBIO: de 'cuenta' a 'Cuenta'
  // --- ESTADOS ---

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correoelectronico, setCorreoelectronico] = useState('');
  
  // fotoActual: Guarda la URL de la foto (Base64) para mostrar
  const [fotoActual, setFotoActual] = useState<string | null>(null); 

  // Estados para guardar los datos originales
  const [originalNombre, setOriginalNombre] = useState('');
  const [originalCorreo, setOriginalCorreo] = useState('');
  const [originalFoto, setOriginalFoto] = useState<string | null>(null);

  // Estado para los mensajes de error
  const [errores, setErrores] = useState({
    nombreUsuario: "",
    correoelectronico: "",
  });

  const navigate = useNavigate();

  // --- EFECTO: LECTURA DE DATOS (Simulación) ---
  useEffect(() => {
    // Valores por defecto (simulación)
    let nombreCargado = "MaSamaniego";
    let correoCargado = "MaSamaniego@gmail.com";
    let fotoCargada: string | null = null; // Por defecto no hay foto

    // Rellenamos el formulario
    setNombreUsuario(nombreCargado);
    setCorreoelectronico(correoCargado);
    setFotoActual(fotoCargada);

    // Guardamos los datos originales
    setOriginalNombre(nombreCargado);
    setOriginalCorreo(correoCargado);
    setOriginalFoto(fotoCargada);
  }, []); // El array vacío [] asegura que solo se ejecute al montar

  // VALIDACIÓN 
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

  // <-- Manejador para la foto
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      // Cuando el lector termine, 'reader.result' tendrá la URL Base64
      reader.onloadend = () => {
        setFotoActual(reader.result as string); // La usamos para el preview
      };
      reader.readAsDataURL(file); // Inicia la lectura del archivo
    }
  };

  // <-- Nuevo manejador para el botón de eliminar foto
  const handleFotoDelete = () => {
    setFotoActual(null); // Borra la previsualización
  };

  // --- FUNCIÓN DE ACTUALIZACIÓN ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resultadoErrores = validarFormulario();

    if (!resultadoErrores.nombreUsuario && !resultadoErrores.correoelectronico) {
      
      // 1. Mostramos la alerta
      const mensajeFoto = (fotoActual !== originalFoto) ? "Foto cambiada" : "Foto sin cambios";
      alert(`¡Datos actualizados con éxito!\nNuevo Nombre: ${nombreUsuario}\nNuevo Correo: ${correoelectronico}\n${mensajeFoto}`);
        
      // 2. Actualizamos los valores "originales" para que el botón se deshabilite
      setOriginalNombre(nombreUsuario);
      setOriginalCorreo(correoelectronico);
      setOriginalFoto(fotoActual);

    }
  };

  const handleNavigateToPrincipal = () => {
    navigate('/principal');
  };

  // <-- Actualizamos la comprobación de cambios
  const sinCambios = 
    (nombreUsuario === originalNombre) && 
    (correoelectronico === originalCorreo) &&
    (fotoActual === originalFoto); // <-- Comprobamos también la foto

  const botonDeshabilitado =
    !!errores.nombreUsuario ||
    !!errores.correoelectronico ||
    !nombreUsuario.trim() ||
    !correoelectronico.trim() ||
    sinCambios;

  return (
    <div className="contenedor-form-inicio">
      
      <img 
        src={logo} 
        alt="Logo de PixelHub" 
        className="navbar-logo" 
      />
      
      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
        <h3 className="text-white mb-4 text-center">Configuración de Cuenta</h3>

        {/* --- INICIO SECCIÓN FOTO DE PERFIL --- */}
        
        {/* Previsualización de la foto */}
        <div className="text-center mb-3">
          <img
            // Muestra la foto actual por defecto si es null
            src={fotoActual || defaultAvatar} 
            alt="Foto de perfil"
            className="profile-picture"
          />
        </div>

        {/* Botones para cambiar/eliminar foto */}
        <div className="d-flex justify-content-center mb-4">
          
          {/* Botón "falso" que activa el input real */}
          <label htmlFor="fotoInput" className="btn btn-sm btn-outline-light me-2 mb-0">
            Cambiar Foto
          </label>
          
          {/* Input de archivo real, pero oculto */}
          <input
            type="file"
            id="fotoInput"
            style={{ display: 'none' }}
            accept="image/png, image/jpeg" // Acepta solo imágenes
            onChange={handleFotoChange}
          />
          
          {/* Botón para eliminar la foto */}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={handleFotoDelete}
            // Se deshabilita si ya no hay foto para eliminar
            disabled={!fotoActual} 
          >
            Eliminar Foto
          </button>
        </div>
        
        {/* --- FIN SECCIÓN FOTO DE PERFIL --- */}
        
        {/* Campo Nombre de Usuario */}
        <div className="mb-3">
          <label htmlFor="nombreUsuario" className="form-label text-white">Nombre de Usuario</label>
          <input 
            type="text"
            id="nombreUsuario"
            className="form-control"
            value={nombreUsuario}
            onChange={(e) => { setNombreUsuario(e.target.value); validarFormulario(); }} 
          />
          {errores.nombreUsuario && <div className="text-danger">{errores.nombreUsuario}</div>}
        </div>

        {/* Campo Correo Electrónico */}
        <div className="mb-3">
          <label htmlFor="correo" className="form-label text-white">Correo Electrónico</label>
          <input 
            type="email"
            id="correo"
            className="form-control"
            value={correoelectronico}
            onChange={(e) => { setCorreoelectronico(e.target.value); validarFormulario(); }}
          />
          {errores.correoelectronico && <div className="text-danger">{errores.correoelectronico}</div>}
        </div>
        
        {/* Mensaje de Estado (Eliminado) */}
        {/* {statusMessage && (...)} */}

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