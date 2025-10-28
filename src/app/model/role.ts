import { Categorie } from "./categorie";

export interface Role{
    id?: number;
    nom: string;
    description?: string;
    categorie?: Categorie | null;
}