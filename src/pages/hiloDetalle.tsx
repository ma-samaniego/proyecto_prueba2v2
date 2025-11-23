import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { initialHilosData, type Comment } from '../data/hilosData'; 
import '../css/hiloDetalle.css';

const HiloDetalle: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [hilo, setHilo] = useState<any>(null);
  const [comentarios, setComentarios] = useState<Comment[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');

  useEffect(() => {
    let currentHilo = location.state?.hilo;

    if (!currentHilo && id) {
      currentHilo = initialHilosData.find(h => h.id === Number(id));
    }

    setHilo(currentHilo);

    if (currentHilo && currentHilo.commentsList) {
      setComentarios(currentHilo.commentsList);
    }
  }, [id, location.state]);

  const handleAgregarComentario = () => {
    if (!nuevoComentario.trim()) return;

    const nuevo: Comment = {
      id: Date.now(),
      author: 'Usuario', 
      text: nuevoComentario,
      date: new Date().toLocaleDateString()
    };

    setComentarios([...comentarios, nuevo]);
    setNuevoComentario('');
    
    if (hilo) {
        setHilo({ ...hilo, comments: comentarios.length + 1 });
    }
  };

  if (!hilo) {
    return (
      <div className="container text-center text-white mt-5">
        <h2>Hilo no encontrado 👾</h2>
        <button onClick={() => navigate('/principal')} className="btn btn-primary mt-3">Volver al Hub</button>
      </div>
    );
  }

  return (
    <div className="container my-4">
        
        {/* --- CÁPSULA ÚNICA --- */}
        <div className="card-hilo-unica">
            
            {/* 1. BOTÓN VOLVER (AHORA DENTRO) */}
            <div className="mb-4">
                <button onClick={() => navigate('/principal')} className="btn-volver">
                    ← Volver
                </button>
            </div>
            
            {/* 2. Header del Hilo */}
            <div className="hilo-header">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="badge bg-warning text-dark fs-6">{hilo.category}</span>
                    <span className="text-muted small">{hilo.date}</span>
                </div>
                <h1 className="display-6 fw-bold mb-3 text-white">{hilo.title}</h1>
                <div className="hilo-meta">
                    <span className="me-3">👤 <strong>{hilo.author}</strong></span>
                    <span>❤️ {hilo.likes} Likes</span>
                </div>
            </div>

            <hr className="divider-neon" />

            {/* 3. Cuerpo del Hilo (Imagen + Texto) */}
            <div className="hilo-body">
                <div className="imagen-frame mb-4">
                    <img 
                        src={hilo.imageUrl} 
                        alt={hilo.title} 
                        className="imagen-principal"
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/333/fff?text=No+Image')}
                    />
                </div>
                <p className="texto-contenido">{hilo.content}</p>
            </div>

            <hr className="divider-neon" />

            {/* 4. Comentarios INTEGRADOS */}
            <div className="hilo-footer-comentarios">
                <h3 className="mb-4 text-white">
                    Comentarios <span className="text-primary fs-5">({comentarios.length})</span>
                </h3>

                {/* Lista */}
                <div className="lista-comentarios mb-5">
                    {comentarios.length > 0 ? (
                        comentarios.map((com) => (
                            <div key={com.id} className="comentario-row">
                                <div className="avatar-circle">
                                    {com.author.charAt(0).toUpperCase()}
                                </div>
                                <div className="comentario-data">
                                    <div className="d-flex justify-content-between">
                                        <span className="autor-nombre">{com.author}</span>
                                        <span className="fecha-texto">{com.date}</span>
                                    </div>
                                    <p className="mensaje-texto">{com.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted fst-italic py-3">
                            Sé el primero en comentar en este hilo...
                        </p>
                    )}
                </div>

                {/* Input */}
                <div className="input-area">
                    <textarea 
                        className="form-control input-dark" 
                        rows={2} 
                        placeholder="Escribe un comentario..."
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                    ></textarea>
                    <button 
                        className="btn-enviar mt-2" 
                        onClick={handleAgregarComentario}
                        disabled={!nuevoComentario.trim()}
                    >
                        Publicar Comentario 🚀
                    </button>
                </div>
            </div>

        </div>
    </div>
  );
};

export default HiloDetalle;