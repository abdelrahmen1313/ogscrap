import { fetchPageMetadata } from "ogscrap";

const data = await fetchPageMetadata("https://fr.wikipedia.org/wiki/Ski_acrobatique_aux_Jeux_olympiques_de_2026");
console.log(data);