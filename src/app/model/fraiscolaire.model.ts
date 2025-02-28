import { Ecole } from "./ecole.model";
import { Anneeuv } from "./anneeuv.model";
import { Classe } from './classe.model';
import { Eleve } from './eleve.model';

export class Fraiscolaire{
    id!: number;
    ecole!: Ecole;
    classe!: Classe;
    eleve!: Eleve;
    anneeuv!: Anneeuv;
    montant!: number;
    reduction!: number;
}