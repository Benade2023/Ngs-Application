import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MouvementPersonnel, Rotation } from '../../../../core/interfaces/mobDemob.interface';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MouvementService } from '../../../../core/services/mouvement.service';
import { Employes } from '../../../../core/interfaces/agents';
import { ListeEntreprises } from '../../../../core/interfaces/entreprise.data';
import { EmployeService } from '../../../../core/services/employe.service';
import { AlertService } from '../../../../core/services/alert.service';
import { ProjetsService } from '../../../../core/services/projet.service';
import { Projets } from '../../../../core/interfaces/projet.interface';
import { RotationService } from '../../../../core/services/rotation.service';

@Component({
  selector: 'app-liste-mouvement',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './liste-mouvement.html',
  styleUrl: './liste-mouvement.css',
})
export class ListeMouvement implements OnInit {
  agents: MouvementPersonnel[] = [];
  filteredAgents: MouvementPersonnel[] = [];
  searchTerm = '';
  filterSite = '';
  filterStatus = '';
  filterProjet = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  isBrowser: boolean;
  private searchTimeout: any;
  isEditMode: boolean = false;
  emplyeeToEdit: MouvementPersonnel | null = null;
  showModal: boolean = false;
  selectedMouvement: MouvementPersonnel = this.getEmptyMouvement();
  listClient = ListeEntreprises;
  listEmployes: Employes[] = [];

  stats = {
    onSite: 0,
    offSite: 0,
    pending: 0,
    demobilized: 0,
    total: 0
  };

  projets: string[] = [];
  listProjets: Projets[] = [];
  isLoading: boolean = false;
  rotation: Rotation = this.getEmptyRotation();


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private mouvementService: MouvementService,
    private cdr: ChangeDetectorRef,
    private employeService: EmployeService,
    private alertService: AlertService,
    private projetService: ProjetsService,
    private rotationService: RotationService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadData();
    this.loadEmployes();
    this.loadProjets();
  }

  getEmptyMouvement(): MouvementPersonnel {
    return {
      id: '',
      employe: {} as Employes,
      nom: '',
      prenom: '',
      fonction: '',
      projet: '',
      mobilisation: new Date(),
      demobilisation: null,
      nombreJours: null,
      status: 'Sur site',
      dateEstimeDemob: new Date(),
      etat: true,
      activites: '',
      site: '',
      entreprise: '',
      email: '',
      avatar: '',
      telephone: '',
      adresse: '',
    };
  }

  getEmptyRotation(): Rotation {
    return {
      id: '',
      projet: '',
      mobilisation: new Date(),
      demobilisation: null,
      fonction: '',
      site: '',
      entreprise: '',
      activites: '',
      observations: '',
      statut: '',
      employeId: '',
    };
  }

  // Méthode 2 : Génération d'un ID court (8 caractères)
  generateShortId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  loadProjets() {
    this.projetService.getProjets().subscribe({
      next: (response) => {
        this.listProjets = response;
      }
    })
  }

  loadData() {
    this.mouvementService.getMouvementPersonnel().subscribe({
      next: (response: MouvementPersonnel[]) => {
        this.agents = response || [];
        this.calculateStats();
        this.extractProjets();
        this.applyFilters();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
        this.alertService.error('Erreur lors du chargement des employés');
      }
    });
  }

  // Charger la liste des employés
  loadEmployes() {
    this.employeService.getEmployes().subscribe({
      next: (response: Employes[]) => {
        this.listEmployes = response || [];
      },
      error: (error) => {
        console.error('Erreur chargement employés:', error);
      }
    });
  }

  addMouvement() {
    console.log('Ouverture modal ajout'); // Pour déboguer
    this.isEditMode = false;
    this.selectedMouvement = this.getEmptyMouvement();
    this.showModal = true;
    console.log('showModal =', this.showModal); // Pour déboguer
  }

  openEditModal(mouvement: MouvementPersonnel) {
    console.log('Ouverture modal édition'); // Pour déboguer
    this.isEditMode = true;
    this.selectedMouvement = {
      ...mouvement,
      mobilisation: new Date(mouvement.mobilisation),
      demobilisation: mouvement.demobilisation ? new Date(mouvement.demobilisation) : null,
      dateEstimeDemob: new Date(mouvement.dateEstimeDemob)
    };
    this.showModal = true;
    console.log('showModal =', this.showModal); // Pour déboguer
  }

  // Dans votre composant, ajoutez ces méthodes helper

  formatDateToString(date: Date | string | null): string {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
  }

  updateMobilisation(event: any) {
    const value = event.target.value;
    this.selectedMouvement.mobilisation = value ? new Date(value) : new Date();
  }

  updateDemobilisation(event: any) {
    const value = event.target.value;
    this.selectedMouvement.demobilisation = value ? new Date(value) : null;
  }

  updateDateEstimeDemob(event: any) {
    const value = event.target.value;
    this.selectedMouvement.dateEstimeDemob = value ? new Date(value) : new Date();
  }


  // Quand un employé est sélectionné
  onEmployeChange() {
    if (this.selectedMouvement.employe?.id) {
      // Pré-remplir les champs avec les infos de l'employé
      this.selectedMouvement.nom = this.selectedMouvement.employe.nom;
      this.selectedMouvement.prenom = this.selectedMouvement.employe.prenom;
      this.selectedMouvement.fonction = this.selectedMouvement.employe.fonction;
      this.selectedMouvement.email = this.selectedMouvement.employe.email;
      this.selectedMouvement.telephone = this.selectedMouvement.employe.telephone;
      this.selectedMouvement.avatar = this.selectedMouvement.employe.avatar;
    }
  }

  // Calculer automatiquement le nombre de jours
  calculateJours() {
    if (this.selectedMouvement.mobilisation && this.selectedMouvement.demobilisation) {
      const start = new Date(this.selectedMouvement.mobilisation);
      const end = new Date(this.selectedMouvement.demobilisation);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      this.selectedMouvement.nombreJours = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else if (this.selectedMouvement.mobilisation && this.selectedMouvement.dateEstimeDemob) {
      const start = new Date(this.selectedMouvement.mobilisation);
      const end = new Date(this.selectedMouvement.dateEstimeDemob);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      this.selectedMouvement.nombreJours = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }


  // Vérifier si le formulaire est valide
  isFormValid(): boolean {
    return !!(this.selectedMouvement.employe?.id &&
      this.selectedMouvement.projet &&
      this.selectedMouvement.site &&
      this.selectedMouvement.entreprise &&
      this.selectedMouvement.activites &&
      this.selectedMouvement.mobilisation);
  }



  closeModal() {
    this.showModal = false;
    this.selectedMouvement = this.getEmptyMouvement();
  }

  closeModalOnOutside(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }

  getMouvementById(id: string) {
    this.mouvementService.getMouvementPersonnelById(id).subscribe({
      next: (response) => {
        this.selectedMouvement = response;
      }
    })
  }

  // Sauvegarder le mouvement
  saveMouvement() {
    if (event) {
      event.preventDefault();
    }
    if (!this.isFormValid()) {
      this.alertService.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.calculateJours();
    this.isLoading = true;

    if (this.isEditMode) {
      this.mouvementService.updateMouvementPersonnel(this.selectedMouvement.id, this.selectedMouvement).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
          this.isLoading = false;
          this.alertService.success('Mouvement mis à jour avec succès');

        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.isLoading = false;
          this.alertService.error('Erreur lors de la modification du mouvement');
        }
      });
    } else {
      this.mouvementService.addMouvementPersonnel(this.selectedMouvement).subscribe({
        next: (res) => {
          this.loadData();
          this.closeModal();
          this.isLoading = false;
          this.alertService.success('Mouvement créé avec succès');
          // this.getMouvementById(this.selectedMouvement.id);
          //console.log(res);

          const requestRotation: Rotation = {
            id: this.generateShortId(),
            projet: res.projet,
            mobilisation: res.mobilisation,
            demobilisation: res.demobilisation,
            fonction: res.fonction,
            site: res.site,
            entreprise: res.entreprise,
            activites: res.activites,
            observations: '',
            statut: res.status,
            employeId: res.employe.id,
          }

          this.rotationService.addRotation(requestRotation).subscribe({
            next: () => {
              this.router.navigate(['/detail-mouvement-personnel', res.employe.id]);
            },
            error: (error) => {
              console.error('Erreur lors de la création de la rotation:', error);
              this.alertService.error('Erreur lors de la création de la rotation');
            }
          })
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.isLoading = false;
          this.alertService.error('Erreur lors de la création du mouvement');
        }
      });
    }
  }

  // Méthode utilitaire pour convertir une date en objet Date
  private toDate(dateValue: string | Date | null): Date | null {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  }

  // Méthode pour formater une date
  formatDate(dateValue: string | Date | null): string {
    if (!dateValue) return '';
    const date = this.toDate(dateValue);
    if (!date) return '';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }





  calculateStats() {
    this.stats.onSite = this.agents.filter(a => a.status === 'Sur site').length;
    this.stats.offSite = this.agents.filter(a => a.status === 'Hors site').length;
    this.stats.pending = this.agents.filter(a => a.status === 'En attente').length;
    this.stats.demobilized = this.agents.filter(a => a.status === 'Démobilisé').length;
    this.stats.total = this.agents.length;
  }

  extractProjets() {
    const projetsSet = new Set(this.agents.map(a => a.projet));
    this.projets = Array.from(projetsSet);
  }

  calculateJoursData(mobilisation: string | Date | null, demobilisation: string | Date | null): number {
    const start = this.toDate(mobilisation);
    const end = this.toDate(demobilisation);

    if (!start || !end) return 0;

    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isDateExpiringSoon(dateValue: string | Date | null): boolean {
    const date = this.toDate(dateValue);
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'Sur site': 'status-onsite',
      'Hors site': 'status-offsite',
      'En attente': 'status-pending',
      'Démobilisé': 'status-demobilized'
    };
    return classes[status] || 'status-default';
  }

  onSearchChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.applyFilters();
    }, 300);
  }

  applyFilters() {
    let filtered = [...this.agents];

    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(a =>
        a.nom.toLowerCase().includes(term) ||
        a.fonction.toLowerCase().includes(term) ||
        a.projet.toLowerCase().includes(term) ||
        a.site.toLowerCase().includes(term) ||
        a.activites.toLowerCase().includes(term)
      );
    }

    if (this.filterSite) {
      filtered = filtered.filter(a => a.site === this.filterSite);
    }

    if (this.filterStatus) {
      filtered = filtered.filter(a => a.status === this.filterStatus);
    }

    if (this.filterProjet) {
      filtered = filtered.filter(a => a.projet === this.filterProjet);
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);

    // Ajuster la page courante si elle dépasse le nombre total de pages
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredAgents = filtered.slice(start, start + this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }

  viewDetails(mouvement: MouvementPersonnel) {
    if (!this.isBrowser) return;
    // console.log('Détails:', mouvement);
    this.router.navigate(['/detail-mouvement-personnel', mouvement.employe.id]);
  }

  editAgent(agent: MouvementPersonnel) {
    if (!this.isBrowser) return;
    console.log('Modifier:', agent);
    this.router.navigate(['/edit-mouvement-personnel', agent.id]);
  }

  exportToExcel() {
    if (!this.isBrowser) return;
    console.log('Export Excel');
  }
}