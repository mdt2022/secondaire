import { Ecole } from "./ecole";
import { Role } from "./role";

export interface Administrateur{
    id: number;
    nom: string;
    prenom: string;   
    email: string;
    telephone: string;
    username: string; 
    password: string;
    role: Role;
    ecole: Ecole;
}