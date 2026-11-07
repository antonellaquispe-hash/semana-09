export default function MovieSkeleton() {
  return (
    <div className="premiere-skeleton" aria-label="Cargando estrenos" role="status">
      <span className="visually-hidden">Cargando próximos estrenos</span>
      <div className="skeleton-poster placeholder-glow"><span className="placeholder col-12" /></div>
      <div className="skeleton-copy placeholder-glow">
        <span className="placeholder col-8" /><span className="placeholder col-5" />
      </div>
    </div>
  );
}
