import { fetchPageMetadata } from "./page-metadata.js";
const data = await fetchPageMetadata("https://medium.com/@pshubham/using-react-with-cordova-f235de698cc3");
console.log(data);
//https://fr.wikipedia.org/wiki/Ski_acrobatique_aux_Jeux_olympiques_de_2026