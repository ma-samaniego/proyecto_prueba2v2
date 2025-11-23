import React, { useState } from "react";
import '../css/contacto.css'; // <-- Importamos el nuevo CSS
import { useNavigate } from "react-router-dom";//prueba de commit 

// Declaramos el componente funcional
const Contacto: React.FC = () => {
  // --- ESTADOS ---
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  //prueba del git hub 
  
  const navigate = useNavigate(); // Hook para navegación

  // Estado para los mensajes de error
  const [errores, setErrores] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  // --- VALIDACIÓN ---
  const validarFormulario = () => {
    const nuevosErrores = { nombre: "", email: "", mensaje: "" };
    
    // Validar nombre
    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      nuevosErrores.email = "El email es obligatorio.";
    } else if (!emailRegex.test(email)) {
      nuevosErrores.email = "Formato de email no válido.";
    }

    // Validar mensaje
    if (!mensaje.trim()) {
      nuevosErrores.mensaje = "El mensaje es obligatorio.";
    }

    setErrores(nuevosErrores);
    // Devuelve true si no hay errores, false si hay
    return Object.values(nuevosErrores).every(error => error === "");
  };

  // --- MANEJADOR DE ENVÍO ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    if (validarFormulario()) {
      // Si todo está bien, mostramos una alerta y limpiamos el formulario
      alert(`¡Gracias por tu mensaje, ${nombre}! Nos pondremos en contacto contigo pronto.`);
      
      // Limpiamos los campos
      setNombre('');
      setEmail('');
      setMensaje('');
      setErrores({ nombre: "", email: "", mensaje: "" });

      // Opcional: Redirigir a la página principal
      // navigate('/principal'); 
    }
  };

  // --- LÓGICA DEL BOTÓN ---
  const botonDeshabilitado =
    !nombre.trim() ||
    !email.trim() ||
    !mensaje.trim() ||
    !!errores.nombre ||
    !!errores.email ||
    !!errores.mensaje;

  // --- RENDERIZADO ---
  return (
    // Contenedor principal con el fondo celeste
    <div className="contacto-container">
      <h1>Contacto</h1>
      <p>Completa el formulario y nos pondremos en contacto contigo.</p>
      
      <form onSubmit={handleSubmit} className="contacto-form">
        
        {/* Campo Nombre */}
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); validarFormulario(); }}
          />
          {errores.nombre && <div className="text-danger-contacto">{errores.nombre}</div>}
        </div>
        
        {/* Campo Email */}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); validarFormulario(); }}
          />
          {errores.email && <div className="text-danger-contacto">{errores.email}</div>}
        </div>
        
        {/* Campo Mensaje */}
        <div className="form-group">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            value={mensaje}
            onChange={(e) => { setMensaje(e.target.value); validarFormulario(); }}
            rows={5} // Definimos un alto inicial
          />
          {errores.mensaje && <div className="text-danger-contacto">{errores.mensaje}</div>}
        </div>
        
        {/* Botón de Enviar */}
        <button type="submit" className="submit-btn" disabled={botonDeshabilitado}>
          Enviar
        </button>
        
      </form>
    </div>
  );
};

export default Contacto;
