export interface Rapport {
  id: string;
  projet: string;
  projetId: string;
  date: Date;
  superviseurClient: string;
  chefEquipe: string;
  
  // Équipe
  equipe: {
    pax: Pax[];
    totalPax: number;
  };
  
  securite: {
    reglesRespectees: boolean;
    remarques: string;
  };
  
  travaux: {
    tache: string;
    executeurs: string[];
    avancement: number;
  }[];
  
  photos: {
    titre: string;
    url: string;
  }[];
  
  logistique: {
    mobilisation: string;
    demobilisation: string;
    personnel: string[];
    materiel: string[];
  };
  
  validation: {
    nom: string;
    fonction: string;
    signe: boolean;
  };
}

export interface Pax {
    nom: string;
    prenom?: string;
    fonction: string;
}