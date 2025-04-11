import { Anneeuv } from "./anneeuv.model";
import { Classe } from "./classe.model";
import { Ecole } from "./ecole.model";
import { Eleve } from "./eleve.model";
import { Academie } from './academie.model';

export interface EleveEcole {
  id: number;
  eleve: Eleve;
  classe: Classe;
  ecole: Ecole;
  anneeuv: Anneeuv;
  academie: Academie;
}
