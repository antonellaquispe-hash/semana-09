/** Converts the cinema API shape into the view model used by movie cards. */
export function adaptMovie(record) {
  return {
    id: Number(record.id),
    title: record.title ?? record.name ?? "Película sin título",
    image: record.poster_path ?? record.image ?? "/posters/1.svg",
    classification: record.certification ?? record.classification ?? "Por confirmar",
    synopsis: record.overview ?? record.synopsis ?? "Sin sinopsis disponible.",
    rating: Number(record.vote_average ?? record.rating ?? 0),
    showtimes: record.showtimes ?? record.times ?? [],
  };
}
