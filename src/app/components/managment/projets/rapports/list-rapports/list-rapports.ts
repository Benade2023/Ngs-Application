import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Rapport } from '../../../../../core/interfaces/rapport.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { RapportService } from '../../../../../core/services/rapport.service';
import { AlertService } from '../../../../../core/services/alert.service';
import { ProjetsService } from '../../../../../core/services/projet.service';
import { Projets } from '../../../../../core/interfaces/projet.interface';

@Component({
  selector: 'app-list-rapports',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './list-rapports.html',
  styleUrl: './list-rapports.css',
})
export class ListRapports implements OnInit {
  rapports: Rapport[] = [];
  filteredRapports: Rapport[] = [];
  projets: Projets[] = [];

  searchTerm = '';
  selectedProjet = '';
  selectedDate = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  isBrowser: boolean;
  currentProjetId: string = '';

  showDetailModal = false;
  selectedRapport: Rapport | null = null;

  stats = {
    total: 0,
    totalPax: 0,
    travauxEnCours: 0,
    travauxTermines: 0
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private rapportService: RapportService,
    private cdr: ChangeDetectorRef,
    private alert: AlertService,
    private projetService: ProjetsService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    const id = this.route.snapshot.params['projetId'];
    this.currentProjetId = id;
    if (id) {
      this.loadData(id);
      this.loadProjets(id);
    }

  }

  loadData(id: string) {
    this.rapportService.getRapports().subscribe({
      next: (response: Rapport[]) => {
        let result = response.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.rapports = result.filter(r => r.projetId === id);
        console.log(this.rapports);

        this.calculateStats();
        this.applyFilters();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rapports:', error);
      }
    });
  }

  loadProjets(id: string) {
    this.projetService.getProjets().subscribe({
      next: (response: Projets[]) => {
        this.projets = response.filter(p => p.id === id);
      },
      error: (error) => {
        console.error('Erreur chargement projets:', error);
      }
    });
  }

  addRapport() {
    this.router.navigate(['/add-rapport', this.currentProjetId]);
  }

  calculateStats() {
    this.stats.total = this.rapports.length;
    this.stats.totalPax = this.rapports.reduce((sum, r) => sum + (r.equipe.totalPax || 0), 0);
    this.stats.travauxEnCours = this.rapports.filter(r =>
      r.travaux.some(t => t.avancement < 100)
    ).length;
    this.stats.travauxTermines = this.rapports.filter(r =>
      r.travaux.every(t => t.avancement === 100)
    ).length;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  }

  getAvancementClass(avancement: number): string {
    if (avancement === 100) return 'complet';
    if (avancement >= 75) return 'tres-avance';
    if (avancement >= 50) return 'mi-parcours';
    if (avancement >= 25) return 'commence';
    return 'debut';
  }

  applyFilters() {
    let filtered = [...this.rapports];

    if (this.selectedProjet) {
      filtered = filtered.filter(r => r.projet === this.selectedProjet);
    }

    if (this.selectedDate) {
      const dateFilter = new Date(this.selectedDate);
      filtered = filtered.filter(r => {
        const rapportDate = new Date(r.date);
        return rapportDate.toDateString() === dateFilter.toDateString();
      });
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.projet.toLowerCase().includes(term) ||
        r.superviseurClient.toLowerCase().includes(term) ||
        r.chefEquipe.toLowerCase().includes(term) ||
        r.travaux.some(t => t.tache.toLowerCase().includes(term))
      );
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredRapports = filtered.slice(start, start + this.itemsPerPage);
  }

  resetFilters() {
    this.selectedProjet = '';
    this.selectedDate = '';
    this.searchTerm = '';
    this.currentPage = 1;
    this.applyFilters();
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

  openDetailModal(rapport: Rapport) {
    this.selectedRapport = rapport;
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedRapport = null;
  }

  closeModalOnOutside(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeDetailModal();
    }
  }

  viewRapportDetails(rapport: Rapport) {
    this.router.navigate(['/rapport-detail', rapport.id]);
  }

  getMoyenneAvancement(rapport: Rapport): number {
    if (!rapport.travaux.length) return 0;
    const sum = rapport.travaux.reduce((acc, t) => acc + t.avancement, 0);
    return Math.round(sum / rapport.travaux.length);
  }

  // printRapport(rapport: Rapport) {
  //   const printWindow = window.open('', '_blank', 'width=900,height=650,scrollbars=yes');
  //   if (!printWindow) return;
  //   const getMonthName = (month: number): string => {
  //     const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  //     return months[month];
  //   };

  //   const formatDate = (date: Date | string): string => {
  //     const d = new Date(date);
  //     return `${d.getDate().toString().padStart(2, '0')} ${getMonthName(d.getMonth())} ${d.getFullYear()}`;
  //   };



  //   const getAvancementText = (avancement: number): string => {
  //     if (avancement === 100) return 'Terminé';
  //     if (avancement >= 75) return 'Très avancé';
  //     if (avancement >= 50) return 'En cours';
  //     if (avancement >= 25) return 'Débuté';
  //     return 'Planifié';
  //   };

  //   const formatExecuteurs = (executeurs: string[]): string => {
  //     return executeurs.join(', ');
  //   };

  //   const htmlContent = `
  //   <!DOCTYPE html>
  //   <html>
  //   <head>
  //     <meta charset="UTF-8">
  //     <title>RAPPORT JOURNALIER - ${rapport.projet} - ${formatDate(rapport.date)}</title>
  //     <style>
  //       @page {
  //         size: A4;
  //         margin: 1.5cm;
  //       }
  //       body {
  //         font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
  //         margin: 0;
  //         padding: 0;
  //         color: #333;
  //         font-size: 12pt;
  //         line-height: 1.4;
  //       }
  //       .container {
  //         max-width: 100%;
  //         margin: 0 auto;
  //       }
  //       h1 {
  //         font-size: 18pt;
  //         text-align: center;
  //         margin: 0;
  //         padding: 10px 0;
  //         text-transform: uppercase;
  //       }
  //       .header-title {
  //         text-align: center;
  //         border-bottom: 2px solid #333;
  //         margin-bottom: 20px;
  //       }
  //       .subtitle {
  //         text-align: center;
  //         font-size: 14pt;
  //         margin: 5px 0;
  //       }
  //       .info-table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         margin: 15px 0;
  //         font-size: 11pt;
  //       }
  //       .info-table td, .info-table th {
  //         border: 1px solid #000;
  //         padding: 8px;
  //         vertical-align: top;
  //       }
  //       .info-table th {
  //         background-color: #f0f0f0;
  //         font-weight: bold;
  //         text-align: center;
  //       }
  //       .section-title {
  //         font-size: 14pt;
  //         font-weight: bold;
  //         margin: 20px 0 10px 0;
  //         padding-left: 5px;
  //         border-left: 4px solid #2c3e50;
  //       }
  //       .security-text {
  //         text-align: justify;
  //         margin: 10px 0;
  //         line-height: 1.5;
  //       }
  //       .travaux-table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         margin: 10px 0;
  //       }
  //       .travaux-table th, .travaux-table td {
  //         border: 1px solid #000;
  //         padding: 8px;
  //         text-align: left;
  //         vertical-align: top;
  //       }
  //       .travaux-table th {
  //         background-color: #f0f0f0;
  //         font-weight: bold;
  //       }
  //       .photo-gallery {
  //         margin: 20px 0;
  //       }
  //       .photo-item {
  //         margin: 15px 0;
  //         text-align: center;
  //         page-break-inside: avoid;
  //       }
  //       .photo-item img {
  //         max-width: 100%;
  //         height: auto;
  //         border: 1px solid #ccc;
  //       }
  //       .photo-caption {
  //         font-style: italic;
  //         margin-top: 5px;
  //         font-size: 10pt;
  //       }
  //       .logistique-table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         margin: 10px 0;
  //       }
  //       .logistique-table td {
  //         border: 1px solid #000;
  //         padding: 8px;
  //         vertical-align: top;
  //       }
  //       .logistique-table td:first-child {
  //         width: 30%;
  //         font-weight: bold;
  //         background-color: #f9f9f9;
  //       }
  //       .validation-table {
  //         width: 100%;
  //         border-collapse: collapse;
  //         margin: 20px 0;
  //       }
  //       .validation-table td {
  //         border: 1px solid #000;
  //         padding: 8px;
  //       }
  //       .validation-table td:first-child {
  //         width: 30%;
  //         font-weight: bold;
  //         background-color: #f9f9f9;
  //       }
  //       .footer {
  //         margin-top: 30px;
  //         text-align: center;
  //         font-size: 9pt;
  //         border-top: 1px solid #ccc;
  //         padding-top: 10px;
  //       }
  //       .page-break {
  //         page-break-before: always;
  //       }
  //       .signature-line {
  //         margin-top: 10px;
  //         font-family: monospace;
  //       }
  //       .badge-status {
  //         display: inline-block;
  //         padding: 2px 8px;
  //         border-radius: 4px;
  //         font-size: 10pt;
  //         font-weight: bold;
  //       }
  //       .status-termine {
  //         background-color: #27ae60;
  //         color: white;
  //       }
  //       .status-encours {
  //         background-color: #f39c12;
  //         color: white;
  //       }
  //       .center {
  //         text-align: center;
  //       }
  //       .text-right {
  //         text-align: right;
  //       }
  //       .bold {
  //         font-weight: bold;
  //       }
  //     </style>
  //   </head>
  //   <body>
  //     <div class="container">
  //       <!-- En-tête -->
  //       <div class="header-title">
  //         <h1>RAPPORT JOURNALIER</h1>
  //         <div class="subtitle"><strong>Projet:</strong> ${rapport.projet}</div>
  //         <div class="subtitle"><strong>Date du :</strong> ${formatDate(rapport.date)}</div>
  //       </div>

  //       <!-- Informations équipe -->
  //       <table class="info-table">
  //         <tr>
  //           <th>Superviseur client (FOLOLO)</th>
  //           <td colspan="2">${rapport.superviseurClient}</td>
  //         </tr>
  //         <tr>
  //           <th>Chef d'équipe (C/E)</th>
  //           <td colspan="2">${rapport.chefEquipe}</td>
  //         </tr>
  //         <tr>
  //           <th rowspan="2">Electricien / Instrum</th>
  //           <td colspan="2">${rapport.equipe.pax.filter(p => p.fonction === 'Electricien / Instrum').map(p => p.nom).join('<br>') || '-'}</td>
  //         </tr>
  //         <tr>
  //           <td colspan="2"></td>
  //         </tr>
  //         <tr>
  //           <th>Aide électricien</th>
  //           <td colspan="2">${rapport.equipe.pax.filter(p => p.fonction === 'Aide électricien').map(p => p.nom).join(', ') || '-'}</td>
  //         </tr>
  //         <tr>
  //           <th>Effectif (POB)</th>
  //           <td colspan="2">${rapport.equipe.totalPax}</td>
  //         </tr>
  //         <tr>
  //           <th>Post-card chasse aux risques</th>
  //           <td colspan="2">0</td>
  //         </tr>
  //       </table>

  //       <!-- Rappel Sécurité -->
  //       <div class="section-title">2. Rappel Sécurité</div>
  //       <div class="security-text">
  //         ${rapport.securite.remarques || 'Les règles de sécurité ont été respectées durant l\'ensemble des interventions.'}
  //       </div>

  //       <!-- Travaux Réalisés -->
  //       <div class="section-title">3. Travaux Réalisés à date</div>
  //       <table class="travaux-table">
  //         <thead>
  //           <tr>
  //             <th>Tâche effectuées</th>
  //             <th>Exécutant</th>
  //             <th>Statut</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           ${rapport.travaux.map(travail => `
  //             <tr>
  //               <td>${travail.tache}</td>
  //               <td>${formatExecuteurs(travail.executeurs)}</td>
  //               <td>${travail.avancement}% - ${getAvancementText(travail.avancement)}</td>
  //             </tr>
  //           `).join('')}
  //         </tbody>
  //       </table>

  //       <!-- Galerie Photo -->
  //       ${rapport.photos && rapport.photos.length > 0 ? `
  //         <div class="section-title">6. Galerie Photo</div>
  //         <div class="photo-gallery">
  //           ${rapport.photos.map(photo => `
  //             <div class="photo-item">
  //               <div class="photo-caption"><center>${photo.titre}</center></div>
  //             </div>
  //           `).join('')}
  //         </div>
  //       ` : ''}

  //       <!-- Logistique & Mobilisation -->
  //       <div class="section-title">7. Logistique & Mobilisation</div>
  //       <table class="logistique-table">
  //         <tr>
  //           <td>Mobilisation</td>
  //           <td>${rapport.logistique.mobilisation || 'pendant toute la période'}</td>
  //         </tr>
  //         <tr>
  //           <td>Démobilisation</td>
  //           <td>${rapport.logistique.demobilisation || '-'}</td>
  //         </tr>
  //         <tr>
  //           <td>Mobilisation</td>
  //           <td>${rapport.logistique.personnel.join('<br>') || '-'}</td>
  //         </tr>
  //         <tr>
  //           <td>Mouvements de matériel</td>
  //           <td>${rapport.logistique.materiel.join(', ') || '-'}</td>
  //         </tr>
  //       </table>

  //       <!-- Validation -->
  //       <div class="section-title">8. Validation</div>
  //       <table class="validation-table">
  //         <tr>
  //           <td>Nom</td>
  //           <td>${rapport.validation.nom}</td>
  //         </tr>
  //         <tr>
  //           <td>Fonction</td>
  //           <td>${rapport.validation.fonction}</td>
  //         </tr>
  //         <tr>
  //           <td>Signature</td>
  //           <td class="signature-line">${rapport.validation.signe ? '✓' : '_________________'}</td>
  //         </tr>
  //       </table>

  //       <div class="footer">
  //         Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
  //       </div>
  //     </div>
  //   </body>
  //   </html>
  // `;

  //   printWindow.document.write(htmlContent);
  //   printWindow.document.close();
  //   printWindow.focus();
  //   printWindow.print();
  //   printWindow.onafterprint = () => {
  //     printWindow.close();
  //   };
  // }

  printRapport(rapport: Rapport) {

    const printWindow = window.open('', '_blank', 'width=1200,height=900');

    if (!printWindow) return;

    const getMonthName = (month: number): string => {
      const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
      return months[month];
    };

    const formatDate = (date: Date | string): string => {
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, '0')} ${getMonthName(d.getMonth())} ${d.getFullYear()}`;
    };

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Rapport Journalier</title>

<style>

@page {
    size: A4;
    margin: 140px 25px 90px 25px;
}

body{
    font-family: Arial, sans-serif;
    font-size: 12px;
    color:#000;
}

header{
    position: fixed;
    top:-120px;
    left:0;
    right:0;
    height:110px;
}

footer{
    position: fixed;
    bottom:-70px;
    left:0;
    right:0;
    height:60px;
    font-size:10px;
    text-align:center;
    color:green;
}

table{
    width:100%;
    border-collapse: collapse;
}

th, td{
    border:1px solid #000;
    padding:6px;
}

th{
    background:#4F81BD;
    color:white;
}

.section-title{
    font-size:18px;
    font-weight:bold;
    color:#4F81BD;
    margin-top:20px;
    margin-bottom:10px;
}

.center{
    text-align:center;
}

.page-break{
    page-break-before:always;
}

</style>
</head>

<body>

<header>

<table style="border:none;">
<tr style="border:none;">
<td style="border:none;width:20%;">
<img src="assets/images/logo-ngs.png" width="120">
</td>

<td style="border:none;width:80%; text-align:center;">
<div style="font-size:28px;font-weight:bold;">NGOULOU-SERVICES</div>
<div style="font-size:18px;">
Electricité HTA - BT. Automatisme / Instrumentation
</div>
<div style="font-size:18px;">
Et Fibre Optique
</div>
</td>
</tr>
</table>

<hr>

</header>


<footer>

Ce document est la propriété de NGOULOU SERVICES. Il ne peut être reproduit ni transmis à des tiers sans autorisation écrite de la SOCIETE.<br>

Société NGS - Siège Quartier Kurou, Port-Gentil - Gabon N°STATISQUE : 039999 A RG/POG 2015B 1710<br>

Tel : 07540432 – 02 93 49 93 | Site Internet : ngservices.info | Email : projets@ngservices.info

</footer>


<main>

<div class="center" style="margin-bottom:25px;">
<h2 style="color:#4F81BD;">RAPPORT JOURNALIER</h2>
<h3>Projet : ${rapport.projet}</h3>
<h3>Date du : ${formatDate(rapport.date)}</h3>
</div>


<table>
<tr>
<th>Superviseur client</th>
<td>${rapport.superviseurClient}</td>
</tr>

<tr>
<th>Chef d'équipe</th>
<td>${rapport.chefEquipe}</td>
</tr>

<tr>
<th>Effectif (POB)</th>
<td>${rapport.equipe.totalPax}</td>
</tr>
</table>


<div class="section-title">2. Rappel Sécurité</div>

<p>
${rapport.securite.remarques || 'Les règles de sécurité ont été respectées durant l’ensemble des interventions.'}
</p>


<div class="section-title">3. Travaux Réalisés</div>

<table>
<tr>
<th>Tâches effectuées</th>
<th>Exécutants</th>
<th>Statut</th>
</tr>

${rapport.travaux.map(t => `
<tr>
<td>${t.tache}</td>
<td>${t.executeurs.join(', ')}</td>
<td class="center">${t.avancement}%</td>
</tr>
`).join('')}

</table>


<div class="section-title">7. Logistique & Mobilisation</div>

<table>
<tr>
<th>Mobilisation</th>
<td>${rapport.logistique.mobilisation || '-'}</td>
</tr>

<tr>
<th>Démobilisation</th>
<td>${rapport.logistique.demobilisation || '-'}</td>
</tr>

<tr>
<th>Personnel</th>
<td>${rapport.logistique.personnel.join(', ')}</td>
</tr>

<tr>
<th>Matériel</th>
<td>${rapport.logistique.materiel.join(', ')}</td>
</tr>

</table>


<div class="section-title">8. Validation</div>

<table>
<tr>
<th>Nom</th>
<td>${rapport.validation.nom}</td>
</tr>

<tr>
<th>Fonction</th>
<td>${rapport.validation.fonction}</td>
</tr>

<tr>
<th>Signature</th>
<td>${rapport.validation.signe ? '✓ Validé' : '__________________'}</td>
</tr>
</table>

</main>

</body>
</html>
`;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
