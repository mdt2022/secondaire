import { Emploidutemps } from "./emploidutemps";
import { Enseignant } from "./enseignant";

export interface Pointage {
  id: number;
  emploidutemps: Emploidutemps;
  enseignant: Enseignant;
  valider: string;
  datevalider: string;
}

export interface RecherchePointage {
  ecoleId?: number;
  enseignantId?: number;
  dateDebut?: string;
  dateFin?: string;
}

export interface SimulationPaiement {
  enseignantId: number;
  dateDebut: string;
  dateFin: string;
}

export interface ResultatSimulation {
  enseignantNom: string;
  enseignantPrenom: string;
  totalHeures: number;
  tauxHeure: number;
  montantBrut: number;
  avance: number;
  montantNet: number;
  dateDebut: string;
  dateFin: string;
}