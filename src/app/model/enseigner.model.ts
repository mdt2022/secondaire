import { Ecole } from "./ecole.model";
import { Matiere } from "./matiere.model";
import { Anneeuv } from './anneeuv.model';
import { Classe } from "./classe.model";
import { Enseignant } from "./enseignant.model";

export class Enseigner{
  matiere!:Matiere;
  classe!: Classe;
  enseignant!: Enseignant;
  ecole!:Ecole;
  anneeuv!:Anneeuv;



}
