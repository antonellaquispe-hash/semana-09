import { useEffect, useState } from "react";
import Button from "./Button.jsx";

const SEARCH_DELAY_MS = 350;

export default function MovieSearch({ onSearch = () => {} }) {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const normalizedText = searchText.trim();
      if (import.meta.env.DEV) console.debug("Búsqueda aplicada:", normalizedText || "toda la cartelera");
      onSearch(normalizedText);
    }, SEARCH_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchText, onSearch]);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(searchText.trim());
  }

  function handleClear() {
    setSearchText("");
    onSearch("");
  }

  return (
    <form className="movie-search" role="search" onSubmit={handleSubmit}>
      <label htmlFor="movie-search-input">Encuentra tu próxima película</label>
      <div className="movie-search-controls">
        <input
          id="movie-search-input"
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Buscar por título o historia"
          autoComplete="off"
        />
        <Button type="submit" variant="primary">Buscar película</Button>
        {searchText && <Button type="button" variant="quiet" onClick={handleClear}>Limpiar</Button>}
      </div>
      <span className="search-hint">Los resultados se actualizan al terminar de escribir.</span>
    </form>
  );
}
