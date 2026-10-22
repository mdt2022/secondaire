import { Categorie } from './categorie';

export interface Ecole{
    id?: number;
    idEcole: number;
    nomEcole: string;
    descriptionEcole: string;
    adresseEcole: string;
    categorie?: Categorie | null;
}

export type EcolePayload = Pick<Ecole, 'nomEcole' | 'descriptionEcole' | 'adresseEcole'> & {
    idEcole?: number;
    categorie?: Categorie | null;
};