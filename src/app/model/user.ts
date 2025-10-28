import { Administrateur } from "./administrateur";
import { Parametre } from "./parametre";

export interface User{
    administrateur: Administrateur;
    parametre: Parametre;
}