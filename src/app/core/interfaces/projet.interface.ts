export interface Projets {
    id: string;
    nom: string;
    description: string;
    client: string;
    site: string;
    dateDebut: Date;
    dateFin: Date | null;
    status: 'En cours' | 'Terminé' | 'Annulé';
}