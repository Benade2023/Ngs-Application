import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import Chart from 'chart.js/auto';

import { isPlatformBrowser } from '@angular/common';
import { Chart, registerables } from 'chart.js';

// Déclarer Chart pour éviter les erreurs d'import en SSR
// declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit {

  userName = 'Admin';
  startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  endDate = new Date().toISOString().split('T')[0];

  @ViewChild('attendanceCanvas') attendanceCanvas!: ElementRef;
  @ViewChild('departmentCanvas') departmentCanvas!: ElementRef;

  // Indique si on est dans le navigateur
  isBrowser: boolean;

  // Références aux graphiques
  private attendanceChart: any;
  private departmentChart: any;

  // Statistiques
  stats = {
    totalEmployees: 147,
    newEmployees: 12,
    presentToday: 128,
    presenceRate: 87,
    totalLeaves: 8,
    pendingLeaves: 3,
    totalLate: 5,
    totalAbsences: 14,
    satisfactionRate: 92
  };

  // Calendrier
  currentDate = new Date();
  currentMonthName = '';
  currentYear = 0;
  weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  calendarDays: any[] = [];

  // Données
  departmentStats = [
    { name: 'Développement', count: 45, percentage: 0 },
    { name: 'Marketing', count: 23, percentage: 0 },
    { name: 'RH', count: 12, percentage: 0 },
    { name: 'Finance', count: 18, percentage: 0 },
    { name: 'Commercial', count: 32, percentage: 0 }
  ];

  upcomingBirthdays: any[] = [];
  pendingLeaveRequests: any[] = [];
  recentActivities: any[] = [];
  topPerformers: any[] = [];
  performancePeriod = 'month';

  // constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  //   this.isBrowser = isPlatformBrowser(this.platformId);
  // }
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Enregistrer les composants Chart.js uniquement côté client
    if (this.isBrowser) {
      Chart.register(...registerables);
    }
  }
  

  ngOnInit() {
    // Charger les données (toujours safe)
    this.loadDashboardData();
    this.updateCalendar();

    // Calculer les pourcentages
    this.calculateDepartmentPercentages();
  }

  ngAfterViewInit() {
    // Initialiser les graphiques uniquement côté navigateur
    if (this.isBrowser) {
      // Attendre que le DOM soit complètement chargé
      setTimeout(() => {
        this.initCharts();
      }, 100);
    }
  }

  calculateDepartmentPercentages() {
    const total = this.departmentStats.reduce((sum, dept) => sum + dept.count, 0);
    this.departmentStats.forEach(dept => {
      dept.percentage = (dept.count / total) * 100;
    });
  }

  loadDashboardData() {
    this.loadStats();
    this.loadUpcomingBirthdays();
    this.loadPendingLeaveRequests();
    this.loadRecentActivities();
    this.loadTopPerformers();
  }

  loadStats() {
    // Données déjà initialisées
  }

  loadUpcomingBirthdays() {
    this.upcomingBirthdays = [
      { name: 'Jean Dupont', position: 'Développeur Senior', date: new Date(2024, 11, 15), age: 32, avatar: '' },
      { name: 'Marie Martin', position: 'Chef de projet', date: new Date(2024, 11, 18), age: 28, avatar: '' },
      { name: 'Pierre Durand', position: 'Designer', date: new Date(2024, 11, 22), age: 35, avatar: '' }
    ];
  }

  loadPendingLeaveRequests() {
    this.pendingLeaveRequests = [
      { id: 1, employeeName: 'Sophie Bernard', type: 'Congés payés', startDate: new Date(2024, 11, 20), endDate: new Date(2024, 11, 27) },
      { id: 2, employeeName: 'Thomas Petit', type: 'RTT', startDate: new Date(2024, 11, 22), endDate: new Date(2024, 11, 23) },
      { id: 3, employeeName: 'Julie Robert', type: 'Congés sans solde', startDate: new Date(2024, 11, 25), endDate: new Date(2024, 11, 30) }
    ];
  }

  loadRecentActivities() {
    this.recentActivities = [
      { type: 'hire', icon: '👤', description: 'Nouvel employé: Lucas Martin a rejoint l\'équipe Développement', date: new Date(), time: new Date() },
      { type: 'leave', icon: '🏖️', description: 'Demande de congé approuvée pour Emma Dubois', date: new Date(), time: new Date() },
      { type: 'promotion', icon: '📈', description: 'Promotion: Antoine Leroy devient Lead Developer', date: new Date(), time: new Date() },
      { type: 'birthday', icon: '🎂', description: 'Anniversaire de Claire Moreau aujourd\'hui', date: new Date(), time: new Date() }
    ];
  }

  loadTopPerformers() {
    this.topPerformers = [
      { name: 'Nicolas Dubois', score: 98 },
      { name: 'Camille Rousseau', score: 95 },
      { name: 'Alexandre Lefebvre', score: 94 },
      { name: 'Isabelle Moreau', score: 92 },
      { name: 'François Girard', score: 90 }
    ];
  }

    initCharts() {
    try {
      this.initAttendanceChart();
      this.initDepartmentChart();
      console.log('Graphiques initialisés avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des graphiques:', error);
    }
  }
  
  initAttendanceChart() {
    if (!this.attendanceCanvas || !this.attendanceCanvas.nativeElement) {
      console.error('Canvas attendance non trouvé');
      return;
    }
    
    const ctx = this.attendanceCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    
    // Détruire le graphique existant
    if (this.attendanceChart) {
      this.attendanceChart.destroy();
    }
    
    this.attendanceChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        datasets: [
          {
            label: 'Présents',
            data: [125, 128, 130, 127, 129, 95],
            borderColor: '#06d6a0',
            backgroundColor: 'rgba(6, 214, 160, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#06d6a0',
            pointBorderColor: '#fff',
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Absents',
            data: [15, 12, 10, 13, 11, 45],
            borderColor: '#ef476f',
            backgroundColor: 'rgba(239, 71, 111, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#ef476f',
            pointBorderColor: '#fff',
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Retards',
            data: [7, 5, 4, 6, 5, 2],
            borderColor: '#ffd166',
            backgroundColor: 'rgba(255, 209, 102, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#ffd166',
            pointBorderColor: '#fff',
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              boxWidth: 10,
              font: {
                family: 'Calibri'
              }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            title: {
              display: true,
              text: 'Nombre d\'employés'
            }
          },
          x: {
            grid: {
              display: false
            },
            title: {
              display: true,
              text: 'Jours de la semaine'
            }
          }
        }
      }
    });
  }
  
  initDepartmentChart() {
    if (!this.departmentCanvas || !this.departmentCanvas.nativeElement) {
      console.error('Canvas department non trouvé');
      return;
    }
    
    const ctx = this.departmentCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    
    if (this.departmentChart) {
      this.departmentChart.destroy();
    }
    
    this.departmentChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.departmentStats.map(d => d.name),
        datasets: [{
          data: this.departmentStats.map(d => d.count),
          backgroundColor: ['#4361ee', '#06d6a0', '#ffd166', '#ef476f', '#118ab2'],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              boxWidth: 10,
              font: {
                family: 'Calibri'
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  updateCalendar() {
    this.currentMonthName = this.currentDate.toLocaleString('fr', { month: 'long' });
    this.currentYear = this.currentDate.getFullYear();

    const firstDay = new Date(this.currentYear, this.currentDate.getMonth(), 1);
    const startDate = new Date(firstDay);
    const dayOfWeek = firstDay.getDay();
    startDate.setDate(firstDay.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    this.calendarDays = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isOtherMonth = date.getMonth() !== this.currentDate.getMonth();
      const isToday = date.toDateString() === today.toDateString();
      const hasEvent = this.getEventsForDate(date).length > 0;

      this.calendarDays.push({
        date: date,
        isOtherMonth: isOtherMonth,
        isToday: isToday,
        hasEvent: hasEvent,
        events: this.getEventsForDate(date)
      });
    }
  }

  getEventsForDate(date: Date): any[] {
    const events = [];
    if (date.getDate() === 15 && date.getMonth() === 11) {
      events.push({ title: 'Réunion RH', type: 'meeting' });
    }
    if (date.getDate() === 18 && date.getMonth() === 11) {
      events.push({ title: 'Formation', type: 'training' });
    }
    if (date.getDate() === 25 && date.getMonth() === 11) {
      events.push({ title: 'Fermeture', type: 'holiday' });
    }
    return events;
  }

  selectDay(day: any) {
    console.log('Jour sélectionné:', day.date);
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateCalendar();
  }

  refreshData() {
    this.loadDashboardData();
    if (this.isBrowser) {
      this.initCharts();
    }
  }

  approveLeave(request: any) {
    console.log('Demande approuvée:', request);
  }

  rejectLeave(request: any) {
    console.log('Demande refusée:', request);
  }

  viewAllLeaveRequests() {
    console.log('Voir toutes les demandes');
  }

  loadPerformance() {
    this.loadTopPerformers();
  }

  getStars(score: number): number[] {
    return Array(Math.floor(score / 20)).fill(0);
  }
}
