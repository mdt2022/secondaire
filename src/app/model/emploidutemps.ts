import { Enseignant } from "./enseignant";
import { Matiere } from "./matiere";
import { Classe } from "./classe";
import { Ecole } from "./ecole";
import { Anneeuv } from "./anneeuv";

export interface Emploidutemps {
nbreheure: any;
  enseignant: any;
  id?: number;
  jour: string;
  heuredebut: string;
  heurefin: string;
  matiere: Matiere;
  professeur: Enseignant;
  classe: Classe;
  ecole: Ecole;
  anneeuv: Anneeuv;
}
