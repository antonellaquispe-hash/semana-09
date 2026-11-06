import { useEffect, useState } from "react";
import { Header, Hero, MovieList, Footer } from "@cartelera/index.jsx";
import { contact, links, movies } from "./data/movies.js";

const FAVORITES_STORAGE_KEY = "cinetecsup:favorites";

function readFavoriteIds() {
  try {
    const storedFavorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]");
    return Array.isArray(storedFavorites) ? storedFavorites.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const featuredMovie = movies[0];
  const [favoriteIds, setFavoriteIds] = useState(readFavoriteIds);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  function toggleFavorite(movieId) {
    setFavoriteIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    );
  }

  return (
    <>
      <Header name="Cine Tecsup" links={links} />
      <main>
        <Hero movie={featuredMovie} onSearch={setSearchQuery} />
        <section id="cartelera" aria-labelledby="movies-title">
          <div className="section-heading">
            <p className="eyebrow">EN PANTALLA</p>
            <h2 id="movies-title">Nuestra cartelera</h2>
            <p>Elige tu próxima historia y encuentra el horario ideal.</p>
            <p className="favorite-count" aria-live="polite">
              {favoriteIds.length === 1 ? "1 película favorita guardada" : `${favoriteIds.length} películas favoritas guardadas`}
            </p>
          </div>
          <MovieList
            movies={movies}
            query={searchQuery}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onClearSearch={() => setSearchQuery("")}
          />
        </section>
        <section id="proximamente" className="coming-soon">
          <p className="eyebrow">PRÓXIMAMENTE</p>
          <p>Nuevas historias llegan muy pronto a nuestras salas.</p>
        </section>
      </main>
      <Footer contact={contact} />
    </>
  );
}
