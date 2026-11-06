import MovieCard from "./MovieCard.jsx";
import Button from "../../components/Button.jsx";

export default function MovieList({ movies, query = "", favoriteIds = [], onToggleFavorite = () => {}, onClearSearch = () => {} }) {
  const normalizedQuery = query.trim().toLocaleLowerCase("es");
  const matchingMovies = movies.filter((movie) =>
    `${movie.title} ${movie.synopsis}`.toLocaleLowerCase("es").includes(normalizedQuery),
  );

  if (matchingMovies.length === 0) {
    return (
      <div className="empty-state" role="status">
        <span className="empty-state-icon" aria-hidden="true">⌕</span>
        <h3>No encontramos esa película</h3>
        <p>Prueba con otro título o limpia tu búsqueda para ver toda la cartelera.</p>
        <Button variant="secondary" onClick={onClearSearch}>Limpiar búsqueda</Button>
      </div>
    );
  }

  return (
    <ul className="movie-list">
      {matchingMovies.map((movie) => (
        <li key={movie.id}>
          <MovieCard
            movie={movie}
            isFavorite={favoriteIds.includes(movie.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  );
}
