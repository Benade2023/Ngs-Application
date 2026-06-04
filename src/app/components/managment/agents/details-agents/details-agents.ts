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
  isCarteMarineExpired(): boolean {
    return this.employe.carteMarine ? this.isExpired(this.employe.carteMarine.dateExpiration) : false;
  }

  isCarteMarineNearExpiration(): boolean {
    return this.employe.carteMarine ? this.isNearExpiration(this.employe.carteMarine.dateExpiration, 30) : false;
  }

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

  onInductionFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.inductionForm.file = file;
      this.inductionForm.fileName = file.name;
    }
  }

  onHabilitationFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.habilitationForm.file = file;
      this.habilitationForm.fileName = file.name;
    }
  }
  onCertificatFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.certificatForm.file = file;
      this.certificatForm.fileName = file.name;
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
    expirationDate.setFullYear(expirationDate.getFullYear() + 3);

    const certificatData = {
      dateEmission: this.certificatForm.dateEmission,
      dateExpiration: expirationDate.toISOString().split('T')[0],
      document: this.certificatForm.fileName || this.certificatForm.documentExistant
    };

    console.log(certificatData);

    // Utiliser PATCH pour modifier uniquement l'induction
    this.employeService.updateCertificat(this.certificatForm.employeId, certificatData).subscribe({
      next: (response) => {
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
}
