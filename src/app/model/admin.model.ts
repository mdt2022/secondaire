import { Ecole } from '../model/ecole.model';
import { Role } from '../model/role.model';


export interface Administrateur{  
    id:number;
    nom:string;
    prenom:string;
    adresse:string;
    telephone:string;
    email:string;
    lieun:string;
    datedn:string;
    photo:string;    
    username:string;
    password:string;
    ecole:Ecole;
    role:Role;
}

