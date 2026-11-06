import { Header, Hero, MovieList, Footer } from "@cartelera/index.jsx";
import { contact, links, movies } from "./data/movies.js";

export default function App() {
  const featuredMovie = movies[0];

  return (
    <>
      <Header name="Cine Tecsup" links={links} />
      <main>
        <Hero movie={featuredMovie} />
        <section id="cartelera" aria-labelledby="movies-title">
          <div className="section-heading">
            <p className="eyebrow">EN PANTALLA</p>
            <h2 id="movies-title">Nuestra cartelera</h2>
            <p>Elige tu próxima historia y encuentra el horario ideal.</p>
          </div>
          <MovieList movies={movies} />
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
