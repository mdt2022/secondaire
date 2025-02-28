import { Anneeuv } from "./anneeuv.model";
import { Classe } from "./classe.model";
import { Ecole } from "./ecole.model";
import { Eleve } from "./eleve.model";

export class Paiementsecondaire{
    id!: number;
    montant!: string;
    eleve!: Eleve;
    datepaie!: string;
    enlettre!: string;
    anneeuv!: Anneeuv;
    motif!: string;
    classe!: Classe;
    ecole!: Ecole;
    numerorecu!: string;
}