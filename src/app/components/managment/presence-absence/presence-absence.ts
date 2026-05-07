import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Employes } from '../../../core/interfaces/agents';
import { Presence } from '../../../core/interfaces/presence.interface';
import { Router } from '@angular/router';
import { EmployeService } from '../../../core/services/employe.service';

@Component({
  selector: 'app-presence-absence',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './presence-absence.html',
  styleUrl: './presence-absence.css',
})
export class PresenceAbsence implements OnInit {
  employes: Employes[] = [];
  presences: Presence[] = [];
  dateSelectionnee: Date = new Date();
  vueActuelle: 'journalier' | 'mensuel' = 'journalier';

  // Pour la vue journalière
  presenceDuJour: { [employeId: string]: Presence } = {};
  heureArrivee: { [employeId: string]: string } = {};
  heureDepart: { [employeId: string]: string } = {};
  motifAbsence: { [employeId: string]: string } = {};

  // Pour le rapport mensuel
  moisSelectionne: number = new Date().getMonth();
  anneeSelectionnee: number = new Date().getFullYear();
  rapportMensuel: any[] = [];

  // Filtres
  searchTerm = '';
  selectedService = '';
  services: string[] = [];

  // Statistiques du jour
  stats = {
    total: 0,
    presents: 0,
    absents: 0,
    retards: 0,
    conges: 0,
    malades: 0,
    tauxPresence: 0
  };

  isLoading = false;
  isBrowser: boolean;
  private searchTimeout: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private employeService: EmployeService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Charger les employés
    this.employeService.getEmployes().subscribe({
      next: (data) => {
        this.employes = data;
        // Extraire les services uniques
        this.services = [...new Set(this.employes.map(e => e.service))];
        this.cdr.markForCheck();

        // Charger les présences existantes (mockées)
        this.loadPresences();

        // Charger la présence du jour
        this.loadPresenceDuJour();
        this.calculateStats();
      }
    })


  }

  loadPresences() {
    // Simuler des présences existantes
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    this.presences = [
      {
        id: 'PRS001',
        employeId: 'EMP001',
        employeNom: 'Dupont',
        employePrenom: 'Jean',
        date: yesterday,
        statut: 'present',
        heureArrivee: '08:15',
        heureDepart: '17:30'
      },
      {
        id: 'PRS002',
        employeId: 'EMP002',
        employeNom: 'Martin',
        employePrenom: 'Sophie',
        date: yesterday,
        statut: 'present',
        heureArrivee: '08:00',
        heureDepart: '17:00'
      },
      {
        id: 'PRS003',
        employeId: 'EMP003',
        employeNom: 'Bernard',
        employePrenom: 'Lucas',
        date: yesterday,
        statut: 'absent',
        motif: 'Congés'
      }
    ];
  }

  loadPresenceDuJour() {
    const todayStr = this.formatDate(this.dateSelectionnee);

    for (const employe of this.employes) {
      const presenceExistante = this.presences.find(p =>
        p.employeId === employe.id &&
        this.formatDate(p.date) === todayStr
      );

      if (presenceExistante) {
        this.presenceDuJour[employe.id] = presenceExistante;
        this.heureArrivee[employe.id] = presenceExistante.heureArrivee || '';
        this.heureDepart[employe.id] = presenceExistante.heureDepart || '';
        this.motifAbsence[employe.id] = presenceExistante.motif || '';
      } else {
        this.presenceDuJour[employe.id] = {
          id: '',
          employeId: employe.id,
          employeNom: employe.nom,
          employePrenom: employe.prenom,
          date: this.dateSelectionnee,
          statut: 'absent',
          heureArrivee: '',
          heureDepart: '',
          motif: ''
        };
        this.heureArrivee[employe.id] = '';
        this.heureDepart[employe.id] = '';
        this.motifAbsence[employe.id] = '';
      }
    }
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  formatDateFr(date: Date): string {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  }

  getNomPrenom(employe: Employes): string {
    return `${employe.nom} ${employe.prenom}`;
  }

  onStatutChange(employeId: string, statut: string) {
    if (this.presenceDuJour[employeId]) {
      this.presenceDuJour[employeId].statut = statut as any;
    }
  }

  onHeureArriveeChange(employeId: string, heure: string) {
    if (this.presenceDuJour[employeId]) {
      this.presenceDuJour[employeId].heureArrivee = heure;
    }
  }

  onHeureDepartChange(employeId: string, heure: string) {
    if (this.presenceDuJour[employeId]) {
      this.presenceDuJour[employeId].heureDepart = heure;
    }
  }

  onMotifChange(employeId: string, motif: string) {
    if (this.presenceDuJour[employeId]) {
      this.presenceDuJour[employeId].motif = motif;
    }
  }

  calculateStats() {
    const filteredEmployes = this.getFilteredEmployes();
    this.stats.total = filteredEmployes.length;
    this.stats.presents = filteredEmployes.filter(e => this.presenceDuJour[e.id]?.statut === 'present').length;
    this.stats.absents = filteredEmployes.filter(e => this.presenceDuJour[e.id]?.statut === 'absent').length;
    this.stats.retards = filteredEmployes.filter(e => this.presenceDuJour[e.id]?.statut === 'retard').length;
    this.stats.conges = filteredEmployes.filter(e => this.presenceDuJour[e.id]?.statut === 'congé').length;
    this.stats.malades = filteredEmployes.filter(e => this.presenceDuJour[e.id]?.statut === 'maladie').length;
    this.stats.tauxPresence = Math.round((this.stats.presents / this.stats.total) * 100) || 0;
  }

  getFilteredEmployes(): Employes[] {
    let filtered = [...this.employes];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(e =>
        e.nom.toLowerCase().includes(term) ||
        e.prenom.toLowerCase().includes(term) ||
        e.fonction.toLowerCase().includes(term)
      );
    }

    if (this.selectedService) {
      filtered = filtered.filter(e => e.service === this.selectedService);
    }

    return filtered;
  }

  onSearchChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.calculateStats();
      this.cdr.detectChanges();
    }, 300);
  }

  changeJournee(direction: 'prev' | 'next' | 'today') {
    if (direction === 'prev') {
      this.dateSelectionnee.setDate(this.dateSelectionnee.getDate() - 1);
    } else if (direction === 'next') {
      this.dateSelectionnee.setDate(this.dateSelectionnee.getDate() + 1);
    } else {
      this.dateSelectionnee = new Date();
    }
    this.loadPresenceDuJour();
    this.calculateStats();
  }

  getStatutClass(statut: string): string {
    const classes: any = {
      'present': 'status-present',
      'absent': 'status-absent',
      'retard': 'status-retard',
      'congé': 'status-conge',
      'maladie': 'status-maladie'
    };
    return classes[statut] || '';
  }

  getStatutIcon(statut: string): string {
    const icons: any = {
      'present': '✅',
      'absent': '❌',
      'retard': '⏰',
      'congé': '🏖️',
      'maladie': '🤒'
    };
    return icons[statut] || '📋';
  }

  sauvegarderPresences() {
    this.isLoading = true;

    // Sauvegarder toutes les présences du jour
    const todayStr = this.formatDate(this.dateSelectionnee);

    // Supprimer les anciennes présences pour cette date
    this.presences = this.presences.filter(p => this.formatDate(p.date) !== todayStr);

    // Ajouter les nouvelles présences
    for (const employe of this.employes) {
      const presence = this.presenceDuJour[employe.id];
      if (presence && presence.statut !== 'absent') {
        const newPresence = {
          ...presence,
          id: `PRS${Date.now()}${employe.id}`,
          date: new Date(this.dateSelectionnee)
        };
        this.presences.push(newPresence);
        console.log(newPresence);
        
      } else if (presence && presence.statut === 'absent' && presence.motif) {
        const newPresence = {
          ...presence,
          id: `PRS${Date.now()}${employe.id}`,
          date: new Date(this.dateSelectionnee)
        };
        this.presences.push(newPresence);
      }
    }

    setTimeout(() => {
      this.isLoading = false;
      alert('Présences sauvegardées avec succès !');
      this.cdr.detectChanges();
    }, 500);
  }

  genererRapportMensuel() {
    const mois = this.moisSelectionne;
    const annee = this.anneeSelectionnee;
    const joursDansMois = new Date(annee, mois + 1, 0).getDate();

    const rapport: any[] = [];

    for (const employe of this.employes) {
      const presenceEmploye: any = {
        id: employe.id,
        nom: `${employe.nom} ${employe.prenom}`,
        fonction: employe.fonction,
        service: employe.service,
        totalPresents: 0,
        totalAbsents: 0,
        totalRetards: 0,
        totalConges: 0,
        totalMaladies: 0,
        tauxPresence: 0,
        details: [] as any[]
      };

      for (let jour = 1; jour <= joursDansMois; jour++) {
        const date = new Date(annee, mois, jour);
        const presence = this.presences.find(p =>
          p.employeId === employe.id &&
          p.date.getDate() === jour &&
          p.date.getMonth() === mois &&
          p.date.getFullYear() === annee
        );

        if (presence) {
          presenceEmploye[`total${presence.statut.charAt(0).toUpperCase() + presence.statut.slice(1)}s`]++;
          presenceEmploye.details.push({
            jour: jour,
            statut: presence.statut,
            heureArrivee: presence.heureArrivee,
            motif: presence.motif
          });
        } else {
          // Vérifier si c'est un week-end
          const estWeekend = date.getDay() === 0 || date.getDay() === 6;
          if (!estWeekend) {
            presenceEmploye.totalAbsents++;
            presenceEmploye.details.push({ jour: jour, statut: 'absent', motif: 'Non renseigné' });
          } else {
            presenceEmploye.details.push({ jour: jour, statut: 'week-end', motif: 'Week-end' });
          }
        }
      }

      presenceEmploye.tauxPresence = Math.round((presenceEmploye.totalPresents / (joursDansMois - 8)) * 100) || 0;
      rapport.push(presenceEmploye);
    }

    this.rapportMensuel = rapport;
    this.vueActuelle = 'mensuel';
  }

  exporterRapport() {
    if (!this.isBrowser) return;

    let csv = 'Employé,Fonction,Service,Présents,Absents,Retards,Congés,Maladies,Taux Présence\n';

    for (const r of this.rapportMensuel) {
      csv += `"${r.nom}","${r.fonction}","${r.service}",${r.totalPresents},${r.totalAbsents},${r.totalRetards},${r.totalConges},${r.totalMaladies},${r.tauxPresence}%\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `rapport_presences_${this.moisSelectionne + 1}_${this.anneeSelectionnee}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  getMoisNom(mois: number): string {
    const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return moisNoms[mois];
  }

  getStatutLabel(statut: string): string {
    const labels: any = {
      'present': 'Présent',
      'absent': 'Absent',
      'retard': 'Retard',
      'congé': 'Congé',
      'maladie': 'Maladie',
      'week-end': 'Week-end'
    };
    return labels[statut] || statut;
  }

  getStatutColor(statut: string): string {
    const colors: any = {
      'present': '#06d6a0',
      'absent': '#ef476f',
      'retard': '#ffd166',
      'congé': '#4361ee',
      'maladie': '#764ba2',
      'week-end': '#adb5bd'
    };
    return colors[statut] || '#6c757d';
  }
}
