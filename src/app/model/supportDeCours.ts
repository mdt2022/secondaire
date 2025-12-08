import { Classe } from './classe';
import { Matiere } from './matiere';

// Chapitre
export interface ChapitreMeta {
  id?: number;
  titre: string;
  numero: number;
  contenu?: string;
  file?: File | null;   // fichier sélectionné localement
  fichier?: string;      // chemin serveur (read-only)
}

// Types de support
export type TypeSupport = 'COURS' | 'EXERCICE';
export type StructureSupport = 'LIVRE' | 'CHAPITRE';

// Support de cours complet (tel que renvoyé par le backend)
export interface SupportDeCours {
  id?: number;
  nom: string;
  type: TypeSupport;
  structure: StructureSupport;
  classe: Classe;
  matiere: Matiere;
  nomfichier?: string;
  chapitres?: ChapitreMeta[];
}

// DTO pour création ou mise à jour
export interface SupportDTO {
  id?: number;
  nom: string;
  typeSupport: TypeSupport;
  structureSupport: StructureSupport;
  classeId?: number;
  matiereId?: number;
  nomfichier?: string;
  chapitres?: ChapitreMeta[];
}
