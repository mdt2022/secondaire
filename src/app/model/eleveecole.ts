import { Academie } from "./academie";
import { Anneeuv } from "./anneeuv";
import { Classe } from "./classe";
import { Ecole } from "./ecole";
import { Eleve } from "./eleve";

export interface Eleveecole {
  id?: number;
  eleve: Eleve;      // ou type Eleve si tu as l'interface Eleve
  ecole: Ecole;
  classe: Classe;
  anneeuv: Anneeuv;
  academie: Academie;
}
