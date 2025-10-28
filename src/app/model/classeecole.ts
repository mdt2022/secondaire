import { Classe } from '../model/classe';
import { Ecole } from '../model/ecole';

export interface ClasseEcole {
  id?: number;
  classe: Classe;
  ecole: Ecole;
}