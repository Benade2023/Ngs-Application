export interface CertifMedical {
    id?: string;
    date: string;
    dateEmission?: string;
    dateExpiration: string;
    valide: boolean;
    medecin: string;
    document?: string;
    filePath?: string;
    type?: string;
}
