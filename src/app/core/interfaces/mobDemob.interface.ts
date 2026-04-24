import { Employes } from "./agents";

export interface MouvementPersonnel {
  id: string;
  employe: Employes;
  nom: string;
  prenom: string;
  fonction: string;
  projet: string;
  mobilisation: Date;
  demobilisation: Date | null;
  nombreJours: number | null;
  status: string;
  dateEstimeDemob: Date;
  etat: boolean;
  activites: string;
  site: string;
  entreprise: string;
  email?: string;
  avatar?: string;
  telephone?: string;
  adresse?: string;
}

export interface Rotation {
  id: string;
  projet: string;
  mobilisation: Date;
  demobilisation: Date | null;
  fonction: string;
  site: string;
  entreprise: string;
  activites: string;
  observations?: string;
  statut?: string;
  employeId: string;
}

export interface WeekData {
  numero: number;
  lundi: number | null;
  mardi: number | null;
  mercredi: number | null;
  jeudi: number | null;
  vendredi: number | null;
  samedi: number | null;
  dimanche: number | null;
  total: number;
}

export interface TimesheetData {
  projet: string;
  entreprise: string;
  fonction: string;
  site: string;
  activites: string;
  mobilisation: Date;
  demobilisation: Date | null;
  duree: number;
  weeks: any[];
  totalHeures: number;
}