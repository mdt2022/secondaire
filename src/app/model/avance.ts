export interface Avance {
  id?: number;
  montant: number;
  mois: number;
  anneescolaire: string;
  dateempreint: string;
  paie?: number;
  datedepaie?: string;
  enseignant: any;
}