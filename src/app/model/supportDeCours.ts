import { Classe } from '../model/classe';
export interface SupportDeCours {
  id?: number;
  nom: string;
  classe: Classe;
  nomfichier: string;
}