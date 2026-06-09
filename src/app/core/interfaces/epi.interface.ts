export interface EPI {
  id?: string;
  designation: string;
  type?: string;
  reference: string;
  taille: string;
  quantite: number;
  dateRemise: string;
  etat: string;
  signatureAgent: boolean;
}

export interface EPIRemplacement {
  date: string;
  epiRemplace: string;
  motif: string;
  ancienEpiRestitue: boolean;
  signatureAgent: boolean;
  signatureResponsable: boolean;
}

export interface EPIValidation {
  magasinier: { nom: string; signature: boolean; date: string };
  responsableHSE: { nom: string; signature: boolean; date: string };
  chefProjet: { nom: string; signature: boolean; date: string };
}