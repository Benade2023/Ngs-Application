import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParametresApplication } from '../../../core/interfaces/paramettre.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paramettre',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paramettre.html',
  styleUrl: './paramettre.css',
})
export class Paramettre implements OnInit {

  parametres: ParametresApplication = {} as ParametresApplication;
  generalForm: FormGroup;
  securiteForm: FormGroup;
  notificationForm: FormGroup;
  baseForm: FormGroup;
  affichageForm: FormGroup;
  modulesForm: FormGroup;
  
  activeTab: 'general' | 'securite' | 'notifications' | 'base' | 'affichage' | 'modules' = 'general';
  
  isLoading = false;
  isBrowser: boolean;
  messageSuccess = '';
  messageError = '';
  
  // Options
  langues = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' }
  ];
  
  themes = [
    { value: 'clair', label: '☀️ Clair', icon: '☀️' },
    { value: 'sombre', label: '🌙 Sombre', icon: '🌙' },
    { value: 'systeme', label: '💻 Système', icon: '💻' }
  ];
  
  backupFrequences = [
    { value: 'quotidien', label: 'Quotidien' },
    { value: 'hebdomadaire', label: 'Hebdomadaire' },
    { value: 'mensuel', label: 'Mensuel' }
  ];
  
  dateFormats = [
    { value: 'DD/MM/YYYY', label: 'JJ/MM/AAAA' },
    { value: 'MM/DD/YYYY', label: 'MM/JJ/AAAA' },
    { value: 'YYYY-MM-DD', label: 'AAAA-MM-JJ' }
  ];
  
  heureFormats = [
    { value: '24h', label: '24 heures' },
    { value: '12h', label: '12 heures (AM/PM)' }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    this.generalForm = this.fb.group({
      nomApplication: ['', Validators.required],
      theme: ['clair'],
      langue: ['fr']
    });
    
    this.securiteForm = this.fb.group({
      sessionTimeout: [30, [Validators.required, Validators.min(5), Validators.max(120)]],
      tentativeConnexionMax: [5, [Validators.required, Validators.min(3), Validators.max(10)]],
      verrouillageAuto: [true],
      politiqueMdp: this.fb.group({
        longueurMin: [8, [Validators.required, Validators.min(6), Validators.max(20)]],
        majuscule: [true],
        minuscule: [true],
        chiffre: [true],
        special: [false],
        expiration: [90, [Validators.required, Validators.min(30), Validators.max(365)]]
      })
    });
    
    this.notificationForm = this.fb.group({
      emailNotification: [true],
      smsNotification: [false],
      emailServeur: ['smtp.gmail.com'],
      emailPort: [587],
      emailSecurite: ['TLS']
    });
    
    this.baseForm = this.fb.group({
      backupAuto: [true],
      backupFrequence: ['quotidien'],
      backupHeure: ['02:00'],
      retentionJours: [30, [Validators.required, Validators.min(7), Validators.max(365)]]
    });
    
    this.affichageForm = this.fb.group({
      elementsParPage: [10, [Validators.required, Validators.min(5), Validators.max(100)]],
      dateFormat: ['DD/MM/YYYY'],
      heureFormat: ['24h']
    });
    
    this.modulesForm = this.fb.group({
      modulePresence: [true],
      moduleStock: [true],
      moduleProjets: [true],
      moduleRapports: [true]
    });
  }

  ngOnInit() {
    this.loadParametres();
  }

  loadParametres() {
    // Simuler le chargement des paramètres
    this.parametres = {
      nomApplication: 'Gestion du Personnel',
      logo: '',
      favicon: '',
      theme: 'clair',
      langue: 'fr',
      sessionTimeout: 30,
      tentativeConnexionMax: 5,
      verrouillageAuto: true,
      politiqueMdp: {
        longueurMin: 8,
        majuscule: true,
        minuscule: true,
        chiffre: true,
        special: false,
        expiration: 90
      },
      emailNotification: true,
      smsNotification: false,
      emailServeur: 'smtp.gmail.com',
      emailPort: 587,
      emailSecurite: 'TLS',
      backupAuto: true,
      backupFrequence: 'quotidien',
      backupHeure: '02:00',
      retentionJours: 30,
      elementsParPage: 10,
      dateFormat: 'DD/MM/YYYY',
      heureFormat: '24h',
      modulePresence: true,
      moduleStock: true,
      moduleProjets: true,
      moduleRapports: true,
      maintenanceMode: false,
      messageMaintenance: ''
    };
    
    // Remplir les formulaires
    this.generalForm.patchValue(this.parametres);
    this.securiteForm.patchValue(this.parametres);
    this.notificationForm.patchValue(this.parametres);
    this.baseForm.patchValue(this.parametres);
    this.affichageForm.patchValue(this.parametres);
    this.modulesForm.patchValue(this.parametres);
  }

  saveGeneral() {
    if (this.generalForm.invalid) {
      this.generalForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    
    setTimeout(() => {
      this.parametres = { ...this.parametres, ...this.generalForm.value };
      this.isLoading = false;
      this.messageSuccess = 'Paramètres généraux sauvegardés';
      setTimeout(() => this.messageSuccess = '', 3000);
    }, 500);
  }

  saveSecurite() {
    if (this.securiteForm.invalid) {
      this.securiteForm.markAllAsTouched();
      return;
    }
    
    this.isLoading = true;
    
    setTimeout(() => {
      this.parametres = { ...this.parametres, ...this.securiteForm.value };
      this.isLoading = false;
      this.messageSuccess = 'Paramètres de sécurité sauvegardés';
      setTimeout(() => this.messageSuccess = '', 3000);
    }, 500);
  }

  saveNotifications() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.parametres = { ...this.parametres, ...this.notificationForm.value };
      this.isLoading = false;
      this.messageSuccess = 'Paramètres de notification sauvegardés';
      setTimeout(() => this.messageSuccess = '', 3000);
    }, 500);
  }

  saveBase() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.parametres = { ...this.parametres, ...this.baseForm.value };
      this.isLoading = false;
      this.messageSuccess = 'Paramètres de base de données sauvegardés';
      setTimeout(() => this.messageSuccess = '', 3000);
    }, 500);
  }

  saveAffichage() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.parametres = { ...this.parametres, ...this.affichageForm.value };
      this.isLoading = false;
      this.messageSuccess = "Paramètres d'affichage sauvegardés";
      setTimeout(() => this.messageSuccess = '', 3000);
    }, 500);
  }

  saveModules() {
    this.isLoading = true;
    
    setTimeout(() => {
      this.parametres = { ...this.parametres, ...this.modulesForm.value };
      this.isLoading = false;
      this.messageSuccess = 'Activation des modules sauvegardée';
      setTimeout(() => this.messageSuccess = '', 3000);
    }, 500);
  }

  exporterConfiguration() {
    const data = JSON.stringify(this.parametres, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_config_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importerConfiguration(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const config = JSON.parse(e.target.result);
          this.parametres = { ...this.parametres, ...config };
          this.messageSuccess = 'Configuration importée avec succès';
          setTimeout(() => this.messageSuccess = '', 3000);
        } catch (error) {
          this.messageError = 'Fichier de configuration invalide';
          setTimeout(() => this.messageError = '', 3000);
        }
      };
      reader.readAsText(file);
    }
  }

  reinitialiser() {
    if (confirm('Voulez-vous vraiment réinitialiser tous les paramètres par défaut ?')) {
      this.loadParametres();
      this.messageSuccess = 'Paramètres réinitialisés';
      setTimeout(() => this.messageSuccess = '', 3000);
    }
  }

  testNotification() {
    alert('Test de notification envoyé !');
  }

  effectuerBackup() {
    alert('Sauvegarde déclenchée !');
  }

  getModuleStatusClass(module: string): string {
    return this.parametres[module as keyof ParametresApplication] ? 'actif' : 'inactif';
  }

}
