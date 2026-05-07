export interface Presence {
  id: string;
  employeId: string;
  employeNom: string;
  employePrenom: string;
  date: Date;
  statut: 'present' | 'absent' | 'retard' | 'congé' | 'maladie';
  heureArrivee?: string;
  heureDepart?: string;
  motif?: string;
}