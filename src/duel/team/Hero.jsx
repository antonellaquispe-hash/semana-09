import MovieSearch from "../../components/MovieSearch.jsx";
import Button from "../../components/Button.jsx";

export default function Hero({ movie, searchText = "", onSearch, onSearchTextChange = () => {}, onClearSearch = () => {} }) {
  return (
    <section className="hero" aria-label="Destacada" style={{ backgroundImage: `linear-gradient(90deg, rgb(8 12 25 / 92%), rgb(8 12 25 / 25%)), url(${movie.image})` }}>
      <p className="eyebrow">ESTRENO DESTACADO · {movie.classification}</p>
      <h2>{movie.title}</h2>
      <p className="hero-synopsis">{movie.synopsis}</p>
      <a href={`#horarios-${movie.id}`}>Ver horarios</a>
      <MovieSearch value={searchText} onChange={onSearchTextChange} onSearch={onSearch} />
      {searchText && <Button variant="secondary" onClick={onClearSearch}>Limpiar filtro</Button>}
    </section>
  );
}
