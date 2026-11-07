import { useCallback, useEffect, useState } from "react";
import useDebounce from "./useDebounce.js";
import { adaptMovie } from "../adapters/movieAdapter.js";

const PREMIERE_RECORDS = [
  { id: 101, name: "Horizonte de Sal", poster_path: "/posters/6.svg", certification: "14+", overview: "Una expedición sigue una señal que aparece cada noche en el litoral.", vote_average: 4.6, times: ["Jueves", "Viernes"] },
  { id: 102, name: "Los días de junio", poster_path: "/posters/4.svg", certification: "APT", overview: "Dos hermanas reconstruyen el cine de barrio que heredaron.", vote_average: 4.4, times: ["Viernes", "Sábado"] },
  { id: 103, name: "Frecuencia Lima", poster_path: "/posters/3.svg", certification: "14+", overview: "Una locutora recibe llamadas que todavía no han ocurrido.", vote_average: 4.8, times: ["Sábado", "Domingo"] },
];

export async function requestPremieres() {
  await new Promise((resolve) => window.setTimeout(resolve, 650));
  if (new URLSearchParams(window.location.search).has("premieresError")) {
    throw new Error("No se pudieron cargar los próximos estrenos. Inténtalo de nuevo.");
  }
  return PREMIERE_RECORDS.map(adaptMovie);
}

export default function usePremieres() {
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ status: "loading", movies: [], error: "" });
  const stableReloadKey = useDebounce(reloadKey, 0);

  const retry = useCallback(() => {
    setResult({ status: "loading", movies: [], error: "" });
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let active = true;
    setResult({ status: "loading", movies: [], error: "" });
    requestPremieres()
      .then((premiereMovies) => {
        if (active) setResult({ status: "success", movies: premiereMovies, error: "" });
      })
      .catch((error) => {
        if (active) setResult({ status: "error", movies: [], error: error.message });
      });
    return () => { active = false; };
  }, [stableReloadKey]);

  return { ...result, retry };
}
