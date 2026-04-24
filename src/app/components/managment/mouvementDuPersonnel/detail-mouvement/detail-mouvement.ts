import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Employes } from '../../../../core/interfaces/agents';
import { MouvementPersonnel, Rotation, TimesheetData, WeekData } from '../../../../core/interfaces/mobDemob.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { MouvementService } from '../../../../core/services/mouvement.service';
import { RotationService } from '../../../../core/services/rotation.service';
import { AlertService } from '../../../../core/services/alert.service';
import { ProjetsService } from '../../../../core/services/projet.service';
import { Projets } from '../../../../core/interfaces/projet.interface';
import { ListeEntreprises } from '../../../../core/interfaces/entreprise.data';


// export interface Agent {
//   id: number;
//   nom: string;
//   prenom: string;
//   email: string;
//   telephone: string;
//   adresse: string;
//   fonction: string;
//   entreprise: string;
//   avatar: string;
//   dateEntree: Date;
// }



@Component({
  selector: 'app-detail-mouvement',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './detail-mouvement.html',
  styleUrl: './detail-mouvement.css',
})
export class DetailMouvement implements OnInit, AfterViewInit {
  @ViewChild('activityChart') activityChartCanvas!: ElementRef;

  agent!: MouvementPersonnel;
  rotations: Rotation[] = [];
  filteredRotations: Rotation[] = [];
  searchHistorique = '';
  filterStatusHistorique = 'all';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  isLoading = false;
  currentRotationId: string = '';

  showRotationModal = false;
  showTimesheetModal = false;
  timesheetData: TimesheetData = {} as TimesheetData;

  rotation: Rotation = this.getEmptyRotation();

  isBrowser: boolean;
  totalJoursTravail = 0;
  totalProjets = 0;
  dateActuelle = new Date();
  projets: Projets[] = [];
  isEditMode = false;


  newRotation: Partial<Rotation> = {};

  private chart: any;
  employeId: string = '';

  listEntreprises = ListeEntreprises;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private mouvementService: MouvementService,
    private rotationService: RotationService,
    private alert: AlertService,
    private projetService: ProjetsService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      Chart.register(...registerables);
    }
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.employeId = id;
    if (id) {
      this.loadData(id);
    }
    this.loadProjets();

  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initChart();
      }, 500);
    }
  }

  loadProjets() {
    this.projetService.getProjets().subscribe({
      next: (response) => {
        this.projets = response;
      }
    })
  }

  loadData(id: string) {
    // Données mockées avec 20 rotations pour tester
    this.mouvementService.getMouvementPersonnelById(id).subscribe({
      next: (res => {
        this.agent = res;

      })
    })

    // Générer 20 rotations mockées
    // this.rotations = [];
    this.rotationService.getRotation().subscribe({
      next: (data) => {
        this.rotations = data.filter(r => r.employeId === id);
        console.log("Rotation chargé !", id, this.rotations);

        this.calculateStats();
        this.filterHistorique();
        this.initChart();
      }
    })

    // this.calculateStats();
    // this.filterHistorique();
  }

  calculateStats() {
    this.totalProjets = this.rotations.length;
    this.totalJoursTravail = this.rotations.reduce((total, rotation) => {
      const start = new Date(rotation.mobilisation);
      const end = rotation.demobilisation ? new Date(rotation.demobilisation) : new Date();
      const jours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return total + jours;
    }, 0);
  }

  filterHistorique() {
    let filtered = [...this.rotations];

    // Filtre par recherche
    if (this.searchHistorique.trim()) {
      const term = this.searchHistorique.toLowerCase();
      filtered = filtered.filter(r =>
        r.projet.toLowerCase().includes(term) ||
        r.site.toLowerCase().includes(term) ||
        r.fonction.toLowerCase().includes(term) ||
        r.activites.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (this.filterStatusHistorique === 'current') {
      filtered = filtered.filter(r => !r.demobilisation);
    } else if (this.filterStatusHistorique === 'completed') {
      filtered = filtered.filter(r => r.demobilisation);
    }

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredRotations = filtered.slice(start, start + this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterHistorique();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterHistorique();
    }
  }

  getCurrentProjet(): Rotation | null {
    return this.rotations.find(r => !r.demobilisation) || null;
  }

  getCurrentStatus(): string {
    return this.getCurrentProjet() ? 'En mission' : 'Disponible';
  }

  getCurrentStatusClass(): string {
    return this.getCurrentStatus() === 'En mission' ? 'status-mission' : 'status-disponible';
  }

  isCurrentProject(rotation: Rotation): boolean {
    return !rotation.demobilisation;
  }

  getProjectStatusClass(rotation: Rotation): string {
    return this.isCurrentProject(rotation) ? 'status-en-cours' : 'status-termine';
  }

  getRotationDuree(rotation: Rotation): number {
    const start = new Date(rotation.mobilisation);
    const end = rotation.demobilisation ? new Date(rotation.demobilisation) : new Date();
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  getAnciennete(): string {
    const now = new Date();
    const diffYears = now.getFullYear() - this.agent.mobilisation.getFullYear();
    const diffMonths = now.getMonth() - this.agent.mobilisation.getMonth();
    return diffYears > 0 ? `${diffYears} an${diffYears > 1 ? 's' : ''}` : `${diffMonths} mois`;
  }

  genererTimesheet(rotation: Rotation) {
    const startDate = new Date(rotation.mobilisation);
    const endDate = rotation.demobilisation ? new Date(rotation.demobilisation) : new Date();
    const duree = this.getRotationDuree(rotation);

    // Générer les semaines
    const weeks = this.generateWeeks(startDate, endDate);
    const totalHeures = weeks.reduce((sum, week) => sum + week.total, 0);

    this.timesheetData = {
      projet: rotation.projet,
      entreprise: rotation.entreprise,
      fonction: rotation.fonction,
      site: rotation.site,
      activites: rotation.activites,
      mobilisation: rotation.mobilisation,
      demobilisation: rotation.demobilisation,
      duree: duree,
      weeks: weeks,
      totalHeures: totalHeures
    };

    this.showTimesheetModal = true;
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

  generateWeeks(startDate: Date, endDate: Date): WeekData[] {
    const weeks: WeekData[] = [];
    let currentDate = new Date(startDate);
    let weekNum = 1;

    const heuresParJour = 8;

    while (currentDate <= endDate) {
      const week: WeekData = {
        numero: weekNum,
        lundi: null,
        mardi: null,
        mercredi: null,
        jeudi: null,
        vendredi: null,
        samedi: null,
        dimanche: null,
        total: 0
      };

      for (let i = 0; i < 7; i++) {
        const day = new Date(currentDate);
        if (day > endDate) break;

        const dayIndex = day.getDay();
        const hours = (dayIndex !== 0 && dayIndex !== 6) ? heuresParJour : 0;

        switch (dayIndex) {
          case 1: week.lundi = hours; break;
          case 2: week.mardi = hours; break;
          case 3: week.mercredi = hours; break;
          case 4: week.jeudi = hours; break;
          case 5: week.vendredi = hours; break;
          case 6: week.samedi = hours; break;
          case 0: week.dimanche = hours; break;
        }

        week.total += hours;
        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push(week);
      weekNum++;
    }

    return weeks;
  }

  async initChart() {
    if (!this.isBrowser || !this.activityChartCanvas) return;

    const ctx = this.activityChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    // Prendre les 10 dernières rotations pour le graphique
    const lastRotations = [...this.rotations].slice(-10);
    const labels = lastRotations.map(r => r.projet.substring(0, 15) + (r.projet.length > 15 ? '...' : ''));
    const durees = lastRotations.map(r => this.getRotationDuree(r));

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Durée (jours)',
          data: durees,
          backgroundColor: '#4361ee',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  imprimerTimesheet() {
    const printContent = document.getElementById('timesheet-content');
    const WindowPrt = window.open('', '', 'width=900,height=650');
    if (WindowPrt) {
      WindowPrt.document.write('<html><head><title>Timesheet</title>');
      WindowPrt.document.write('<style>');
      WindowPrt.document.write(`
        body { font-family: Arial, sans-serif; margin: 20px; }
        .timesheet-header { text-align: center; margin-bottom: 20px; }
        .timesheet-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .timesheet-table th, .timesheet-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        .timesheet-table th { background: #f5f5f5; }
        .info-row { margin-bottom: 10px; }
        .signature { margin-top: 30px; display: flex; justify-content: space-between; }
      `);
      WindowPrt.document.write('</style></head><body>');
      WindowPrt.document.write(printContent?.innerHTML || '');
      WindowPrt.document.write('</body></html>');
      WindowPrt.document.close();
      WindowPrt.print();
      WindowPrt.close();
    }
  }

  exporterTimesheetPDF() {
    console.log('Export PDF - À implémenter avec une librairie comme jspdf');
    alert('Fonctionnalité à venir : Export PDF');
  }

  viewRotationDetails(rotation: Rotation) {
    console.log('Détails rotation:', rotation);
    // Navigation vers page de détails de la rotation
  }

  addRotation() {
    this.isEditMode = false;
    this.rotation = this.getEmptyRotation();

    this.showRotationModal = true;
    this.newRotation = {
      projet: '',
      mobilisation: new Date(),
      demobilisation: null,
      fonction: this.agent.fonction,
      site: '',
      activites: '',
      observations: ''
    };
  }

  editRotation(rotation: Rotation) {
    this.currentRotationId = rotation.id;
    this.isEditMode = true;
    this.rotation = { ...rotation };
    this.showRotationModal = true;
  }

  getEmptyRotation(): Rotation {
    return {
      id: '',
      projet: '',
      mobilisation: new Date(),
      demobilisation: null,
      fonction: this.agent ? this.agent.fonction : '',
      site: '',
      entreprise: '',
      activites: '',
      observations: '',
      statut: '',
      employeId: this.employeId,
    };
  }

  // Méthode 2 : Génération d'un ID court (8 caractères)
  generateShortId(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  saveRotation() {
    this.isLoading = true;
    let fonction = this.agent.fonction;
    this.rotation.fonction = fonction ? fonction : 'Non spécifiée';
    this.rotation.id = this.generateShortId(); // Générer un ID unique pour la rotation
    this.rotation.employeId = this.agent.id; // Associer la rotation à l'employé

    if (!this.rotation.projet || !this.rotation.mobilisation || !this.rotation.site || !this.rotation.entreprise || !this.rotation.activites) {
      this.alert.toast('Veuillez remplir tous les champs obligatoires, ', 'error');
      return;
    }

    // const request = this.rotationService.addRotation(this.rotation);
     const request = this.isEditMode
      ? this.rotationService.updateRotation(this.currentRotationId, this.rotation)
      : this.rotationService.addRotation(this.rotation);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.alert.toast(this.isEditMode ? 'Rotation mise à jour avec succès' : 'Rotation ajoutée avec succès');
        this.loadData(this.agent.id);
        this.cdr.markForCheck();
        this.rotations.unshift(this.rotation);
        this.calculateStats();
        this.filterHistorique();
        this.initChart();
        this.closeModal();

        // this.updateStatusAgent(this.agent.id, this.agent);
      },
      error: () => {
        this.isLoading = false; // 
        console.log('Erreur lors de la sauvegarde de la rotation');

        this.alert.toast('Erreur lors de la sauvegarde de la rotation', 'error');
      }
    });

  }

  // updateStatusAgent(employeId: string, agent: MouvementPersonnel) {
  //   if(this.rotation.demobilisation !== null){
  //     const updatedAgent = { ...agent, status: 'Hors site' };
  //     this.mouvementService.updateMouvementPersonnel(employeId, updatedAgent).subscribe({
  //       next: () => {
  //         console.log('Statut de l\'agent mis à jour avec succès');
  //       }
  //     });
  //   } else {
  //     const updatedAgent = { ...agent, status: 'Sur site' };
  //     this.mouvementService.updateMouvementPersonnel(employeId, updatedAgent).subscribe({
  //       next: () => {
  //         console.log('Statut de l\'agent mis à jour avec succès');
  //       }
  //     });
  //   }
  // }

  closeModal() {
    this.showRotationModal = false;
  }

  closeModalOnOutside(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeModal();
    }
  }

  closeTimesheetModal() {
    this.showTimesheetModal = false;
  }

  closeTimesheetModalOnOutside(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeTimesheetModal();
    }
  }

  editAgent() {
    this.router.navigate(['/agents/modifier', this.agent.id]);
  }

  goBack() {
    this.router.navigate(['/mouvement-personnel']);
  }
}
