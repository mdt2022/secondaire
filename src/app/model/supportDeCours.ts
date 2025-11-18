import { Classe } from '../model/classe';
export interface SupportDeCours {
  id?: number;
  nom: string;
  type: string;
  classe: Classe;
  nomfichier: string;
}
//le nouveau
export interface ChapitreMeta {
  id?: number;
  titre: string;
  numero: number;
  contenu?: string;
  file?: File | null;
  fichier?: string; // chemin serveur (read-only)
}

export type TypeSupport = 'COURS' | 'EXERCICE';
export type StructureSupport = 'LIVRE' | 'CHAPITRE';

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
