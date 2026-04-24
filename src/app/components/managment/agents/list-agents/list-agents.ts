import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Employes } from '../../../../core/interfaces/agents';
import { EmployeService } from '../../../../core/services/employe.service';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-list-agents',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './list-agents.html',
  styleUrl: './list-agents.css',
})
export class ListAgents implements OnInit {
  employees: Employes[] = [];
  filteredEmployees: Employes[] = [];
  searchTerm = '';
  selectedFilter = 'all';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  isBrowser: boolean;
  private searchTimeout: any;

  stats = {
    onSite: 0,
    remote: 0,
    sick: 0,
    onLeave: 0,
    unavailable: 0,
    total: 0,
    onSiteToday: 0,
    leaveThisWeek: 0
  };

  constructor(
    private employeService: EmployeService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private alert: AlertService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadEmployees();
    if (this.isBrowser) {
      this.calculateStats();
    }
  }

  // Générer un avatar avec les initiales
  getAvatarUrl(employee: any): SafeUrl {
    if (employee.avatar && employee.avatar !== '') {
      return employee.avatar;
    }

    // Créer un avatar SVG avec les initiales
    const firstLetter = employee.prenom ? employee.prenom.charAt(0).toUpperCase() : '?';
    const lastLetter = employee.nom ? employee.nom.charAt(0).toUpperCase() : '?';
    const initials = `${firstLetter}${lastLetter}`;

    // Couleurs de fond dynamiques basées sur l'ID
    const colors = ['#4361ee', '#06d6a0', '#ffd166', '#ef476f', '#118ab2', '#764ba2'];
    const colorIndex = employee.id.charCodeAt(employee.id.length - 1) % colors.length;
    const bgColor = colors[colorIndex];

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="${bgColor}" rx="50"/>
      <text x="50" y="68" font-size="40" text-anchor="middle" fill="white" font-weight="bold" font-family="Arial">${initials}</text>
    </svg>`;

    const encodedSvg = 'data:image/svg+xml,' + encodeURIComponent(svg);
    return this.sanitizer.bypassSecurityTrustUrl(encodedSvg);
  }

  loadEmployees() {
    this.employeService.getEmployes().subscribe({
      next: (response: Employes[]) => {
        this.employees = response || [];
        this.calculateStats();
        this.cdr.markForCheck();
        this.filterEmployees();


      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
      }
    })


  }

  calculateStats() {
    this.stats.onSite = this.employees.filter(e => e.statut === 'onSite').length;
    this.stats.remote = this.employees.filter(e => e.statut === 'remote').length;
    this.stats.sick = this.employees.filter(e => e.statut === 'sick').length;
    this.stats.onLeave = this.employees.filter(e => e.statut === 'leave').length;
    this.stats.unavailable = this.employees.filter(e => e.statut === 'unavailable').length;
    this.stats.total = this.employees.length;
    this.stats.onSiteToday = 8;
    this.stats.leaveThisWeek = 3;
  }

  onSearchChange() {
    this.currentPage = 1;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // 🔥 Si champ vide → refresh immédiat
    if (!this.searchTerm || !this.searchTerm.trim()) {
      this.filterEmployees();
      return;
    }

    this.searchTimeout = setTimeout(() => {
      this.filterEmployees();
    }, 300);
  }

  filterEmployees() {
    let filtered = [...this.employees];

    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(e => e.statut === this.selectedFilter);
    }

    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(e =>
        e.nom?.toLowerCase().includes(term) ||
        e.prenom?.toLowerCase().includes(term) ||
        e.email?.toLowerCase().includes(term) ||
        e.fonction?.toLowerCase().includes(term)
      );
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage) || 1;

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredEmployees = filtered.slice(start, start + this.itemsPerPage);
    console.log(this.employees);

  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
    this.currentPage = 1;
    this.filterEmployees();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterEmployees();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterEmployees();
    }
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

  viewEmployee(employeeId: string) {
    if (!this.isBrowser) return;
    const employee = this.employees.find(e => e.id === employeeId);
    console.log('Voir détails:', employee);
  }

  editEmployee(employee: any) {
    if (!this.isBrowser) return;
    this.router.navigate(['/employes/modifier', employee.id]);
  }

  deleteEmployee(employee: any) {
    if (!this.isBrowser) return;
    this.alert.confirm(`Supprimer ${employee.nom} ${employee.prenom} ?`)
      .then(confirmed => {
        if (confirmed) {
          this.employeService.deleteEmploye(employee.id).subscribe({
            next: () => {
              this.loadEmployees();
              this.alert.success('Employé supprimé avec succès');
            },
            error: (error) => {
              console.error('Erreur lors de la suppression:', error);
              this.alert.error('Erreur lors de la suppression');
            }
          });
        }
      });
  }

  //if (confirm(`Supprimer ${employee.nom} ${employee.prenom} ?`)) {
  //     this.employeService.deleteEmploye(employee.id).subscribe({
  //       next: () => {
  //         this.loadEmployees();
  //       },
  //       error: (error) => {
  //         console.error('Erreur lors de la suppression:', error);
  //       }
  //     });
  //   }

  addEmployee() {
    if (!this.isBrowser) return;
    this.router.navigate(['/employes/add']);
  }

  getInitials(nom: string, prenom: string): string {
  const first = nom ? nom.charAt(0).toUpperCase() : '';
  const second = prenom ? prenom.charAt(0).toUpperCase() : '';
  return first + second;
}

  getAvatarColor(name: string): string {
  const colors = ['#4361ee', '#06d6a0', '#ef476f', '#ffd166', '#118ab2'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

  ngOnDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

}
