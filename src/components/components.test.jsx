import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import App from "../App.jsx";
import { movies } from "../data/movies.js";
import Button from "./Button.jsx";
import MovieSearch from "./MovieSearch.jsx";
import MovieList from "../duel/team/MovieList.jsx";

describe("Componentes y eventos de la cartelera", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("Button reusa children y aplica la variante indicada", () => {
    render(<Button variant="secondary">Ver más</Button>);
    expect(screen.getByRole("button", { name: "Ver más" })).toHaveClass("button-secondary");
  });

  test("MovieSearch controla el texto y notifica al padre al terminar el retardo", () => {
    vi.useFakeTimers();
    vi.spyOn(console, "debug").mockImplementation(() => {});
    const onSearch = vi.fn();
    render(<MovieSearch onSearch={onSearch} />);
    const input = screen.getByRole("searchbox", { name: "Encuentra tu próxima película" });

    fireEvent.change(input, { target: { value: "jardín" } });
    expect(input).toHaveValue("jardín");
    expect(onSearch).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(350));
    expect(onSearch).toHaveBeenCalledWith("jardín");
  });

  test("MovieList filtra por título y muestra el estado vacío con acción para limpiar", () => {
    const onClearSearch = vi.fn();
    const { rerender } = render(<MovieList movies={movies} query="vidrio" />);
    expect(screen.getByRole("heading", { name: "El Jardín de Vidrio" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "La Última Función" })).not.toBeInTheDocument();

    rerender(<MovieList movies={movies} query="título imposible" onClearSearch={onClearSearch} />);
    expect(screen.getByRole("status")).toHaveTextContent("No encontramos esa película");
    fireEvent.click(screen.getByRole("button", { name: "Limpiar búsqueda" }));
    expect(onClearSearch).toHaveBeenCalledOnce();
  });

  test("MovieCard comunica el evento al padre y el favorito persiste al recargar", () => {
    const { unmount } = render(<App />);
    const card = screen.getByRole("heading", { level: 3, name: "La Última Función" }).closest("article");
    fireEvent.click(within(card).getByRole("button", { name: "Agregar a favoritas" }));

    expect(within(card).getByRole("button", { name: "Quitar de favoritas" })).toHaveAttribute("aria-pressed", "true");
    expect(localStorage.getItem("cinetecsup:favorites")).toBe("[1]");
    unmount();

    render(<App />);
    const restoredCard = screen.getByRole("heading", { level: 3, name: "La Última Función" }).closest("article");
    expect(within(restoredCard).getByRole("button", { name: "Quitar de favoritas" })).toHaveAttribute("aria-pressed", "true");
  });
});
