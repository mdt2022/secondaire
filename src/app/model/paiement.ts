export interface Paiement {
  id?: number;
  montant: number;
  eleve: any;     // ou type Eleve si tu as déjà l'interface Eleve
  datepaie: string;
  enlettre: string;
  anneeuv: any;
  motif: string;
  classe: any;
  ecole: any;
  numerorecu: string;
}