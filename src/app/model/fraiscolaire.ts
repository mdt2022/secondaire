import { Classe } from '../model/classe';
import { Ecole } from '../model/ecole';
import { Eleve } from '../model/eleve';
import { Anneeuv } from '../model/anneeuv';
export interface Fraiscolaire {
  id?: number;
  ecole: Ecole;   // {id, nom} 
  classe: Classe;  // {id, nom} 
  eleve: Eleve;   // {id, nom, prenom} 
  anneeuv: Anneeuv; // {id, nom, debutannee, finannee} 
  montant: number;
  reduction: number;
}
