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
    habilitation?: Habilitation;
    certificatMedical?: CertifMedical;
    carteMarine?: CarteMarine;
    typeContrat: string;
    statut: string;
    dateDebut: string;
    dateFin?: string;
    service: string;
    manager: string;
    avatar: string;
}

export interface EmployeResponse {
    employes: Employes[];
    total: number;
}

