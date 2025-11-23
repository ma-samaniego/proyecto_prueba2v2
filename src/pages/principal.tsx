import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importamos hook de navegación
import '../css/principal.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { initialHilosData } from '../data/hilosData'; // Usamos los datos centralizados

const categories = ['Shooter', 'RPG', 'Indie', 'Noticias', 'Retro'];

const Principal: React.FC = () => {
 const [hilos, setHilos] = useState(initialHilosData);
 const [activeCategory, setActiveCategory] = useState('Shooter');
 
 // Estados del formulario
 const [categoria, setCategoria] = useState('');
 const [mensaje, setMensaje] = useState('');
 const [urlImagen, setUrlImagen] = useState('');
 
 const navigate = useNavigate();

 const handleCategoryClick = (category: string) => {
   setActiveCategory(category);
 };

 // --- FUNCIÓN DE CLIC EN TARJETA ---
 const handleCardClick = (hilo: any) => {
    // Navegamos y pasamos el objeto hilo completo
    navigate(`/hilo/${hilo.id}`, { state: { hilo } });
 };

 const handleSubmitHilo = () => {
   if (!categoria) { alert("Debes seleccionar una categoría"); return; }
   if (!mensaje.trim()) { alert("Debes escribir un mensaje"); return; }

   const newHilo = {
     id: Date.now(), 
     title: mensaje, 
     author: 'Usuario', 
     imageUrl: urlImagen || 'https://placehold.co/600x400/333/fff?text=Nuevo+Hilo',
     likes: 0,
     comments: 0,
     category: categoria,
     content: 'Contenido generado por el usuario.',
     date: new Date().toLocaleDateString()
   };

   setHilos([newHilo, ...hilos]);
   setActiveCategory(categoria);
   setCategoria('');
   setMensaje('');
   setUrlImagen('');

   // Cerrar modal
   // @ts-ignore
   const modalElement = document.getElementById('addHiloModal');
   if (modalElement && typeof bootstrap !== 'undefined') {
     // @ts-ignore
     const modalInstance = bootstrap.Modal.getInstance(modalElement);
     if (modalInstance) modalInstance.hide();
   }
 };

 const filteredHilos = hilos.filter(hilo => hilo.category === activeCategory);

 return (
   <>
     <div className="main-wrapper">
       <main className="container mt-4">
         <h2 className="text-white mb-4">PixelHub</h2>
         
         <ul className="nav nav-pills mb-4">
           {categories.map((cat) => (
             <li className="nav-item" key={cat}>
               <a 
                 className={`nav-link ${activeCategory === cat ? 'active' : ''}`} 
                 href="#"
                 onClick={(e) => { e.preventDefault(); handleCategoryClick(cat); }}
               >
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

         <div className="hilos-wrapper">
           {filteredHilos.map((hilo) => (
             <div 
                className="card custom-card mb-3" 
                key={hilo.id}
                // --- AGREGAMOS EL EVENTO ONCLICK ---
                onClick={() => handleCardClick(hilo)}
                style={{ cursor: 'pointer' }}
             >
               <div className="card-body">
                 <h5 className="card-title">{hilo.title}</h5>
                 <p className="card-text">{hilo.author}</p>
                 <img 
                   className="img-top" 
                   src={hilo.imageUrl} 
                   style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} 
                   alt={`Imagen de ${hilo.title}`} 
                   onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400/333/fff?text=Imagen+No+Encontrada')}
                 />
                 <div className="d-flex justify-content-between text-secondary mt-2">
                   <span>👍 {hilo.likes}</span>
                   <span>💬 {hilo.comments}</span>
                   <span className="badge bg-dark">{hilo.category}</span>
                 </div>
               </div>
             </div>
           ))}
           
           {filteredHilos.length === 0 && (
             <div className="text-white text-center p-5">
               <h4>No hay hilos en esta categoría.</h4>
               <p>¡Sé el primero en publicar!</p>
             </div>
           )}
         </div>
       </main>
     </div>

     {/* Modal para añadir hilo */}
     <div className="modal fade" id="addHiloModal" tabIndex={-1} aria-labelledby="addHiloModalLabel" aria-hidden="true">
       <div className="modal-dialog">
         <div className="modal-content custom-modal">
           <div className="modal-header custom-modal-header">
             <h5 className="modal-title" id="addHiloModalLabel">Añadir nuevo hilo</h5>
             <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
           </div>
           <div className="modal-body">
             <form>
               <div className="mb-3">
                 <label htmlFor="categoria" className="form-label">Categoría</label>
                 <select className="form-select" id="categoria" required value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                   <option value="" disabled>Selecciona una categoría</option>
                   {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                 </select>
               </div>
               <div className="mb-3">
                 <label htmlFor="mensaje" className="form-label">Mensaje (Título)</label>
                 <textarea className="form-control" id="mensaje" rows={3} placeholder="Escribe tu mensaje..." required value={mensaje} onChange={(e) => setMensaje(e.target.value)}></textarea>
               </div>
               <div className="mb-3">
                 <label htmlFor="urlImagen" className="form-label">URL Imagen (Opcional)</label>
                 <input type="url" className="form-control" id="urlImagen" placeholder="https://..." value={urlImagen} onChange={(e) => setUrlImagen(e.target.value)}/>
               </div>
               <button type="button" onClick={handleSubmitHilo} className="btn btn-primary">Publicar hilo</button>
             </form>
           </div>
         </div>
       </div>
     </div>
   </>
 );
};

export default Principal;