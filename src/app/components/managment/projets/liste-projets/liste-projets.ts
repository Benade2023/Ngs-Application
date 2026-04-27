import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Projets } from '../../../../core/interfaces/projet.interface';
import { Router } from '@angular/router';
import { ProjetsService } from '../../../../core/services/projet.service';
import { ListeEntreprises } from '../../../../core/interfaces/entreprise.data';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-liste-projets',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './liste-projets.html',
  styleUrl: './liste-projets.css',
})
export class ListeProjets implements OnInit {

  projets: Projets[] = [];
  filteredProjets: Projets[] = [];
  searchTerm = '';
  filterStatus = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  isBrowser: boolean;
  private searchTimeout: any;
  listClient = ListeEntreprises;

  // Modal
  showModal = false;
  isEditMode = false;
  selectedProjet: Projets = this.getEmptyProjet();
  isLoading = false;

  stats = {
    enCours: 0,
    termine: 0,
    annule: 0,
    total: 0
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private projetsService: ProjetsService,
    private cdr: ChangeDetectorRef,
    private alert: AlertService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadData();
  }

  getEmptyProjet(): Projets {
    return {
      id: '',
      nom: '',
      description: '',
      client: '',
      site: '',
      dateDebut: new Date(),
      dateFin: null,
      status: 'En cours'
    };
  }

  private toDate(dateValue: string | Date | null): Date | null {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  }

  formatDate(dateValue: string | Date | null): string {
    if (!dateValue) return '';
    const date = this.toDate(dateValue);
    if (!date) return '';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  loadData() {
    this.projetsService.getProjets().subscribe({
      next: (response: Projets[]) => {
        this.projets = response || [];
        this.calculateStats();
        this.applyFilters();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des projets:', error);
        this.alert.error('Erreur lors du chargement des projets');
      }
    });
  }

  calculateStats() {
    this.stats.enCours = this.projets.filter(p => p.status === 'En cours').length;
    this.stats.termine = this.projets.filter(p => p.status === 'Terminé').length;
    this.stats.annule = this.projets.filter(p => p.status === 'Annulé').length;
    this.stats.total = this.projets.length;
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'En cours': 'status-en-cours',
      'Terminé': 'status-termine',
      'Annulé': 'status-annule'
    };
    return classes[status] || 'status-default';
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      'En cours': '🟢',
      'Terminé': '✅',
      'Annulé': '❌'
    };
    return icons[status] || '📋';
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
    let filtered = [...this.projets];

    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.nom.toLowerCase().includes(term) ||
        p.client.toLowerCase().includes(term) ||
        p.site.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    if (this.filterStatus) {
      filtered = filtered.filter(p => p.status === this.filterStatus);
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredProjets = filtered.slice(start, start + this.itemsPerPage);
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

  openAddModal() {
    this.isEditMode = false;
    this.selectedProjet = this.getEmptyProjet();
    this.showModal = true;
  }

  openEditModal(projet: Projets) {
    this.isEditMode = true;
    this.selectedProjet = { ...projet };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProjet = this.getEmptyProjet();
  }

  closeModalOnOutside(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }

  saveProjet() {
    if (!this.selectedProjet.nom || !this.selectedProjet.client || !this.selectedProjet.site) {
      this.alert.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isLoading = true;

    if (this.isEditMode) {
      this.projetsService.updateProjet(this.selectedProjet.id, this.selectedProjet).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
          this.isLoading = false;
          this.alert.success('Projet mis à jour avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.alert.error('Erreur lors de la modification');
          this.isLoading = false;
        }
      });
    } else {
      this.projetsService.addProjet(this.selectedProjet).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout:', error);
          this.alert.error('Erreur lors de l\'ajout');
          this.isLoading = false;
        }
      });
    }
  }

  deleteProjet(projet: Projets) {
    if (!this.isBrowser) return;

    if (confirm(`Supprimer le projet "${projet.nom}" ?`)) {
      this.projetsService.deleteProjet(projet.id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.alert.error('Erreur lors de la suppression');
        }
      });
    }
  }

  viewProjetDetails(projet: Projets) {
    if (!this.isBrowser) return;
    this.router.navigate(['/rapports', projet.id]);
  }

  getDaysRemaining(dateFin: Date | null): number {
    if (!dateFin) return 0;
    const end = this.toDate(dateFin);
    if (!end) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  getProgressPercentage(dateDebut: Date | string, dateFin: Date | string | null): number {
    const start = this.toDate(dateDebut);
    const end = this.toDate(dateFin);
    if (!start) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!end || today > end) return 100;
    if (today < start) return 0;

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));
  }

}
