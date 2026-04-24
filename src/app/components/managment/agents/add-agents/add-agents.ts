import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Employes } from '../../../../core/interfaces/agents';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeService } from '../../../../core/services/employe.service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-add-agents',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-agents.html',
  styleUrl: './add-agents.css',
})
export class AddAgents implements OnInit {


  employee: Employes = this.getEmptyEmployee();
  isEditMode = false;
  isLoading = false;
  isBrowser: boolean;

  // Références pour les champs de formulaire
  @ViewChild('inductionDate') inductionDate!: ElementRef;
  @ViewChild('inductionDoc') inductionDoc!: ElementRef;
  @ViewChild('habilitationType') habilitationType!: ElementRef;
  @ViewChild('habilitationDate') habilitationDate!: ElementRef;
  @ViewChild('certificatDate') certificatDate!: ElementRef;
  @ViewChild('certificatMedecin') certificatMedecin!: ElementRef;
  @ViewChild('carteNumero') carteNumero!: ElementRef;
  @ViewChild('carteDate') carteDate!: ElementRef;

  // Durées de validité (en années)
  readonly INDUCTION_DUREE = 3;
  readonly HABILITATION_DUREE = 3;
  readonly CERTIFICAT_MEDICAL_DUREE = 1;
  readonly CARTE_MARINE_DUREE = 0.5;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private employeService: EmployeService,
    private alert: AlertService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // const id = this.route.snapshot.params['id'];
    // if (id) {
    //   this.isEditMode = true;
    //   this.loadEmployee(id);
    // } else {
    //   this.generateId();
    // }
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.loadEmployee(id);
      } else {
        this.generateId();
      }
    });
  }

  generateId(): string {
    const prefix = 'EMP';
    const timestamp = Date.now().toString().slice(-5);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const id = `${prefix}${timestamp}${random}`;
    this.employee.id = id;
    return id;
  }

  getEmptyEmployee(): Employes {
    return {
      id: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      cni: '',
      dateNaissance: '',
      sexe: '',
      fonction: '',
      typeContrat: '',
      statut: 'onSite',
      dateDebut: new Date().toISOString().split('T')[0],
      service: '',
      manager: '',
      avatar: '',
      induction: undefined,
      habilitation: undefined,
      certificatMedical: undefined,
      carteMarine: undefined
    };
  }

  // Méthodes pour ajouter/modifier les documents (version corrigée)
  addInduction() {
    const dateEmission = this.inductionDate?.nativeElement?.value;
    const document = this.inductionDoc?.nativeElement?.value || '';

    if (!dateEmission) {
      console.log('Date d\'émission requise');
      this.alert.toast('Date d\'émission requise', 'error');
      return;
    }

    const emissionDate = new Date(dateEmission);
    const expirationDate = new Date(emissionDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + this.INDUCTION_DUREE);

    this.employee.induction = {
      dateEmission: dateEmission,
      dateExpiration: expirationDate.toISOString().split('T')[0],
      document: document || undefined
    };

    // Vider les champs
    if (this.inductionDate?.nativeElement) this.inductionDate.nativeElement.value = '';
    if (this.inductionDoc?.nativeElement) this.inductionDoc.nativeElement.value = '';

    console.log('Induction ajoutée:', this.employee.induction);
  }

  addHabilitation() {
    const type = this.habilitationType?.nativeElement?.value;
    const dateObtention = this.habilitationDate?.nativeElement?.value;

    if (!type || !dateObtention) {
      console.log('Type et date d\'obtention requis');
        this.alert.toast('Type et date d\'obtention requis', 'error');
      return;
    }

    const obtentionDate = new Date(dateObtention);
    const expirationDate = new Date(obtentionDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + this.HABILITATION_DUREE);

    this.employee.habilitation = {
      type: type,
      dateObtention: dateObtention,
      dateExpiration: expirationDate.toISOString().split('T')[0]
    };

    // Vider les champs
    if (this.habilitationType?.nativeElement) this.habilitationType.nativeElement.value = '';
    if (this.habilitationDate?.nativeElement) this.habilitationDate.nativeElement.value = '';

    console.log('Habilitation ajoutée:', this.employee.habilitation);
  }

  addCertificatMedical() {
    const date = this.certificatDate?.nativeElement?.value;
    const medecin = this.certificatMedecin?.nativeElement?.value;

    if (!date || !medecin) {
      console.log('Date et médecin requis');
      this.alert.toast('Date et médecin requis', 'error');
      return;
    }

    const emissionDate = new Date(date);
    const expirationDate = new Date(emissionDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + this.CERTIFICAT_MEDICAL_DUREE);

    this.employee.certificatMedical = {
      date: date,
      dateExpiration: expirationDate.toISOString().split('T')[0],
      valide: true,
      medecin: medecin
    };

    // Vider les champs
    if (this.certificatDate?.nativeElement) this.certificatDate.nativeElement.value = '';
    if (this.certificatMedecin?.nativeElement) this.certificatMedecin.nativeElement.value = '';

    console.log('Certificat médical ajouté:', this.employee.certificatMedical);
  }

  addCarteMarine() {
    const numero = this.carteNumero?.nativeElement?.value;
    const dateDelivrance = this.carteDate?.nativeElement?.value;

    if (!numero || !dateDelivrance) {
      console.log('Numéro et date de délivrance requis');
      this.alert.toast('Numéro et date de délivrance requis', 'error');

      return;
    }

    const delivranceDate = new Date(dateDelivrance);
    const expirationDate = new Date(delivranceDate);
    expirationDate.setMonth(expirationDate.getMonth() + 6);

    this.employee.carteMarine = {
      numero: numero,
      dateDelivrance: dateDelivrance,
      dateExpiration: expirationDate.toISOString().split('T')[0]
    };

    // Vider les champs
    if (this.carteNumero?.nativeElement) this.carteNumero.nativeElement.value = '';
    if (this.carteDate?.nativeElement) this.carteDate.nativeElement.value = '';

    console.log('Carte marine ajoutée:', this.employee.carteMarine);
  }

  // Supprimer les documents
  removeInduction() {
    this.employee.induction = undefined;
  }

  removeHabilitation() {
    this.employee.habilitation = undefined;
  }

  removeCertificatMedical() {
    this.employee.certificatMedical = undefined;
  }

  removeCarteMarine() {
    this.employee.carteMarine = undefined;
  }


  loadEmployee(id: string) {
    this.isLoading = true;

    this.employeService.getEmployeById(id).subscribe({
      next: (data) => {
        console.log('Employee loaded:', data);

        // IMPORTANT : assignation complète
        this.employee = {
          ...this.getEmptyEmployee(),
          ...data,
          induction: data.induction || undefined,
          habilitation: data.habilitation || undefined,
        };

        this.isLoading = false;
        this.cdr.markForCheck();

      },
      error: (err) => {
        console.error('Erreur chargement employé', err);
        this.isLoading = false; // ⚠️ CRITIQUE sinon bouton bloqué
      }
    });
  }


  onSubmit() {
    this.isLoading = true;

    const request = this.isEditMode
      ? this.employeService.updateEmploye(this.employee.id, this.employee)
      : this.employeService.addEmploye(this.employee);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.alert.toast(this.isEditMode ? 'Employé mis à jour avec succès' : 'Employé ajouté avec succès');
        this.router.navigate(['/employes', this.employee.id]);
      },
      error: () => {
        this.isLoading = false; // ⚠️ obligatoire
        this.alert.toast('Erreur lors de la sauvegarde de l\'employé', 'error');
      }
    });
  }


  formatDataForApi(): any {
    // Créer une copie des données
    const data: any = { ...this.employee };

    // S'assurer que les dates sont au bon format (YYYY-MM-DD)
    if (data.dateNaissance && typeof data.dateNaissance === 'object') {
      data.dateNaissance = (data.dateNaissance as Date).toISOString().split('T')[0];
    }

    if (data.dateDebut && typeof data.dateDebut === 'object') {
      data.dateDebut = (data.dateDebut as Date).toISOString().split('T')[0];
    }

    if (data.dateFin && typeof data.dateFin === 'object') {
      data.dateFin = (data.dateFin as Date).toISOString().split('T')[0];
    }

    // Supprimer les champs vides ou undefined
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value === undefined || value === null || value === '') {
        // Garder dateFin et avatar même vides
        if (key !== 'dateFin' && key !== 'avatar') {
          delete data[key];
        }
      }
    });

    return data;
  }

  onCancel() {
    if (this.isBrowser && confirm('Annuler les modifications ?')) {
      this.router.navigate(['/employes']);
    }
  }

}
