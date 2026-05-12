export interface Notifications {
  id: string;
  titre: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  date: Date;
  lu: boolean;
  destinataire: string;
  permission?: string;
  lien?: string;
  priorite: 'basse' | 'normale' | 'haute';
  actions?: {
    label: string;
    action: string;
  }[];
}


export interface PreferenceNotifications {
  id: string;
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  typesActifs: {
    presence: boolean;
    stock: boolean;
    projet: boolean;
    rapport: boolean;
    systeme: boolean;
  };
  seuilAlerteStock: number;
  rappelPresence: boolean;
  rappelHeure: string;
}