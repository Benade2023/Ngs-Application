import { CarteMarine } from "./carte-marine";
import { CertifMedical } from "./certif-medical";
import { Habilitation } from "./habilitation";
import { Induction } from "./induction";

export interface Employes {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    cni: string;
    dateNaissance: string;
    sexe: string;
    fonction: string;
    induction?: Induction;
    habilitation?: Habilitation | 'pending';
    certificatMedical?: CertifMedical | 'pending';
    carteMarine?: CarteMarine;
    typeContrat: string;
    statut: string;
    dateDebut: string;
    dateFin?: string;
    service: string;
    manager: string;
    avatar: string;
    password: string;
    deuxFacteurs?: boolean;
    derniereConnexion?: Date; 
    dateCreation?: Date;  
    preferences?: {
        theme: 'clair' | 'sombre' | 'systeme';
        notifications: boolean;
        emailNotifications: boolean;
        langue: 'fr' | 'en';
        dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    };
}

export interface EmployeResponse {
    employes: Employes[];
    total: number;
}

