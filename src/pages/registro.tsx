import React, { useState } from "react";
import '../css/registro.css';
import logo from '../img/logo.png';
import { useNavigate } from "react-router-dom"; // permite la navegación entre páginas

const Registro: React.FC = () => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correoelectronico, setCorreoelectronico] = useState('');
  const [contraseña, setContraseña] = useState('');

  const navigate = useNavigate();

  // Estado para los errores
  const [errores, setErrores] = useState({
    nombre: "",
    telefono: "",
    correoelectronico: "",
    contraseña: "",
  });

  // Función de validación
  const validarFormulario = () => {
    const nuevosErrores = { nombre: "", telefono: "", correoelectronico: "", contraseña: "" };
    
    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    const telefonoRegex = /^[0-9]+$/;
    if (!telefono.trim()) {
      nuevosErrores.telefono = "El número de teléfono es obligatorio.";
    } else if (!telefonoRegex.test(telefono)) {
      nuevosErrores.telefono = "El teléfono solo debe contener números.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoelectronico.trim()) {
      nuevosErrores.correoelectronico = "El correo electrónico es obligatorio.";
    } else if (!emailRegex.test(correoelectronico)) {
      nuevosErrores.correoelectronico = "Formato de email no válido.";
    }
    
    if (!contraseña.trim()) {
      nuevosErrores.contraseña = "La contraseña es obligatoria.";
    }

    setErrores(nuevosErrores);
    return nuevosErrores;
  }

  // Manejador de envío del formulario de registro
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    const resultadoErrores = validarFormulario();
    
    if (!resultadoErrores.nombre && !resultadoErrores.telefono && !resultadoErrores.correoelectronico && !resultadoErrores.contraseña) {
      alert(`¡Gracias por registrarte, ${nombre}! Serás redirigido para iniciar sesión.`);
      // Navega a la página de inicio de sesión después del registro exitoso
      navigate('/inicioSesion'); 
    }
  }

  // --- FUNCIÓN CORREGIDA ---
  // Manejador para el botón "Si ya tienes cuenta..."
  const handleNavigateToLogin = () => {
    // Navega a la ruta donde está el componente InicioSesion
    navigate('/inicioSesion'); 
  };
    
  // Lógica para deshabilitar el botón de registro
  const botonDeshabilitado =
    !!errores.nombre ||
    !!errores.telefono ||
    !!errores.correoelectronico ||
    !!errores.contraseña ||
    !nombre.trim() ||
    !telefono.trim() ||
    !correoelectronico.trim() ||
    !contraseña.trim();


  return (
    <div className="contenedor-form-registro">
      <img 
        src={logo} 
        alt="Logo de PixelHub" 
        className="navbar-logo" 
      />
      
      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: '400px' }}>
        
        {/* Campo Nombre */}
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label text-white">Nombre Completo</label>
          <input 
            type="text"
            id="nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); validarFormulario(); }}
          />
          {errores.nombre && <div className="text-danger">{errores.nombre}</div>}
        </div>

        {/* Campo Teléfono */}
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label text-white">Número de Teléfono</label>
          <input 
            type="tel" 
            id="telefono"
            className="form-control"
            value={telefono}
            onChange={(e) => { setTelefono(e.target.value); validarFormulario(); }}
          />
          {errores.telefono && <div className="text-danger">{errores.telefono}</div>}
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
        
        {/* Campo Contraseña */}
        <div className="mb-3">
          <label htmlFor="contraseña" className="form-label text-white">Contraseña</label>
          <input 
            type="password"
            id="contraseña"
            className="form-control"
            value={contraseña}
            onChange={(e) => { setContraseña(e.target.value); validarFormulario(); }}
          />
          {errores.contraseña && <div className="text-danger">{errores.contraseña}</div>}
        </div>
        
        {/* Botón Registrarse */}
        <button type="submit" className="btn btn-light w-100" disabled={botonDeshabilitado}>
          Registrarse 
        </button>
        
        <div className="separator">O</div>

        {/* Botón para ir a Iniciar Sesión */}
        <button type="button" className="btn btn-light w-100" onClick={handleNavigateToLogin}>
          Si ya tienes cuenta, inicia sesión
        </button>
        
      </form>   
    </div>
  );
};

export default Registro;