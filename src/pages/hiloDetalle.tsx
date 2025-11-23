import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { initialHilosData } from '../data/hilosData';
import '../css/hiloDetalle.css';

const HiloDetalle: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Intentamos obtener el hilo del estado de navegación (si venimos de un clic)
  // O lo buscamos en la data estática por ID
  // @ts-ignore
  let hilo = location.state?.hilo;

  if (!hilo && id) {
    hilo = initialHilosData.find(h => h.id === Number(id));
  }

  if (!hilo) {
    return (
      <div className="container text-center text-white mt-5">
        <h2>Hilo no encontrado 👾</h2>
        <p>Parece que este hilo se ha perdido en el ciberespacio.</p>
        <button onClick={() => navigate('/principal')} className="btn btn-primary mt-3">Volver al Hub</button>
      </div>
    );
  }

  return (
    <div className="container">
        <div className="detalle-container">
        <button onClick={() => navigate('/principal')} className="btn-volver">
            ← Volver al Hub
        </button>

        <div className="detalle-header text-start">
            <span className="badge bg-warning text-dark mb-2">{hilo.category}</span>
            <h1 className="fw-bold">{hilo.title}</h1>
            <div className="detalle-meta">
            <span>👤 Por {hilo.author}</span>
            <span>📅 {hilo.date || 'Reciente'}</span>
            <span>💬 {hilo.comments} comentarios</span>
            <span>❤️ {hilo.likes} likes</span>
            </div>
        </div>

        <div className="detalle-imagen-container">
            <img 
                src={hilo.imageUrl} 
                alt={hilo.title} 
                className="detalle-imagen"
                onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/333/fff?text=No+Image')}
            />
        </div>

        <div className="detalle-contenido">
            <p>{hilo.content || "Este hilo no tiene contenido de texto adicional, ¡pero la imagen habla por sí sola!"}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>

        <div className="comentarios-section">
            <h3>Comentarios</h3>
            <p className="text-muted">Esta sección está en construcción...</p>
        </div>
        </div>
    </div>
  );
};

export default HiloDetalle;