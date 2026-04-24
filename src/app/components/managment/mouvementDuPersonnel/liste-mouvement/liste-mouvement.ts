import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MouvementPersonnel } from '../../../../core/interfaces/mobDemob.interface';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MouvementService } from '../../../../core/services/mouvement.service';

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

  stats = {
    onSite: 0,
    offSite: 0,
    pending: 0,
    demobilized: 0,
    total: 0
  };

  projets: string[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private mouvementService: MouvementService,
    private cdr: ChangeDetectorRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadData();
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
      }
    });
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

  calculateJours(mobilisation: string | Date | null, demobilisation: string | Date | null): number {
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

  viewDetails(agent: MouvementPersonnel) {
    if (!this.isBrowser) return;
    console.log('Détails:', agent);
    this.router.navigate(['/detail-mouvement-personnel', agent.id]);
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