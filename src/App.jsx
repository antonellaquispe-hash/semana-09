import { useCallback, useEffect, useState } from "react";
import { Header, Hero, MovieList, Footer } from "@cartelera/index.jsx";
import { contact, links, movies as sourceMovies } from "./data/movies.js";
import { adaptMovie } from "./adapters/movieAdapter.js";
import useWindowSize from "./hooks/useWindowSize.js";
import usePremieres from "./hooks/usePremieres.js";
import MovieSkeleton from "./components/MovieSkeleton.jsx";
import PremiereCarousel from "./components/PremiereCarousel.jsx";
import Toast from "./components/Toast.jsx";

const FAVORITES_STORAGE_KEY = "cinetecsup:favorites";
const movies = sourceMovies.map(adaptMovie);

function readFavoriteIds() {
  try {
    const storedFavorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]");
    return Array.isArray(storedFavorites) ? storedFavorites.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

function PremiereSection() {
  const { status, movies: premieres, error, retry } = usePremieres();

  return (
    <section id="proximamente" className="coming-soon" aria-labelledby="premieres-title">
      <p className="eyebrow">NUEVAS HISTORIAS</p>
      <h2 id="premieres-title">Próximos estrenos</h2>
      {status === "loading" && <div className="skeleton-grid" aria-busy="true"><MovieSkeleton /><MovieSkeleton /><MovieSkeleton /></div>}
      {status === "error" && <div className="premiere-error" role="alert"><p>{error}</p><button className="button button-secondary" onClick={retry}>Volver a intentar</button></div>}
      {status === "success" && <PremiereCarousel movies={premieres} />}
    </section>
  );
}

export default function App() {
  const featuredMovie = movies[0];
  const [favoriteIds, setFavoriteIds] = useState(readFavoriteIds);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const { width } = useWindowSize();
  const columnCount = width < 600 ? 1 : width < 920 ? 2 : width < 1240 ? 3 : 4;

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const applySearch = useCallback((query) => setSearchQuery(query), []);
  const dismissToast = useCallback(() => setToastMessage(""), []);

  function toggleFavorite(movieId) {
    const wasFavorite = favoriteIds.includes(movieId);
    setFavoriteIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    );
    const movie = movies.find((item) => item.id === movieId);
    setToastMessage(`${movie?.title ?? "Película"} ${wasFavorite ? "se quitó de" : "se agregó a"} tus favoritas.`);
  }

  function clearSearch() {
    setSearchText("");
    setSearchQuery("");
  }

  return (
    <>
      <Header name="Cine Tecsup" links={links} favoriteCount={favoriteIds.length} />
      <main>
        <Hero
          movie={featuredMovie}
          searchText={searchText}
          onSearch={applySearch}
          onSearchTextChange={setSearchText}
          onClearSearch={clearSearch}
        />
        <section id="cartelera" aria-labelledby="movies-title">
          <div className="section-heading">
            <p className="eyebrow">EN PANTALLA</p>
            <h2 id="movies-title">Nuestra cartelera</h2>
            <p>Elige tu próxima historia y encuentra el horario ideal.</p>
          </div>
          <MovieList
            movies={movies}
            query={searchQuery}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onClearSearch={clearSearch}
            style={{ "--movie-columns": columnCount }}
          />
        </section>
        <PremiereSection />
      </main>
      <Footer contact={contact} />
      <Toast message={toastMessage} onDismiss={dismissToast} />
    </>
  );
}
