import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from "../services/api"; // Axios
import '../css/hiloDetalle.css';

// Interfaz que coincide con ComentarioModel.java
interface Comentario {
    id: number;
    publicationId: number;
    usuarioId: number;
    contenido: string; 
    autorNombre: string;
    fechaCreacion: string;
}

// (Opcional) Interfaz para el Hilo para tener mejor tipado en lugar de 'any'
interface Hilo {
    id: number;
    title: string;
    category: string;
    createDt: string;
    authorname: string;
    imageUri?: string | null;
    description: string;
}

const HiloDetalle: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Intentamos tomar el hilo del estado de navegación, si no iniciamos en null
  const [hilo, setHilo] = useState<Hilo | null>(location.state?.hilo || null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');

  // Cargar hilo (si no vino por state) y Cargar comentarios
  useEffect(() => {
    if (id) {
        cargarComentarios(Number(id));
        if(!hilo) cargarHilo(Number(id));
    }
  }, [id]);

  const cargarHilo = async (pubId: number) => {
      try {
          const res = await api.get(`/api/publicaciones/${pubId}`);
          setHilo(res.data);
      } catch (e) { console.error("Error cargando hilo", e); }
  }

  const cargarComentarios = async (pubId: number) => {
      try {
          // Endpoint definido en ComentarioController.java
          const res = await api.get(`/api/comentarios/publicacion/${pubId}`);
          setComentarios(res.data);
      } catch (e) { console.error("Error cargando comentarios", e); }
  }

  const handleAgregarComentario = async () => {
    if (!nuevoComentario.trim() || !hilo) return;

    const usuarioId = Number(localStorage.getItem('usuario_id'));
    const autorNombre = localStorage.getItem('nombre_usuario') || 'Anonimo';

    const payload = {
        publicationId: hilo.id,
        usuarioId: usuarioId,
        contenido: nuevoComentario,
        autorNombre: autorNombre,
        // fechaCreacion se asigna en backend si va vacía
    };

    try {
        // POST a /api/comentarios/comentar
        const res = await api.post('/api/comentarios/comentar', payload);
        setComentarios([...comentarios, res.data]);
        setNuevoComentario('');
    } catch (error) {
        console.error("Error publicando comentario", error);
        alert("Error al comentar.");
    }
  };

  if (!hilo) return <div className="text-white mt-5 text-center">Cargando...</div>;

  return (
    <div className="container my-4">
        <div className="card-hilo-unica">
            <div className="mb-4">
                <button onClick={() => navigate('/principal')} className="btn-volver">← Volver</button>
            </div>
            
            <div className="hilo-header">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-warning text-dark fs-6">{hilo.category}</span>
                    <span className="text-muted small">{hilo.createDt ? hilo.createDt.split('T')[0] : ''}</span>
                </div>
                <h1 className="display-6 fw-bold mb-3 text-white">{hilo.title}</h1>
                <div className="hilo-meta">
                    <span>👤 <strong>{hilo.authorname}</strong></span>
                </div>
            </div>

            <hr className="divider-neon" />

            <div className="hilo-body">
                {/* CAMBIO: Solo mostramos el contenedor de imagen si existe una URL válida */}
                {hilo.imageUri && (
                    <div className="imagen-frame mb-4">
                        <img 
                            src={hilo.imageUri} 
                            alt={hilo.title} 
                            className="imagen-principal" 
                            onError={(e) => (e.currentTarget.style.display = 'none')} // Ocultar si la URL está rota
                        />
                    </div>
                )}
                
                <p className="texto-contenido">{hilo.description}</p>
            </div>

            <hr className="divider-neon" />

            <div className="hilo-footer-comentarios">
                <h3 className="mb-4 text-white">
                    Comentarios <span className="text-primary fs-5">({comentarios.length})</span>
                </h3>

                <div className="lista-comentarios mb-5">
                    {comentarios.length > 0 ? (
                        comentarios.map((com) => (
                            <div key={com.id} className="comentario-row">
                                <div className="avatar-circle">{com.autorNombre.charAt(0).toUpperCase()}</div>
                                <div className="comentario-data">
                                    <div className="d-flex justify-content-between">
                                        <span className="autor-nombre">{com.autorNombre}</span>
                                        <span className="fecha-texto">{com.fechaCreacion ? com.fechaCreacion.split('T')[0] : ''}</span>
                                    </div>
                                    <p className="mensaje-texto">{com.contenido}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">No hay comentarios aún. ¡Sé el primero!</p>
                    )}
                </div>

                <div className="input-area">
                    <textarea className="form-control input-dark" rows={2} placeholder="Escribe un comentario..."
                        value={nuevoComentario} onChange={(e) => setNuevoComentario(e.target.value)}></textarea>
                    <button className="btn-enviar mt-2" onClick={handleAgregarComentario} disabled={!nuevoComentario.trim()}>
                        Publicar Comentario 🚀
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default HiloDetalle;