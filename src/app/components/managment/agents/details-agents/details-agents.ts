import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Employes } from '../../../../core/interfaces/agents';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EmployeService } from '../../../../core/services/employe.service';
import { AlertService } from '../../../../core/services/alert.service';
import { UploadedFile } from '../../../../core/interfaces/uploadFile.interface';
import { FileUploadService } from '../../../../core/services/file-upload.service';
import { ElementRef, ViewChild } from '@angular/core';
import { EnvironmentProduction } from '../../../../../environment/environment.production';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Habilitation } from '../../../../core/interfaces/habilitation';
import { CertifMedical } from '../../../../core/interfaces/certif-medical';
import { CarteMarine } from '../../../../core/interfaces/carte-marine';
import { EPI, EPIRemplacement, EPIValidation } from '../../../../core/interfaces/epi.interface';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-details-agents',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './details-agents.html',
  styleUrl: './details-agents.css',
})
export class DetailsAgents implements OnInit {

  employe!: Employes;
  isBrowser: boolean;
  matriculeAgent: string = '';


  selectedFile: File | null = null;
  uploadedFile: UploadedFile | null = null;
  errorMessage = '';
  inductionAgent: any;
  habilitationAgent: any;
  carteMarineAgent: any;
  apiUrl = EnvironmentProduction.apiUrlFile

  // Durées de validité (en années)
  readonly INDUCTION_DUREE = 3; // 3 ans
  readonly HABILITATION_DUREE = 3; // 3 ans
  readonly CERTIFICAT_MEDICAL_DUREE = 1; // 1 an
  readonly CARTE_MARINE_DUREE = 0.5; // 6 mois
  projectId: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef;
  isLoading: boolean = false;
  certificatAgent: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private employeService: EmployeService,
    private alert: AlertService,
    private fileUploadService: FileUploadService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.matriculeAgent = id;
    if (id) {
      this.loadEmployee(id);
      this.getInductionAgent(id, 'Induction')
      this.getHabilitationAgent(id, 'Habilitation')
      this.getCertificatMedicalAgent(id, 'CertificatMedical')
      this.getCarteMarineAgent(id, 'CarteMarine')
    }
  }

  loadEmployee(id: string) {
    this.employeService.getEmployeById(id).subscribe({
      next: (data) => {
        this.employe = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'employé:', err);
        this.router.navigate(['/employes']);
      }
    });

  }


  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;

    const file = event.target.files[0];
    if (file) {
      this.inductionForm.file = file;
      this.inductionForm.fileName = file.name;
    }
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.errorMessage = '';
    }
  }
  onFileSelectedHabilitation(event: any): void {
    const input = event.target as HTMLInputElement;

    const file = event.target.files[0];
    if (file) {
      this.habilitationForm.file = file;
      this.habilitationForm.fileName = file.name;
    }
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.errorMessage = '';
    }
  }
  onFileSelectedCarteMarine(event: any): void {
    const input = event.target as HTMLInputElement;

    const file = event.target.files[0];
    if (file) {
      this.carteMarineForm.file = file;
      this.carteMarineForm.fileName = file.name;
    }
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.errorMessage = '';
    }
  }

  getInductionAgent(matricule: string, type: string) {
    this.fileUploadService.getFiles().subscribe({
      next: (data) => {
        this.inductionAgent = data.find(x => x.matriculeAgent === matricule && x.type === type)
        this.cdr.markForCheck();
      }
    })
  }
  getHabilitationAgent(matricule: string, type: string) {
    this.fileUploadService.getFiles().subscribe({
      next: (data) => {
        this.habilitationAgent = data.find(x => x.matriculeAgent === matricule && x.type === type)
        this.cdr.markForCheck();
      }
    })
  }
  getCertificatMedicalAgent(matricule: string, type: string) {
    this.fileUploadService.getFiles().subscribe({
      next: (data) => {
        this.certificatAgent = data.find(x => x.matriculeAgent === matricule && x.type === type)
        this.cdr.markForCheck();
      }
    })
  }
  getCarteMarineAgent(matricule: string, type: string) {
    this.fileUploadService.getFiles().subscribe({
      next: (data) => {
        this.carteMarineAgent = data.find(x => x.matriculeAgent === matricule && x.type === type)
        this.cdr.markForCheck();
      }
    })
  }

  uploadInduction(): void {
    if (!this.selectedFile) {
      this.alert.error('Sélectionne un fichier avant de l’envoyer.');
      return;
    }

    const matricule = (this.matriculeAgent ?? '').trim();
    const projectId = (this.projectId ?? '').trim();
    const type = ('Induction').trim();

    //console.log({ matricule, projectId });

    this.fileUploadService
      .uploadFile(
        this.selectedFile,
        matricule || undefined,
        projectId || undefined,
        type || undefined
      )
      .subscribe({
        next: (res) => {
          this.cdr.markForCheck();
          this.uploadedFile = res;
          this.alert.success('Induction téléversé avec success !');
          // Réinitialisation
          this.selectedFile = null;

          this.fileInput.nativeElement.value = '';
          window.location.reload();

        },
        error: (err: HttpErrorResponse) => {
          this.alert.error('Erreur pendant l’upload.');
          console.error(err)
        }
      });
  }
  uploadHabilitation(): void {
    if (!this.selectedFile) {
      this.alert.error('Sélectionne un fichier avant de l’envoyer.');
      return;
    }

    const matricule = (this.matriculeAgent ?? '').trim();
    const projectId = (this.projectId ?? '').trim();
    const type = ('Habilitation').trim();

    //console.log({ matricule, projectId });

    this.fileUploadService
      .uploadFile(
        this.selectedFile,
        matricule || undefined,
        projectId || undefined,
        type || undefined
      )
      .subscribe({
        next: (res) => {
          this.cdr.markForCheck();
          this.uploadedFile = res;
          this.alert.success('Habilitation téléversée avec success !');
          // Réinitialisation
          this.selectedFile = null;

          this.fileInput.nativeElement.value = '';
          window.location.reload();

        },
        error: (err: HttpErrorResponse) => {
          this.alert.error('Erreur pendant l’upload.');
          console.error(err)
        }
      });
  }
  uploadCertificatMedical(): void {
    if (!this.selectedFile) {
      this.alert.error('Sélectionne un fichier avant de l’envoyer.');
      return;
    }

    const matricule = (this.matriculeAgent ?? '').trim();
    const projectId = (this.projectId ?? '').trim();
    const type = ('CertificatMedical').trim();

    //console.log({ matricule, projectId });

    this.fileUploadService
      .uploadFile(
        this.selectedFile,
        matricule || undefined,
        projectId || undefined,
        type || undefined
      )
      .subscribe({
        next: (res) => {
          this.cdr.markForCheck();
          this.uploadedFile = res;
          this.alert.success('Certificat médical téléversé avec success !');
          // Réinitialisation
          this.selectedFile = null;

          this.fileInput.nativeElement.value = '';
          window.location.reload();

        },
        error: (err: HttpErrorResponse) => {
          this.alert.error('Erreur pendant l’upload.');
          console.error(err)
        }
      });
  }
  uploadCarteMarine(): void {
    if (!this.selectedFile) {
      this.alert.error('Sélectionne un fichier avant de l’envoyer.');
      return;
    }

    const matricule = (this.matriculeAgent ?? '').trim();
    const projectId = (this.projectId ?? '').trim();
    const type = ('CarteMarine').trim();

    //console.log({ matricule, projectId });

    this.fileUploadService
      .uploadFile(
        this.selectedFile,
        matricule || undefined,
        projectId || undefined,
        type || undefined
      )
      .subscribe({
        next: (res) => {
          this.cdr.markForCheck();
          this.uploadedFile = res;
          this.alert.success('Carte marine téléversée avec success !');
          // Réinitialisation
          this.selectedFile = null;

          this.fileInput.nativeElement.value = '';
          window.location.reload();

        },
        error: (err: HttpErrorResponse) => {
          this.alert.error('Erreur pendant l’upload.');
          console.error(err)
        }
      });
  }


  updateFile(id: number) {
    if (!this.selectedFile) {
      this.alert.error('Sélectionne un fichier avant de l’envoyer.');
      return;
    }
    let idInduction = id;
    let fileSelect = this.selectedFile;
    let matriculeAgent = (this.matriculeAgent ?? '').trim();
    let type = 'Induction';

    this.fileUploadService.updateFile(
      idInduction,
      fileSelect,
      matriculeAgent,
      type
    ).subscribe({
      next: (res) => {
        this.cdr.markForCheck();
        this.alert.success('Fichier mis à jour');
        window.location.reload();

      },
      error: (err) => {
        this.alert.error(err);
      }
    });
  }
  updateFileHabilitation(id: number) {
    if (!this.selectedFile) {
      this.alert.error('Sélectionne un fichier avant de l’envoyer.');
      return;
    }
    let idHabilitation = id;
    let fileSelect = this.selectedFile;
    let matriculeAgent = (this.matriculeAgent ?? '').trim();
    let type = 'Habilitation';

    this.fileUploadService.updateFile(
      idHabilitation,
      fileSelect,
      matriculeAgent,
      type
    ).subscribe({
      next: (res) => {
        this.cdr.markForCheck();
        this.alert.success('Fichier mis à jour');
        window.location.reload();

      },
      error: (err) => {
        this.alert.error(err);
      }
    });
  }



  updateFileCertificatMedical(id: number) {
    if (!this.selectedFile) {
      this.alert.error('Sélectionne un fichier avant de l’envoyer.');
      return;
    }
    let idCertificatMedical = id;
    let fileSelect = this.selectedFile;
    let matriculeAgent = (this.matriculeAgent ?? '').trim();
    let type = 'CertificatMedical';

    this.fileUploadService.updateFile(
      idCertificatMedical,
      fileSelect,
      matriculeAgent,
      type
    ).subscribe({
      next: (res) => {
        this.cdr.markForCheck();
        this.alert.success('Fichier mis à jour');
        window.location.reload();

      },
      error: (err) => {
        this.alert.error(err);
      }
    });
  }
  updateFileCarteMarine(id: number) {
    if (!this.selectedFile) {
      this.alert.error('Sélectionne un fichier avant de l’envoyer.');
      return;
    }
    let idCarteMarine = id;
    let fileSelect = this.selectedFile;
    let matriculeAgent = (this.matriculeAgent ?? '').trim();
    let type = 'CarteMarine';

    this.fileUploadService.updateFile(
      idCarteMarine,
      fileSelect,
      matriculeAgent,
      type
    ).subscribe({
      next: (res) => {
        this.cdr.markForCheck();
        this.alert.success('Fichier mis à jour');
        window.location.reload();

      },
      error: (err) => {
        this.alert.error(err);
      }
    });
  }




  // Calcul de l'âge
  calculateAge(): number {
    const today = new Date();
    const birthDate = new Date(this.employe.dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  // Vérification d'expiration avec seuil de 30 jours
  isExpired(dateExpiration: Date | string): boolean {
    const expiration = new Date(dateExpiration);
    const today = new Date();
    return expiration < today;
  }

  isNearExpiration(dateExpiration: Date | string, daysThreshold: number = 30): boolean {
    const expiration = new Date(dateExpiration);
    const today = new Date();
    const daysDiff = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff <= daysThreshold && daysDiff > 0;
  }

  getDaysBeforeExpiration(dateExpiration?: Date | string): number {
    if (!dateExpiration) return 0; // ou null / -1 selon ton besoin

    const expiration = new Date(dateExpiration);
    const today = new Date();
    return Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }

  // Induction
  isInductionExpired(employe?: Employes): boolean {
    if (!employe?.induction?.dateExpiration) return false;

    const expiration = new Date(employe.induction.dateExpiration);
    const today = new Date();

    return expiration < today;
  }

  isInductionNearExpiration(): boolean {
    return this.employe.induction ? this.isNearExpiration(this.employe.induction.dateExpiration) : false;
  }

  getInductionStatus(employe?: Employes): string {
    if (!employe?.induction?.dateExpiration) {
      return 'Non défini';
    }

    const expiration = new Date(employe.induction.dateExpiration);
    const today = new Date();

    if (expiration < today) return 'Expiré';

    const diff = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diff <= 30) return 'Expire bientôt';

    return 'Valide';
  }

  getInductionClass(): string {
    if (!this.employe.induction) return 'status-unknown';
    if (this.isInductionExpired()) return 'status-expired';
    if (this.isInductionNearExpiration()) return 'status-warning';
    return 'status-valid';
  }

  private hasValidHabilitation(): boolean {
    return !!this.employe.habilitation &&
      this.employe.habilitation !== 'pending';
  }
  private hasValidCertificatMedical(): boolean {
    return !!this.employe.certificatMedical &&
      this.employe.certificatMedical !== 'pending';
  }
  private hasValidCarteMarine(): boolean {
    return !!this.employe.carteMarine &&
      this.employe.carteMarine !== 'pending';
  }

  // Habilitation
  isHabilitationExpired(): boolean {
    if (!this.hasValidHabilitation()) {
      return false;
    }

    return this.isExpired(
      (this.employe.habilitation as Habilitation).dateExpiration
    );
  }

  isHabilitationNearExpiration(): boolean {
    if (!this.hasValidHabilitation()) {
      return false;
    }

    return this.isNearExpiration(
      (this.employe.habilitation as Habilitation).dateExpiration
    );
  }

  // Certificat Médical //
  isCertificatMedicalExpired(): boolean {
    if (!this.hasValidCertificatMedical()) {
      return false;
    }

    return this.isExpired(
      (this.employe.certificatMedical as CertifMedical).dateExpiration
    );
  }

  isCertificatMedicalNearExpiration(): boolean {
    if (!this.hasValidCertificatMedical()) {
      return false;
    }

    return this.isNearExpiration(
      (this.employe.certificatMedical as CertifMedical).dateExpiration
    );
  }
  // Carte Marine //
  isCarteMarineExpired(): boolean {
    if (!this.hasValidCarteMarine()) {
      return false;
    }

    return this.isExpired(
      (this.employe.carteMarine as CarteMarine).dateExpiration
    );
  }

  isCarteMarineNearExpiration(): boolean {
    if (!this.hasValidCarteMarine()) {
      return false;
    }

    return this.isNearExpiration(
      (this.employe.carteMarine as CarteMarine).dateExpiration
    );
  }

  get habilitationData(): Habilitation | null {
    const habilitation = this.employe?.habilitation;

    return habilitation && habilitation !== 'pending'
      ? habilitation
      : null;
  }

  get certificatMedicalData(): CertifMedical | null {
    const certificatMedical = this.employe?.certificatMedical;

    return certificatMedical && certificatMedical !== 'pending'
      ? certificatMedical
      : null;
  }
  get carteMarineData(): CarteMarine | null {
    const carteMarine = this.employe?.carteMarine;

    return carteMarine && carteMarine !== 'pending'
      ? carteMarine
      : null;
  }

  getHabilitationStatus(): string {
    const habilitation = this.employe.habilitation;

    if (!habilitation) {
      return 'Non renseigné';
    }

    if (habilitation === 'pending') {
      return 'En attente';
    }

    if (this.isHabilitationExpired()) {
      return 'Expiré';
    }

    if (this.isHabilitationNearExpiration()) {
      return 'Expire bientôt';
    }

    return 'Valide';
  }

  getHabilitationClass(): string {
    const habilitation = this.employe.habilitation;

    if (!habilitation) {
      return 'status-unknown';
    }

    if (habilitation === 'pending') {
      return 'status-unknown';
    }

    if (this.isHabilitationExpired()) {
      return 'status-expired';
    }

    if (this.isHabilitationNearExpiration()) {
      return 'status-warning';
    }

    return 'status-valid';
  }

  // Certificat Médical
  // isCertificatMedicalExpired(): boolean {
  //   return this.employe.certificatMedical ? this.isExpired(this.employe.certificatMedical.dateExpiration) : false;
  // }

  // isCertificatMedicalNearExpiration(): boolean {
  //   return this.employe.certificatMedical ? this.isNearExpiration(this.employe.certificatMedical.dateExpiration) : false;
  // }

  getCertificatMedicalStatus(): string {
    if (!this.employe.certificatMedical) return 'Non renseigné';
    if (this.isCertificatMedicalExpired()) return 'Expiré';
    if (this.isCertificatMedicalNearExpiration()) return 'Expire bientôt';
    return 'Valide';
  }

  getCertificatMedicalClass(): string {
    if (!this.employe.certificatMedical) return 'status-unknown';
    if (this.isCertificatMedicalExpired()) return 'status-expired';
    if (this.isCertificatMedicalNearExpiration()) return 'status-warning';
    return 'status-valid';
  }

  // Carte Marine
  // isCarteMarineExpired(): boolean {
  //   return this.employe.carteMarine ? this.isExpired(this.employe.carteMarine.dateExpiration) : false;
  // }

  // isCarteMarineNearExpiration(): boolean {
  //   return this.employe.carteMarine ? this.isNearExpiration(this.employe.carteMarine.dateExpiration, 30) : false;
  // }

  getCarteMarineStatus(): string {
    if (!this.employe.carteMarine) return 'Non renseigné';
    if (this.isCarteMarineExpired()) return 'Expiré';
    if (this.isCarteMarineNearExpiration()) return 'Expire bientôt';
    return 'Valide';
  }

  getCarteMarineClass(): string {
    if (!this.employe.carteMarine) return 'status-unknown';
    if (this.isCarteMarineExpired()) return 'status-expired';
    if (this.isCarteMarineNearExpiration()) return 'status-warning';
    return 'status-valid';
  }

  getStatutLabel(statut: string): string {
    const labels: any = {
      onSite: 'Sur site',
      remote: 'Hors site',
      sick: 'Malade',
      leave: 'En congé',
      unavailable: 'Indisponible'
    };
    return labels[statut] || statut;
  }

  goBack() {
    this.router.navigate(['/employes']);
  }

  editEmployee() {
    console.log("Button edit actionner");
    this.router.navigate(['/employes/modifier', this.employe.id]);
  }

  viewEmployeeMovements() {
    this.router.navigate(['/detail-mouvement-personnel', this.employe.id]);
  }

  deleteEmployee() {
    if (!this.isBrowser) return;
    this.alert.confirm(`Supprimer ${this.employe.nom} ${this.employe.prenom} ?`)
      .then(confirmed => {
        if (confirmed) {
          this.employeService.deleteEmploye(this.employe.id).subscribe({
            next: () => {
              this.router.navigate(['/employes']);
            },
            error: (error) => {
              console.error('Erreur lors de la suppression:', error);
              this.alert.error('Erreur lors de la suppression');
            }
          });
        }
      });
    // if (this.isBrowser && confirm(`Supprimer ${this.employe.nom} ${this.employe.prenom} ?`)) {
    //   console.log('Supprimer employé:', this.employe.id);
    //   this.router.navigate(['/employes']);
    // }
  }

  // Variables
  showInductionModal = false;
  showHabilitationModal = false;
  showCertificatModal = false;
  showCarteMarineModal = false;

  inductionForm = {
    id: '',
    employeId: '',
    dateEmission: '',
    dateExpiration: '',
    fileName: '',
    file: null as File | null,
    documentExistant: ''
  };
  habilitationForm = {
    id: '',
    employeId: '',
    type: '',
    dateObtention: '',
    dateExpiration: '',
    fileName: '',
    file: null as File | null,
    documentExistant: ''
  };

  certificatForm = {
    id: '',
    employeId: '',
    type: '',
    dateEmission: '',
    dateExpiration: '',
    medecin: '',
    fileName: '',
    file: null as File | null,
    documentExistant: ''
  };

  carteMarineForm = {
    id: '',
    employeId: '',
    type: '',
    dateDelivrance: '',
    dateExpiration: '',
    numero: '',
    fileName: '',
    file: null as File | null,
    documentExistant: ''
  };

  // Méthodes
  openInductionModal(employe: Employes) {
    this.inductionForm = {
      id: employe.induction?.id || '',
      employeId: employe.id,
      dateEmission: employe.induction?.dateEmission ? new Date(employe.induction.dateEmission).toISOString().split('T')[0] : '',
      dateExpiration: employe.induction?.dateExpiration || '',
      fileName: employe.induction?.document || '',
      file: null,
      documentExistant: employe.induction?.filePath || ''
    };
    this.showInductionModal = true;
  }

  openHabilitationModal(employe: Employes) {

    const habilitation =
      employe.habilitation && employe.habilitation !== 'pending'
        ? employe.habilitation
        : null;

    this.habilitationForm = {
      id: habilitation?.id || '',
      employeId: employe.id,
      type: habilitation?.type || '',
      dateObtention: habilitation?.dateObtention
        ? new Date(habilitation.dateObtention).toISOString().split('T')[0]
        : '',
      dateExpiration: habilitation?.dateExpiration || '',
      fileName: habilitation?.document || '',
      file: null,
      documentExistant: habilitation?.filePath || ''
    };

    this.showHabilitationModal = true;
  }


  openCertificatModal(employe: Employes) {

    const certificat =
      employe.certificatMedical && employe.certificatMedical !== 'pending'
        ? employe.certificatMedical
        : null;

    this.certificatForm = {
      id: certificat?.id || '',
      employeId: employe.id,
      type: certificat?.type || '',
      medecin: certificat?.medecin || '',
      dateEmission: certificat?.dateEmission
        ? new Date(certificat.dateEmission).toISOString().split('T')[0]
        : '',
      dateExpiration: certificat?.dateExpiration || '',
      fileName: certificat?.document || '',
      file: null,
      documentExistant: certificat?.filePath || ''
    };

    this.showCertificatModal = true;
  }
  openCarteMarineModal(employe: Employes) {

    const carteMarine =
      employe.carteMarine && employe.carteMarine !== 'pending'
        ? employe.carteMarine
        : null;

    this.carteMarineForm = {
      id: carteMarine?.id || '',
      employeId: employe.id,
      type: carteMarine?.type || '',
      numero: carteMarine?.numero || '',
      // dateDelivrance: carteMarine?.dateDelivrance || '',
      dateDelivrance: carteMarine?.dateDelivrance
        ? new Date(carteMarine.dateDelivrance).toISOString().split('T')[0]
        : '',
      dateExpiration: carteMarine?.dateExpiration || '',
      fileName: carteMarine?.document || '',
      file: null,
      documentExistant: carteMarine?.filePath || ''
    };

    this.showCarteMarineModal = true;
  }





  closeInductionModal() {
    this.showInductionModal = false;
    this.inductionForm = {
      id: '',
      employeId: '',
      dateEmission: '',
      dateExpiration: '',
      fileName: '',
      file: null,
      documentExistant: ''
    };
  }

  closeHabilitationModal() {
    this.showHabilitationModal = false;
    this.habilitationForm = {
      id: '',
      employeId: '',
      type: '',
      dateObtention: '',
      dateExpiration: '',
      fileName: '',
      file: null,
      documentExistant: ''
    };
  }

  closeCertificatModal() {
    this.showCertificatModal = false;
    this.certificatForm = {
      id: '',
      employeId: '',
      type: '',
      dateEmission: '',
      dateExpiration: '',
      medecin: '',
      fileName: '',
      file: null,
      documentExistant: ''
    };
  }
  closeCarteMarineModal() {
    this.showCarteMarineModal = false;
    this.carteMarineForm = {
      id: '',
      employeId: '',
      type: '',
      dateDelivrance: '',
      dateExpiration: '',
      numero: '',
      fileName: '',
      file: null,
      documentExistant: ''
    };
  }

  onInductionFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.inductionForm.file = file;
      this.inductionForm.fileName = file.name;
    }
  }

  onCertificatFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;

    const file = event.target.files[0];
    if (file) {
      this.certificatForm.file = file;
      this.certificatForm.fileName = file.name;
    }
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.errorMessage = '';
    }
  }
  onCarteMarineFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;

    const file = event.target.files[0];
    if (file) {
      this.carteMarineForm.file = file;
      this.carteMarineForm.fileName = file.name;
    }
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.errorMessage = '';
    }
  }

  // Dans votre composant
  updateInduction(id: string, inductionId?: number) {
    if (!this.inductionForm.dateEmission) {
      alert('Veuillez sélectionner une date d\'émission');
      return;
    }

    this.isLoading = true;

    // Calculer la date d'expiration (3 ans après date d'émission)
    const emissionDate = new Date(this.inductionForm.dateEmission);
    const expirationDate = new Date(emissionDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + 3);

    const inductionData = {
      dateEmission: this.inductionForm.dateEmission,
      dateExpiration: expirationDate.toISOString().split('T')[0],
      document: this.inductionForm.fileName || this.inductionForm.documentExistant
    };

    console.log(inductionData);

    // Utiliser PATCH pour modifier uniquement l'induction
    this.employeService.updateInduction(this.inductionForm.employeId, inductionData).subscribe({
      next: (response) => {
        if (inductionId && this.inductionForm.file) {
          this.updateFile(inductionId);
        } else {
          this.uploadInduction();
          this.isLoading = false;
          this.alert.success('Induction mise à jour avec succès');
          this.closeInductionModal();
          this.loadEmployee(id); // Recharger les données
        }

      },
      error: (error) => {
        console.error('Erreur:', error);
        this.alert.error('Erreur lors de la mise à jour');
        this.isLoading = false;

      }
    });
  }
  updateHabilitation(id: string, habilitationId?: number) {
    if (!this.habilitationForm.dateObtention) {
      alert('Veuillez sélectionner une date d\'obtention');
      return;
    }

    this.isLoading = true;

    // Calculer la date d'expiration (3 ans après date d'émission)
    const emissionDate = new Date(this.habilitationForm.dateObtention);
    const expirationDate = new Date(emissionDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + 3);

    const habilitationData = {
      dateObtention: this.habilitationForm.dateObtention,
      dateExpiration: expirationDate.toISOString().split('T')[0],
      document: this.habilitationForm.fileName || this.habilitationForm.documentExistant
    };

    console.log(habilitationData);

    // Utiliser PATCH pour modifier uniquement l'induction
    this.employeService.updateHabilitation(this.habilitationForm.employeId, habilitationData).subscribe({
      next: (response) => {
        if (habilitationId && this.habilitationForm.file) {
          this.updateFile(habilitationId);
        } else {
          this.uploadHabilitation();
          this.isLoading = false;
          this.alert.success('Habilitation mise à jour avec succès');
          this.closeHabilitationModal();
          this.loadEmployee(id); // Recharger les données
        }

      },
      error: (error) => {
        console.error('Erreur:', error);
        this.alert.error('Erreur lors de la mise à jour');
        this.isLoading = false;

      }
    });
  }


  updateCertificat(id: string, certificatId?: number) {
    if (!this.certificatForm.dateEmission) {
      alert('Veuillez sélectionner une date d\'émission');
      return;
    }

    this.isLoading = true;

    // Calculer la date d'expiration (3 ans après date d'émission)
    const emissionDate = new Date(this.certificatForm.dateEmission);
    const expirationDate = new Date(emissionDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const certificatData = {
      dateEmission: this.certificatForm.dateEmission,
      medecin: this.certificatForm.medecin,
      dateExpiration: expirationDate.toISOString().split('T')[0],
      document: this.certificatForm.fileName || this.certificatForm.documentExistant
    };

    console.log(certificatData);
    console.log(this.certificatForm.employeId);


    this.employeService.updateCertificat(this.certificatForm.employeId, certificatData).subscribe({
      next: (response) => {
        console.log('Certificat médical mis à jour:', response);
        if (certificatId && this.certificatForm.file) {
          this.updateFile(certificatId);
        } else {
          this.uploadCertificatMedical();
          this.isLoading = false;
          this.alert.success('Certificat mis à jour avec succès');
          this.closeCertificatModal();
          this.loadEmployee(id); // Recharger les données
        }

      },
      error: (error) => {
        console.error('Erreur:', error);
        this.alert.error('Erreur lors de la mise à jour');
        this.isLoading = false;

      }
    });
  }

  updateCarteMarine(id: string, carteMarineId?: number) {
    if (!this.carteMarineForm.dateDelivrance) {
      alert('Veuillez sélectionner une date de délivrance');
      return;
    }

    this.isLoading = true;

    // Calculer la date d'expiration (6 mois après date d'émission)
    const emissionDate = new Date(this.carteMarineForm.dateDelivrance);
    const expirationDate = new Date(emissionDate);
    expirationDate.setMonth(expirationDate.getMonth() + 6);

    const carteMarineData = {
      dateDelivrance: this.carteMarineForm.dateDelivrance,
      numero: this.carteMarineForm.numero,
      dateExpiration: expirationDate.toISOString().split('T')[0],
      document: this.carteMarineForm.fileName || this.carteMarineForm.documentExistant
    };

    console.log(carteMarineData);
    console.log(this.carteMarineForm.employeId);


    this.employeService.updateCarteMarine(this.carteMarineForm.employeId, carteMarineData).subscribe({
      next: (response) => {
        console.log('Carte marine mise à jour:', response);
        if (carteMarineId && this.carteMarineForm.file) {
          this.updateFile(carteMarineId);
        } else {
          this.uploadCarteMarine();
          this.isLoading = false;
          this.alert.success('Carte marine mise à jour avec succès');
          this.closeCarteMarineModal();
          this.loadEmployee(id); // Recharger les données
        }

      },
      error: (error) => {
        console.error('Erreur:', error);
        this.alert.error('Erreur lors de la mise à jour');
        this.isLoading = false;

      }
    });
  }

  // Propriétés EPI
  epiList: EPI[] = [];
  epiRemplacements: EPIRemplacement[] = [];
  epiValidation: EPIValidation = {
    magasinier: { nom: '', signature: false, date: '' },
    responsableHSE: { nom: '', signature: false, date: '' },
    chefProjet: { nom: '', signature: false, date: '' }
  };

  // Formulaire modal
  showEpiModal = false;
  epiFormList: EPI[] = [];
  epiRemplacementFormList: EPIRemplacement[] = [];
  epiValidationForm: EPIValidation = {
    magasinier: { nom: '', signature: false, date: '' },
    responsableHSE: { nom: '', signature: false, date: '' },
    chefProjet: { nom: '', signature: false, date: '' }
  };

  // Liste prédéfinie des EPI
  epiDesignations = [
    { id: 1, designation: 'Casque de sécurité', type: 'Tête' },
    { id: 2, designation: 'Lunettes de protection', type: 'Yeux' },
    { id: 3, designation: 'Chaussures de sécurité', type: 'Pieds' },
    { id: 4, designation: 'Gants de manutention', type: 'Mains' },
    { id: 5, designation: 'Gants isolants', type: 'Mains' },
    { id: 6, designation: 'Veste haute visibilité', type: 'Corps' },
    { id: 7, designation: 'Combinaison de travail', type: 'Corps' },
    { id: 8, designation: 'Harnais antichute', type: 'Corps' },
    { id: 9, designation: 'Jugulaire casque', type: 'Tête' },
    { id: 10, designation: 'Protection auditive', type: 'Oreilles' }
  ];



  // openEpiModal(employe: any) {
  //   // Charger les EPI existants ou initialiser avec la liste par défaut
  //   if (employe.epi && employe.epi.length > 0) {
  //     this.epiFormList = [...employe.epi];
  //   } else {
  //     this.epiFormList = this.epiDesignations.map(epi => ({
  //       id: epi.id.toString(),
  //       designation: epi.designation,
  //       type: epi.type,
  //       reference: '',
  //       taille: '',
  //       quantite: 1,
  //       dateRemise: new Date().toISOString().split('T')[0],
  //       etat: 'Neuf',
  //       signatureAgent: false
  //     }));
  //     console.log(this.epiFormList);

  //   }

  //   this.epiRemplacementFormList = employe.epiRemplacements ? [...employe.epiRemplacements] : [];

  //   if (employe.epiValidation) {
  //     this.epiValidationForm = { ...employe.epiValidation };
  //   } else {
  //     this.epiValidationForm = {
  //       magasinier: { nom: '', signature: false, date: new Date().toISOString().split('T')[0] },
  //       responsableHSE: { nom: '', signature: false, date: new Date().toISOString().split('T')[0] },
  //       chefProjet: { nom: '', signature: false, date: new Date().toISOString().split('T')[0] }
  //     };
  //   }

  //   this.showEpiModal = true;
  // }


  openEpiModal(employe: any) {
    // Créer la liste complète des EPI disponibles
    const tousLesEpi = this.epiDesignations.map(epi => ({
      id: epi.id.toString(),
      designation: epi.designation,
      type: epi.type,
      reference: '',
      taille: '',
      quantite: 1,
      dateRemise: new Date().toISOString().split('T')[0],
      etat: 'Neuf',
      signatureAgent: false
    }));

    // Si l'employé a des EPI enregistrés, on les fusionne avec la liste complète
    if (employe.epi && employe.epi.length > 0) {
      // Créer un map des EPI existants par désignation
      const epiExistantsMap = new Map();
      employe.epi.forEach((epi: EPI) => {
        epiExistantsMap.set(epi.designation, epi);
      });

      // Fusionner: garder les valeurs existantes, compléter avec les nouveaux
      this.epiFormList = tousLesEpi.map(epi => {
        const epiExistant = epiExistantsMap.get(epi.designation);
        if (epiExistant) {
          // Garder les valeurs existantes
          return { ...epiExistant };
        } else {
          // Retourner le nouveau EPI avec valeurs par défaut
          return { ...epi };
        }
      });
    } else {
      // Aucun EPI existant, afficher tous les EPI avec valeurs par défaut
      this.epiFormList = tousLesEpi;
    }

    console.log('Liste complète des EPI:', this.epiFormList);

    this.epiRemplacementFormList = employe.epiRemplacements ? [...employe.epiRemplacements] : [];

    if (employe.epiValidation) {
      this.epiValidationForm = { ...employe.epiValidation };
    } else {
      this.epiValidationForm = {
        magasinier: { nom: '', signature: false, date: new Date().toISOString().split('T')[0] },
        responsableHSE: { nom: '', signature: false, date: new Date().toISOString().split('T')[0] },
        chefProjet: { nom: '', signature: false, date: new Date().toISOString().split('T')[0] }
      };
    }

    this.showEpiModal = true;
  }

  closeEpiModal() {
    this.showEpiModal = false;
  }

  addRemplacement() {
    this.epiRemplacementFormList.push({
      date: new Date().toISOString().split('T')[0],
      epiRemplace: '',
      motif: '',
      ancienEpiRestitue: false,
      signatureAgent: false,
      signatureResponsable: false
    });
  }

  removeRemplacement(index: number) {
    this.epiRemplacementFormList.splice(index, 1);
  }

  // Variable pour stocker l'EPI en cours d'édition
  currentEditingEpi: EPI | null = null;
  currentEditingIndex = -1;

  // editEpi(epi: EPI, index: number) {
  //   // Ouvrir un sous-modal ou permettre l'édition directement
  //   console.log('Modifier EPI:', epi);
  // }
  deleteEpi(epi: EPI, index: number) {
    // Confirmation avant suppression
    Swal.fire({
      title: '⚠️ Confirmation',
      text: `Voulez-vous vraiment supprimer l'EPI "${epi.designation}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#ef476f',
      cancelButtonColor: '#6c757d'
    }).then((result) => {
      if (result.isConfirmed) {
        // Supprimer l'EPI du tableau
        this.epiFormList.splice(index, 1);

        // Appel au service pour sauvegarder
        this.isLoading = true;

        const epiData = {
          epi: this.epiFormList,
          epiRemplacements: this.epiRemplacementFormList,
          epiValidation: this.epiValidationForm
        };

        this.employeService.updateEpi(this.employe.id, epiData).subscribe({
          next: (response) => {
            this.isLoading = false;
            Swal.fire({
              title: '✅ Supprimé !',
              text: 'EPI supprimé avec succès',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadEmployee(this.employe.id);
          },
          error: (error) => {
            console.error('Erreur:', error);
            this.isLoading = false;
            Swal.fire({
              title: '❌ Erreur',
              text: 'Erreur lors de la suppression',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  editEpi(epi: EPI, index: number) {
    Swal.fire({
      title: `✏️ Modifier ${epi.designation}`,
      html: `
      <div class="swal-custom-form">
        <div class="swal-form-group">
          <label class="swal-label">📦 Référence / Marque</label>
          <input id="reference" class="swal-input-custom" value="${epi.reference}" placeholder="Ex: CS-001">
        </div>
        <div class="swal-row">
          <div class="swal-form-group half">
            <label class="swal-label">📏 Taille</label>
            <select id="taille" class="swal-select-custom">
              <option value="">Sélectionner</option>
              <option value="S" ${epi.taille === 'S' ? 'selected' : ''}>S</option>
              <option value="M" ${epi.taille === 'M' ? 'selected' : ''}>M</option>
              <option value="L" ${epi.taille === 'L' ? 'selected' : ''}>L</option>
              <option value="XL" ${epi.taille === 'XL' ? 'selected' : ''}>XL</option>
              <option value="XXL" ${epi.taille === 'XXL' ? 'selected' : ''}>XXL</option>
            </select>
          </div>
          <div class="swal-form-group half">
            <label class="swal-label">🔢 Quantité</label>
            <input id="quantite" type="number" class="swal-input-custom" value="${epi.quantite}" min="1">
          </div>
        </div>
        <div class="swal-form-group">
          <label class="swal-label">📅 Date de remise</label>
          <input id="dateRemise" type="date" class="swal-input-custom" value="${epi.dateRemise}">
        </div>
        <div class="swal-form-group">
          <label class="swal-label">📊 État</label>
          <select id="etat" class="swal-select-custom">
            <option value="Neuf" ${epi.etat === 'Neuf' ? 'selected' : ''}>🆕 Neuf</option>
            <option value="Bon état" ${epi.etat === 'Bon état' ? 'selected' : ''}>👍 Bon état</option>
            <option value="Usé" ${epi.etat === 'Usé' ? 'selected' : ''}>⚠️ Usé</option>
            <option value="À remplacer" ${epi.etat === 'À remplacer' ? 'selected' : ''}>🔄 À remplacer</option>
          </select>
        </div>
        <div class="swal-form-group">
          <label class="swal-checkbox">
            <input type="checkbox" id="signatureAgent" ${epi.signatureAgent ? 'checked' : ''}>
            <span class="checkmark"></span>
            <span class="checkbox-label">✍️ Signature Agent</span>
          </label>
        </div>
      </div>
    `,
      width: '550px',
      padding: '1.5rem',
      background: '#ffffff',
      backdrop: 'rgba(0,0,0,0.4)',
      showCancelButton: true,
      confirmButtonText: '💾 Enregistrer',
      cancelButtonText: '❌ Annuler',
      confirmButtonColor: '#1a472a',
      cancelButtonColor: '#6c757d',
      customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      },
      preConfirm: () => {
        const reference = (document.getElementById('reference') as HTMLInputElement)?.value;
        const taille = (document.getElementById('taille') as HTMLSelectElement)?.value;
        const quantite = parseInt((document.getElementById('quantite') as HTMLInputElement)?.value);
        const dateRemise = (document.getElementById('dateRemise') as HTMLInputElement)?.value;
        const etat = (document.getElementById('etat') as HTMLSelectElement)?.value;
        const signatureAgent = (document.getElementById('signatureAgent') as HTMLInputElement)?.checked;

        if (!reference || reference.trim() === '') {
          Swal.showValidationMessage('⚠️ La référence est requise');
          return false;
        }
        if (!dateRemise) {
          Swal.showValidationMessage('⚠️ La date de remise est requise');
          return false;
        }
        if (isNaN(quantite) || quantite < 1) {
          Swal.showValidationMessage('⚠️ La quantité doit être au moins 1');
          return false;
        }

        return { reference, taille, quantite, dateRemise, etat, signatureAgent };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.isLoading = true;

        // Mettre à jour l'EPI
        this.epiFormList[index] = {
          ...this.epiFormList[index],
          reference: result.value.reference,
          taille: result.value.taille,
          quantite: result.value.quantite,
          dateRemise: result.value.dateRemise,
          etat: result.value.etat,
          signatureAgent: result.value.signatureAgent
        };

        // Appel au service pour sauvegarder
        const epiData = {
          epi: this.epiFormList,
          epiRemplacements: this.epiRemplacementFormList,
          epiValidation: this.epiValidationForm
        };

        this.employeService.updateEpi(this.employe.id, epiData).subscribe({
          next: (response) => {
            this.isLoading = false;
            Swal.fire({
              title: '✅ Succès !',
              text: 'EPI modifié avec succès',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadEmployee(this.employe.id);
          },
          error: (error) => {
            console.error('Erreur:', error);
            this.isLoading = false;
            Swal.fire({
              title: '❌ Erreur',
              text: 'Erreur lors de la modification',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }

  // saveEpi(idEmploye: string) {
  //   this.isLoading = true;

  //   const epiData = {
  //     epi: this.epiFormList,
  //     epiRemplacements: this.epiRemplacementFormList,
  //     epiValidation: this.epiValidationForm
  //   };


  //   console.log('Données EPI à enregistrer:', epiData);

  //   this.employeService.updateEpi(this.employe.id, epiData).subscribe({
  //     next: (response) => {
  //       this.isLoading = false;
  //       this.alert.success('EPI enregistrés avec succès');
  //       this.closeEpiModal();
  //       this.loadEmployee(idEmploye);
  //     },
  //     error: (error) => {
  //       console.error('Erreur:', error);
  //       this.isLoading = false;
  //       this.alert.error('Erreur lors de l\'enregistrement');
  //     }
  //   });
  // }

  saveEpi(idEmploye: string) {
    this.isLoading = true;

    // Filtrer uniquement les EPI avec signature agent cochée
    const epiSignes = this.epiFormList.filter(epi => epi.signatureAgent === true);

    // Filtrer les remplacements avec signatures (optionnel)
    const remplacementsSignes = this.epiRemplacementFormList.filter(r =>
      r.signatureAgent === true && r.signatureResponsable === true
    );

    // Vérifier qu'au moins un EPI est signé
    if (epiSignes.length === 0) {
      this.alert.toast('Veuillez obtenir la signature agent pour au moins un EPI avant de sauvegarder');
      this.isLoading = false;
      return;
    }

    const epiData = {
      epi: epiSignes,
      epiRemplacements: remplacementsSignes,
      epiValidation: this.epiValidationForm
    };

    console.log('Données EPI à enregistrer (uniquement signés):', JSON.stringify(epiData, null, 2));
    console.log(`${epiSignes.length} EPI(s) signés sur ${this.epiFormList.length} total`);

    this.employeService.updateEpi(this.employe.id, epiData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alert.success(`${epiSignes.length} EPI(s) enregistrés avec succès`);
        this.closeEpiModal();
        this.loadEmployee(idEmploye);
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.isLoading = false;
        this.alert.error('Erreur lors de l\'enregistrement');
      }
    });
  }

  getEpiStateClass(etat: string): string {
    const classes: any = {
      'Neuf': 'state-neuf',
      'Bon état': 'state-bon',
      'Usé': '-state-use',
      'À remplacer': 'state-remplacer'
    };
    return classes[etat] || '';
  }








}
