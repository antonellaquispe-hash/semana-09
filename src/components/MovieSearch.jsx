import { useEffect } from "react";
import Button from "./Button.jsx";
import useDebounce from "../hooks/useDebounce.js";

const SEARCH_DELAY_MS = 350;

export default function MovieSearch({ value = "", onChange = () => {}, onSearch = () => {} }) {
  const debouncedSearchText = useDebounce(value, SEARCH_DELAY_MS);

  useEffect(() => {
    const normalizedText = debouncedSearchText.trim();
    if (import.meta.env.DEV) console.debug("Búsqueda aplicada:", normalizedText || "toda la cartelera");
    onSearch(normalizedText);
  }, [debouncedSearchText, onSearch]);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(value.trim());
  }

  function handleClear() {
    onChange("");
    onSearch("");
  }

  return (
    <form className="movie-search" role="search" onSubmit={handleSubmit}>
      <label htmlFor="movie-search-input">Encuentra tu próxima película</label>
      <div className="movie-search-controls">
        <input
          id="movie-search-input"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar por título o historia"
          autoComplete="off"
        />
        <Button type="submit" variant="primary">Buscar película</Button>
        {value && <Button type="button" variant="quiet" onClick={handleClear}>Limpiar</Button>}
      </div>
      <span className="search-hint">Los resultados se actualizan al terminar de escribir.</span>
    </form>
  );
}
