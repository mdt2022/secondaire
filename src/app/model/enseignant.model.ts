import { Ecole } from "./ecole.model";

export class Enseignant{
    id!: number;
    matricule!: string;
    nom!: string;
    prenom!: string;
    adresse!: string;
    telephone!: string;
    email!: string;
    lieun!: string;
    datedn!: string;
    photo!: string;
    ecole!: Ecole;
    tarif!: number;
}