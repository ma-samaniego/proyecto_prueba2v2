// src/pages/donaciones.tsx
import React, { useState } from "react";
import '../css/donaciones.css';
import { useNavigate } from "react-router-dom";

const Donaciones: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados
  const [montoSeleccionado, setMontoSeleccionado] = useState<number | null>(null);
  const [montoPersonalizado, setMontoPersonalizado] = useState('');
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [procesando, setProcesando] = useState(false);

  // Opciones de donación
  const opcionesMontos = [5000, 10000, 20000];

  const handleSelectMonto = (monto: number) => {
    setMontoSeleccionado(monto);
    setMontoPersonalizado(''); // Limpiamos el personalizado si elige uno fijo
  };

  const handlePersonalizadoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMontoPersonalizado(e.target.value);
    setMontoSeleccionado(null); // Desmarcamos los botones fijos
  };

  const handleDonar = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación simple
    const montoFinal = montoSeleccionado || Number(montoPersonalizado);
    
    if (!montoFinal || montoFinal <= 0) {
      alert("Por favor selecciona o ingresa un monto válido.");
      return;
    }

    if (!nombreTarjeta.trim() || !numeroTarjeta.trim()) {
      alert("Por favor completa los datos de la tarjeta.");
      return;
    }

    // Simulación de proceso de pago
    setProcesando(true);
    
    setTimeout(() => {
      setProcesando(false);
      alert(`¡Muchas gracias ${nombreTarjeta}! Tu donación de $${montoFinal} ha sido recibida con éxito. Esto nos ayuda a mantener PixelHub vivo.`);
      navigate('/principal');
    }, 2000); // Simula 2 segundos de espera
  };

  return (
    <div className="donaciones-container">
      <div className="donaciones-header">
        <h2>Apoya a PixelHub 👾</h2>
        <p>Ayúdanos a mantener los servidores activos y a seguir desarrollando la mejor comunidad gamer.</p>
      </div>

      <form onSubmit={handleDonar}>
        {/* Selección de Monto */}
        <h5 className="text-start mb-3">Selecciona un monto:</h5>
        <div className="montos-grid">
          {opcionesMontos.map((monto) => (
            <button
              type="button"
              key={monto}
              className={`btn-monto ${montoSeleccionado === monto ? 'seleccionado' : ''}`}
              onClick={() => handleSelectMonto(monto)}
            >
              ${monto.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Monto Personalizado */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="O ingresa otro monto (CLP)"
            className="form-control input-custom-monto"
            value={montoPersonalizado}
            onChange={handlePersonalizadoChange}
            min="1000"
          />
        </div>

        {/* Datos de Tarjeta (Simulado) */}
        <div className="tarjeta-simulada">
            <h5 className="mb-3 text-white">Detalles del Pago (Simulación)</h5>
            
            <div className="mb-3">
                <label className="form-label text-white">Nombre en la tarjeta</label>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ej: Juan Pérez"
                    value={nombreTarjeta}
                    onChange={(e) => setNombreTarjeta(e.target.value)}
                />
            </div>

            <div className="row">
                <div className="col-8">
                    <label className="form-label text-white">Número de tarjeta</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="0000 0000 0000 0000"
                        maxLength={16}
                        value={numeroTarjeta}
                        onChange={(e) => setNumeroTarjeta(e.target.value)}
                    />
                </div>
                <div className="col-4">
                    <label className="form-label text-white">CVC</label>
                    <input type="text" className="form-control" placeholder="123" maxLength={3}/>
                </div>
            </div>
        </div>

        <button type="submit" className="btn-donar" disabled={procesando}>
          {procesando ? 'Procesando...' : 'Realizar Donación ❤️'}
        </button>
        
        <button 
            type="button" 
            className="btn btn-link text-white mt-2 text-decoration-none"
            onClick={() => navigate('/principal')}
        >
            Volver sin donar
        </button>

      </form>
    </div>
  );
};

export default Donaciones;