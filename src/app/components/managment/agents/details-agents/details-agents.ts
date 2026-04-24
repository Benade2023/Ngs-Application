import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Employes } from '../../../../core/interfaces/agents';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { EmployeService } from '../../../../core/services/employe.service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-details-agents',
  imports: [CommonModule],
  templateUrl: './details-agents.html',
  styleUrl: './details-agents.css',
})
export class DetailsAgents implements OnInit {

  employe!: Employes;
  isBrowser: boolean;

  // Durées de validité (en années)
  readonly INDUCTION_DUREE = 3; // 3 ans
  readonly HABILITATION_DUREE = 3; // 3 ans
  readonly CERTIFICAT_MEDICAL_DUREE = 1; // 1 an
  readonly CARTE_MARINE_DUREE = 0.5; // 6 mois

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private employeService: EmployeService,
    private alert: AlertService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadEmployee(id);
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

  // Habilitation
  isHabilitationExpired(): boolean {
    return this.employe.habilitation ? this.isExpired(this.employe.habilitation.dateExpiration) : false;
  }

  isHabilitationNearExpiration(): boolean {
    return this.employe.habilitation ? this.isNearExpiration(this.employe.habilitation.dateExpiration) : false;
  }

  getHabilitationStatus(): string {
    if (!this.employe.habilitation) return 'Non renseigné';
    if (this.isHabilitationExpired()) return 'Expiré';
    if (this.isHabilitationNearExpiration()) return 'Expire bientôt';
    return 'Valide';
  }

  getHabilitationClass(): string {
    if (!this.employe.habilitation) return 'status-unknown';
    if (this.isHabilitationExpired()) return 'status-expired';
    if (this.isHabilitationNearExpiration()) return 'status-warning';
    return 'status-valid';
  }

  // Certificat Médical
  isCertificatMedicalExpired(): boolean {
    return this.employe.certificatMedical ? this.isExpired(this.employe.certificatMedical.dateExpiration) : false;
  }

  isCertificatMedicalNearExpiration(): boolean {
    return this.employe.certificatMedical ? this.isNearExpiration(this.employe.certificatMedical.dateExpiration) : false;
  }

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
}
