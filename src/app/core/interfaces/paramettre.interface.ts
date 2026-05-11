export interface ParametresApplication {
  // Général
  nomApplication: string;
  logo: string;
  favicon: string;
  theme: 'clair' | 'sombre' | 'systeme';
  langue: 'fr' | 'en';
  
  // Sécurité
  sessionTimeout: number; // minutes
  tentativeConnexionMax: number;
  verrouillageAuto: boolean;
  politiqueMdp: {
    longueurMin: number;
    majuscule: boolean;
    minuscule: boolean;
    chiffre: boolean;
    special: boolean;
    expiration: number; // jours
  };
  
  // Notifications
  emailNotification: boolean;
  smsNotification: boolean;
  emailServeur: string;
  emailPort: number;
  emailSecurite: 'SSL' | 'TLS' | 'AUCUNE';
  
  // Base de données
  backupAuto: boolean;
  backupFrequence: 'quotidien' | 'hebdomadaire' | 'mensuel';
  backupHeure: string;
  retentionJours: number;
  
  // Affichage
  elementsParPage: number;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  heureFormat: '24h' | '12h';
  
  // Modules
  modulePresence: boolean;
  moduleStock: boolean;
  moduleProjets: boolean;
  moduleRapports: boolean;
  
  // Autres
  maintenanceMode: boolean;
  messageMaintenance: string;
}