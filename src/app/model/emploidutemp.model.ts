import { Enseignant } from "./enseignant.model";
import { Matiere } from "./matiere.model";
import { Classe } from "./classe.model";
import { Ecole } from "./ecole.model";
import { Anneeuv } from "./anneeuv.model";

export interface Emploidutemp{
    id: number;
    jour: string;
    matiere: Matiere;
    professeur: Enseignant;
    heuredebut: string;
    heurefin: string;
    classe: Classe;
    ecole: Ecole;
    anneeuv: Anneeuv;
    coefficient: number;
    duree: number;
}