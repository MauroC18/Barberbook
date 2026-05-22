function ServicioCard({ servicio, onSeleccionar }) {
  return (
    <div className="servicio-card" onClick={() => onSeleccionar(servicio)}>
      <div className="servicio-card-icono">{servicio.emoji || '✂️'}</div>
      <h3 className="servicio-card-nombre">{servicio.nombre}</h3>
      <p className="servicio-card-descripcion">Servicio profesional con productos premium</p>
      <div className="servicio-card-footer">
        <span className="servicio-card-precio">${servicio.precio.toLocaleString()}</span>
        <span className="servicio-card-duracion">⏱ {servicio.duracion} min</span>
      </div>
    </div>
  )
}

export default ServicioCard