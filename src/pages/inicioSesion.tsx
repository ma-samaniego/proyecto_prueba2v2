import React, { useState } from "react";
import '../css/cuenta.css';
import logo from '../img/logo.png';

interface InicioSesionProps {
  onLoginSuccess: (email: string) => void;
  onNavigateToRegister: () => void;
}

const InicioSesion: React.FC<InicioSesionProps> = ({ onLoginSuccess, onNavigateToRegister }) => {

  const [correoelectronico, setCorreoelectronico] = useState('');
  const [contraseña, setContraseña] = useState('');

  const [errores, setErrores] = useState({
    correoelectronico: "",
    contraseña: "",
  });

  // Función de validación (devuelve todos los errores posibles)
  const getValidationErrors = (email: string, pass: string) => {
    const nuevosErrores = { correoelectronico: "", contraseña: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      nuevosErrores.correoelectronico = "El correo electrónico es obligatorio.";
    } else if (!emailRegex.test(email)) {
      nuevosErrores.correoelectronico = "Formato de email no válido.";
    }
    if(!pass.trim()){
      nuevosErrores.contraseña = "La contraseña es obligatoria.";
    }
    return nuevosErrores;
  }

  // --- NUEVO: Manejador específico para el email ---
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setCorreoelectronico(newEmail);
    // Validamos con el nuevo email y la contraseña actual
    const validationErrors = getValidationErrors(newEmail, contraseña);
    // Actualizamos SOLO el error del email
    setErrores(prevErrores => ({
      ...prevErrores,
      correoelectronico: validationErrors.correoelectronico
    }));
  }

  // --- NUEVO: Manejador específico para la contraseña ---
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setContraseña(newPassword);
    // Validamos con el email actual y la nueva contraseña
    const validationErrors = getValidationErrors(correoelectronico, newPassword);
     // Actualizamos SOLO el error de la contraseña
    setErrores(prevErrores => ({
      ...prevErrores,
      contraseña: validationErrors.contraseña
    }));
  }

  // Al enviar, hacemos una validación final completa
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalErrors = getValidationErrors(correoelectronico, contraseña);
    setErrores(finalErrors); // Mostramos todos los errores si los hay

     if (!finalErrors.correoelectronico && !finalErrors.contraseña) {
      onLoginSuccess(correoelectronico);
      setCorreoelectronico("");
      setContraseña("");
      setErrores({ correoelectronico: "", contraseña: "" });
    }
  }

  const handleNavigateToRegistro = () => {
    onNavigateToRegister();
  };

  // El botón está deshabilitado si los campos están vacíos O si hay algún error en el estado actual
  const botonDeshabilitado =
    !correoelectronico.trim() ||
    !contraseña.trim() ||
    !!errores.correoelectronico ||
    !!errores.contraseña;


  return (
    <div className="contenedor-form-inicio">
      <img
        src={logo}
        alt="Logo de PixelHub"
        className="navbar-logo"
      />

      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label htmlFor="correo" className="form-label text-white">Correo Electrónico</label>
          <input
            type="email"
            id="correo"
            className="form-control"
            value={correoelectronico}
            // --- CAMBIO: Usar el manejador específico ---
            onChange={handleEmailChange}
            required
          />
          {errores.correoelectronico && <div className="text-danger">{errores.correoelectronico}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="contraseña" className="form-label text-white">Contraseña</label>
          <input
            type="password"
            id="contraseña"
            className="form-control"
            value={contraseña}
            // --- CAMBIO: Usar el manejador específico ---
            onChange={handlePasswordChange}
            required
          />
          {errores.contraseña && <div className="text-danger">{errores.contraseña}</div>}
        </div>

        <button type="submit" className="btn btn-light w-100 " disabled={botonDeshabilitado}>
          Ingresar
        </button>

        <div className="separator">O</div>

        <button type="button" className="btn btn-light w-100" onClick={handleNavigateToRegistro}>
          Registrate
        </button>

      </form>

    </div>
  );
};

export default InicioSesion;