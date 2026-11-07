import { useState } from "react";

export default function PremiereCarousel({ movies }) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (movies.length === 0) return null;
  const activeMovie = movies[activeIndex % movies.length];

  return (
    <div className="premiere-carousel carousel slide" aria-roledescription="carrusel" aria-label="Próximos estrenos">
      <article className="premiere-slide" aria-live="polite">
        <img src={activeMovie.image} alt="" />
        <div><p className="eyebrow">PRÓXIMAMENTE</p><h3>{activeMovie.title}</h3><p>{activeMovie.synopsis}</p><p>Clasificación {activeMovie.classification} · ★ {activeMovie.rating}</p></div>
      </article>
      <div className="carousel-controls">
        <button type="button" className="button button-secondary" onClick={() => setActiveIndex((index) => (index - 1 + movies.length) % movies.length)} aria-label="Estreno anterior">Anterior</button>
        <span aria-live="polite">{(activeIndex % movies.length) + 1} / {movies.length}</span>
        <button type="button" className="button button-secondary" onClick={() => setActiveIndex((index) => (index + 1) % movies.length)} aria-label="Siguiente estreno">Siguiente</button>
      </div>
    </div>
  );
}
