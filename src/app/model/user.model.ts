import { Administrateur } from "./admin.model";
import { Parametre } from "./parametre.model";

export interface User{
    administrateur: Administrateur;
    parametre: Parametre;
}
