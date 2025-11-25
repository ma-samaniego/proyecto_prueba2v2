import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Usamos axios
import { Modal } from 'bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import '../css/principal.css';

// Interfaz que coincide con PublicationModel.java
interface Publicacion {
    id: number;
    userid: number;
    category: string;
    imageUri: string;
    title: string;
    description: string;
    authorname: string;
    createDt: string;
    likes: number;
}

const categories = ['Shooter', 'RPG', 'Indie', 'Noticias', 'Retro', 'Tecnología'];

const Principal: React.FC = () => {
 const [hilos, setHilos] = useState<Publicacion[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeCategory, setActiveCategory] = useState('Shooter');
 
 // Formulario
 const [categoria, setCategoria] = useState('');
 const [titulo, setTitulo] = useState(''); // Backend usa 'title'
 const [descripcion, setDescripcion] = useState(''); // Backend usa 'description'
 const [urlImagen, setUrlImagen] = useState('');
 
 const navigate = useNavigate();

 // 1. Cargar publicaciones reales al montar el componente
 useEffect(() => {
    fetchPublicaciones();
 }, []);

 const fetchPublicaciones = async () => {
    try {
        // Endpoint del Gateway -> Microservicio Publicaciones
        const response = await api.get('/api/publicaciones');
        setHilos(response.data);
    } catch (error) {
        console.error("Error cargando publicaciones", error);
    } finally {
        setLoading(false);
    }
 };

 const handleCardClick = (hilo: Publicacion) => {
    navigate(`/hilo/${hilo.id}`, { state: { hilo } });
 };

 const handleSubmitHilo = async () => {
   if (!categoria || !titulo.trim() || !descripcion.trim()) { 
       alert("Completa los campos obligatorios"); return; 
   }

   const usuarioId = Number(localStorage.getItem('usuario_id'));
   const autorNombre = localStorage.getItem('nombre_usuario') || 'Anonimo';

   const nuevaPubli = {
       userid: usuarioId,
       category: categoria,
       imageUri: urlImagen || 'https://placehold.co/600x400/333/fff?text=PixelHub',
       title: titulo,
       description: descripcion,
       authorname: autorNombre,
       status: "ACTIVE"
   };

   try {
       // POST a /api/publicaciones/publicar
       const response = await api.post('/api/publicaciones/publicar', nuevaPubli);
       
       // Actualizamos la lista localmente
       setHilos([response.data, ...hilos]);
       
       // Limpiar y cerrar
       setCategoria(''); setTitulo(''); setDescripcion(''); setUrlImagen('');
       
       const modalElement = document.getElementById('addHiloModal');
       if (modalElement) {
         const modalInstance = Modal.getInstance(modalElement);
         modalInstance?.hide();
       }
   } catch (error) {
       alert("Error al crear la publicación. Revisa la consola.");
       console.error(error);
   }
 };

 // Filtramos localmente por categoría (podrías hacerlo en backend también)
 const filteredHilos = hilos.filter(hilo => hilo.category === activeCategory);

 return (
   <>
     <div className="main-wrapper">
       <main className="container mt-4">
         <h2 className="text-white mb-4">PixelHub</h2>
         
         {/* Categorías */}
         <ul className="nav nav-pills mb-4">
           {categories.map((cat) => (
             <li className="nav-item" key={cat}>
               <a className={`nav-link ${activeCategory === cat ? 'active' : ''}`} href="#"
                 onClick={(e) => { e.preventDefault(); setActiveCategory(cat); }}>
                 {cat}
               </a>
             </li>
           ))}
           <li className="nav-item">
             <button type="button" className="btn-custom" data-bs-toggle="modal" data-bs-target="#addHiloModal">
               + Añadir hilo
             </button>
           </li>
         </ul>

         {/* Listado */}
         <div className="hilos-wrapper">
           {loading ? <p className="text-white">Cargando servidores...</p> : 
            filteredHilos.map((hilo) => (
             <div className="card custom-card mb-3" key={hilo.id} onClick={() => handleCardClick(hilo)} style={{ cursor: 'pointer' }}>
               <div className="card-body">
                 <h5 className="card-title">{hilo.title}</h5>
                 <p className="card-text text-muted small">Por {hilo.authorname} - {hilo.createDt ? hilo.createDt.split('T')[0] : ''}</p>
                 <img className="img-top" src={hilo.imageUri} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} alt={hilo.title} 
                   onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/333/fff?text=No+Image')} />
                 <div className="d-flex justify-content-between text-secondary mt-2">
                   <span className="badge bg-dark">{hilo.category}</span>
                 </div>
               </div>
             </div>
           ))}
         </div>
       </main>
     </div>

     {/* Modal para añadir hilo (Actualizado con campos reales) */}
     <div className="modal fade" id="addHiloModal" tabIndex={-1} aria-hidden="true">
       <div className="modal-dialog">
         <div className="modal-content custom-modal">
           <div className="modal-header custom-modal-header">
             <h5 className="modal-title">Nueva Publicación</h5>
             <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
           </div>
           <div className="modal-body">
             <form>
               <div className="mb-3">
                 <label className="form-label">Categoría</label>
                 <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                   <option value="" disabled>Selecciona...</option>
                   {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                 </select>
               </div>
               <div className="mb-3">
                 <label className="form-label">Título</label>
                 <input type="text" className="form-control" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título breve" />
               </div>
               <div className="mb-3">
                 <label className="form-label">Descripción</label>
                 <textarea className="form-control" rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Contenido del post..."></textarea>
               </div>
               <div className="mb-3">
                 <label className="form-label">URL Imagen</label>
                 <input type="url" className="form-control" value={urlImagen} onChange={(e) => setUrlImagen(e.target.value)} placeholder="https://..." />
               </div>
               <button type="button" onClick={handleSubmitHilo} className="btn btn-primary w-100">Publicar</button>
             </form>
           </div>
         </div>
       </div>
     </div>
   </>
 );
};

export default Principal;