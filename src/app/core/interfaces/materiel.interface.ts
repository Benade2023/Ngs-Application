export interface Categorie {
  id: string;
  nom: string;
  description: string;
}

export interface Fournisseur {
  id: string;
  nom: string;
  contact: string;
  telephone: string;
  email: string;
  adresse: string;
}

export interface Materiel {
  id: string;
  code: string; // Code unique du matériel (ex: MAT-001)
  nom: string;
  description: string;
  categorieId: string;
  categorieNom: string;
  type: 'consommable' | 'materiel_travail' | 'equipement' | 'outillage';
  unite: string; // pièce, mètre, kg, litre
  quantiteStock: number;
  quantiteMinimale: number; // Seuil d'alerte
  emplacement: string; // Localisation dans le magasin
  fournisseurId: string;
  prixUnitaire: number;
  dateAjout: Date;
  dateDerniereSortie?: Date;
  dateDerniereEntree?: Date;
  actif: boolean;
  image?: string;
}

export interface MouvementStock {
  id: string;
  materielId: string;
  materielCode: string;
  materielNom: string;
  type: 'entree' | 'sortie' | 'retour';
  quantite: number;
  date: Date;
  motif: string;
  destination?: string; // Pour les sorties
  provenance?: string; // Pour les entrées
  utilisateur: string;
  projetId?: string;
  projetNom?: string;
  reference?: string; // N° de bon de commande, livraison
}

export interface LocationMateriel {
  id: string;
  materielId: string;
  materielCode: string;
  materielNom: string;
  quantite: number;
  dateDebut: Date;
  dateFinPrevue: Date;
  dateFinReelle?: Date;
  statut: 'en_cours' | 'termine' | 'retard';
  emprunteur: string;
  emprunteurContact: string;
  projetId?: string;
  projetNom?: string;
  motif: string;
  responsable: string;
  Observations?: string;
}