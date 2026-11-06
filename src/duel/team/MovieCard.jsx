import Showtimes from "./Showtimes.jsx";
import Synopsis from "./Synopsis.jsx";
import Button from "../../components/Button.jsx";

export default function MovieCard({ movie, isFavorite = false, onToggleFavorite = () => {} }) {
  return (
    <article className="movie-card" id={`horarios-${movie.id}`}>
      <img src={movie.image} alt={movie.title} loading="lazy" />
      <div className="movie-card-content">
        <p className="classification">{movie.classification}</p>
        <h3>{movie.title}</h3>
        <p className="rating" aria-label={`Valoración ${movie.rating} de 5`}>★ {movie.rating}</p>
        <Button
          variant={isFavorite ? "favorite-active" : "favorite"}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? "Quitar de favoritas" : "Agregar a favoritas"}
          onClick={() => onToggleFavorite(movie.id)}
        >
          {isFavorite ? "♥ En favoritas" : "♡ Agregar a favoritas"}
        </Button>
        <Synopsis text={movie.synopsis} />
        <h4>Horarios</h4>
        <Showtimes times={movie.showtimes} inline />
      </div>
    </article>
  );
}
