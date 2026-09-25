import { Matiere } from './matiere';
import { Classe } from './classe';
import { Enseignant } from './enseignant';
import { Ecole } from './ecole';
import { Anneeuv } from './anneeuv';

export interface Enseigner {
nbreheure: any;
  id: number;
  matiere: Matiere;
  classe: Classe;
  enseignant: Enseignant;
  ecole: Ecole;
  anneeuv: Anneeuv;
}