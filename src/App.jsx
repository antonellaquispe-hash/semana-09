// Lab steps 1-5: show the header before adding the next components.
import { Header } from "@cartelera/index.jsx";
import { links } from "./data/movies.js";

export default function App() {
  return <Header name="Cine Tecsup" links={links} />;
}
