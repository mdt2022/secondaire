import { Anneeuv } from "./anneeuv.model";
import { Classe } from "./classe.model";

export interface Eleve{
    id: number;
    matricule: string;
    nom: string;
    prenom: string;
    datedn: string;
    lieudn: string;
    prenompere: string;
    prenommere: string;
    nommere: string;
    nationalite: string;
    sexe: string;
    anneeScolaire: Anneeuv;
    classe: Classe
 }


