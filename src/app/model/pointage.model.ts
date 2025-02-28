import { Emploidutemp } from './emploidutemp.model';
import { Enseignant } from './enseignant.model';

export class Pointage{
    id!: number;
    emploidutemp!: Emploidutemp;
    enseignant!: Enseignant;
    valider!: string;
    datevalider!: string;

}