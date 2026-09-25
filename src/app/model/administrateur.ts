import { Ecole } from "./ecole";
import { Role } from "./role";

export interface AffectationAdministrateur {
    id?: number;
    ecole: Ecole;
    role: Role;
}

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
    affectations?: AffectationAdministrateur[];
    photo: string;
    online: boolean
    // Ajoutez cette ligne ⬇️
    active: boolean;
}