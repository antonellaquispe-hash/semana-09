import Showtimes from "./Showtimes.jsx";
import Synopsis from "./Synopsis.jsx";

export default function MovieCard({ movie }) {
  return (
    <article className="movie-card" id={`horarios-${movie.id}`}>
      <img src={movie.image} alt={movie.title} loading="lazy" />
      <div className="movie-card-content">
        <p className="classification">{movie.classification}</p>
        <h3>{movie.title}</h3>
        <p className="rating" aria-label={`Valoración ${movie.rating} de 5`}>★ {movie.rating}</p>
        <Synopsis text={movie.synopsis} />
        <h4>Horarios</h4>
        <Showtimes times={movie.showtimes} />
      </div>
    </article>
  );
}
