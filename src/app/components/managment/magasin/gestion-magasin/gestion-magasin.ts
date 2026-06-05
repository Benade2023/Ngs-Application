import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Categorie, Fournisseur, LocationMateriel, Materiel, MouvementStock } from '../../../../core/interfaces/materiel.interface';
import { Router } from '@angular/router';
import { MouvementStockService } from '../../../../core/services/gestionStock.service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-gestion-magasin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gestion-magasin.html',
  styleUrl: './gestion-magasin.css',
})
export class GestionMagasin implements OnInit {

  // Données
  materiaux: Materiel[] = [];
  allMateriaux: Materiel[] = [];
  mouvements: MouvementStock[] = [];
  locations: LocationMateriel[] = [];
  categories: Categorie[] = [];
  fournisseurs: Fournisseur[] = [];

  // Filtres
  searchTerm = '';
  selectedCategorie = '';
  selectedType = '';
  selectedStatut = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  currentUserConnect: any;


  // Onglet actif
  activeTab: 'stock' | 'mouvements' | 'locations' = 'stock';

  // Modals
  showMaterielModal = false;
  showMouvementModal = false;
  showLocationModal = false;
  selectedMateriel: Materiel | null = null;

  showFicheModal = false;
  selectedLocation: LocationMateriel | null = null;

  // Formulaire matériel
  materielForm: Partial<Materiel> = {};

  // Formulaire mouvement
  mouvementForm: Partial<MouvementStock> = {};

  // Formulaire location
  locationForm: Partial<LocationMateriel> = {};

  isEditMode = false;
  isLoading = false;
  isBrowser: boolean;

  // Statistiques
  stats = {
    totalMateriaux: 0,
    totalConsommable: 0,
    totalMaterielTravail: 0,
    alertesStock: 0,
    locationsEncours: 0,
    mouvementsJour: 0
  };
dateActuelle = Date.now();


  @ViewChild('printSection') printSection!: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private mouvementStockService: MouvementStockService,
    private alert: AlertService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadData();

     this.currentUserConnect = JSON.parse(
      localStorage.getItem('user_ngs') || '{}'
    );
  }
  openFicheModal(location: LocationMateriel): void {
    this.selectedLocation = location;
    this.showFicheModal = true;
  }

  closeFicheModal(): void {
    this.showFicheModal = false;
    this.selectedLocation = null;
  }

  // printFiche(): void {
  //   const content = this.printSection?.nativeElement?.innerHTML;
  //   if (!content) {
  //     return;
  //   }

  //   const printWindow = window.open('', '_blank', 'width=900,height=700');
  //   if (!printWindow) {
  //     return;
  //   }

  //   printWindow.document.open();
  //   printWindow.document.write(`
  //   <html>
  //     <head>
  //       <title>Fiche de location</title>
  //       <style>
  //         body {
  //           font-family: Arial, sans-serif;
  //           padding: 20px;
  //           color: #000;
  //         }
  //         .fiche-print {
  //           max-width: 800px;
  //           margin: 0 auto;
  //           border: 1px solid #000;
  //           padding: 20px;
  //         }
  //         .fiche-header {
  //           text-align: center;
  //           border-bottom: 2px solid #000;
  //           margin-bottom: 20px;
  //           padding-bottom: 10px;
  //         }
  //         .fiche-section {
  //           margin-bottom: 15px;
  //         }
  //         .fiche-section p {
  //           margin: 6px 0;
  //         }
  //       </style>
  //     </head>
  //     <body>
  //       <div class="fiche-print">
  //         ${content}
  //       </div>
  //     </body>
  //   </html>
  // `);
  //   printWindow.document.close();

  //   printWindow.onload = () => {
  //     printWindow.focus();
  //     printWindow.print();
  //     printWindow.close();
  //   };
  // }


  printFiche() {
  const printContent = document.querySelector('.fiche-print')?.innerHTML;
  const printWindow = window.open('', '_blank', 'width=900,height=650');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fiche de location - ${this.selectedLocation?.id}</title>
          <style>
            ${this.getPrintStyles()}
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }
}

private getPrintStyles(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 20px; }
    .fiche-header { margin-bottom: 20px; border-bottom: 2px solid #1a472a;  }
    .header-logo { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; justify-content: center; }
    .logo-placeholder { width: 60px; height: 60px; background: #1a472a; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .logo-icon { font-size: 2rem; }
    .company-info h2 { color: #1a472a; margin-bottom: 5px; }
    .company-info p { font-size: 0.7rem; margin: 2px 0; }
    .document-title { text-align: center; margin: 15px 0; }
    .document-title h1 { color: #1a472a; font-size: 1.3rem; margin-top: 80px; }
    .fiche-section { margin-bottom: 20px; }
    .fiche-section h4 { background: #f0f0f0; padding: 5px 10px; margin-bottom: 10px; border-left: 3px solid #1a472a; }
    .info-table { width: 100%; border-collapse: collapse; }
    .info-table td { padding: 5px; border-bottom: 1px solid #eee; }
    .info-table .label { width: 140px; font-weight: bold; }
    .signature-section { display: flex; justify-content: space-between; margin-top: 30px; }
    .signature-box { flex: 1; text-align: center; }
    .signature-line { height: 50px; border-bottom: 1px solid #000; margin-top: 5px; }
    .fiche-footer { margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 0.65rem; text-align: center; }
    .footer-text p { margin: 2px 0; }
    .footer-date { margin-top: 10px; }
  `;
}

  loadData() {
    // chargement des catégories//
    this.mouvementStockService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.markForCheck();
        this.calculateStats();
        this.applyFilters();
      }
    })

    // Chargement des fournisseurs//
    this.mouvementStockService.getFournisseurs().subscribe({
      next: (data) => {
        this.fournisseurs = data;
        this.cdr.markForCheck();
        this.calculateStats();
        this.applyFilters();
      }
    })
    // Chargement des matériels//
    this.mouvementStockService.getAllMateriels().subscribe({
      next: (data) => {
        this.allMateriaux = data;
        this.materiaux = [...data];

        this.cdr.markForCheck();
        this.calculateStats();
        this.applyFilters();
      }
    })
    // Chargement des mouvement //
    this.mouvementStockService.getMouvementStocks().subscribe({
      next: (data) => {
        this.mouvements = data;
        this.cdr.markForCheck();
        this.calculateStats();
        this.applyFilters();
      }
    })

    // Chargement des location //
    this.mouvementStockService.getLocations().subscribe({
      next: (data) => {
        this.locations = data;
        this.cdr.markForCheck();
        this.calculateStats();
        this.applyFilters();

      }
    })



  }





  closeModalOnOutside(event: any) {
    // this.showMaterielModal = false;
    // this.showMouvementModal = false;
    // this.showLocationModal = false;
  }

  calculateStats() {
    this.stats.totalMateriaux = this.materiaux.length;
    this.stats.totalConsommable = this.materiaux.filter(m => m.type === 'consommable').length;
    this.stats.totalMaterielTravail = this.materiaux.filter(m => m.type === 'materiel_travail' || m.type === 'equipement').length;
    this.stats.alertesStock = this.materiaux.filter(m => m.quantiteStock <= m.quantiteMinimale).length;
    this.stats.locationsEncours = this.locations.filter(l => l.statut === 'en_cours').length;
    this.stats.mouvementsJour = this.mouvements.filter(m => {
      const today = new Date();
      return m.date.toDateString() === today.toDateString();
    }).length;
  }

  getStockAlertClass(quantite: number, seuil: number): string {
    if (quantite <= 0) return 'critique';
    if (quantite <= seuil) return 'alerte';
    return 'normal';
  }

  getStatutLabel(statut?: string): string {

    switch (statut) {

      case 'en_cours':
        return 'En cours';

      case 'termine':
        return 'Terminé';

      case 'en_retard':
        return 'En retard';

      case 'en_attente_approbation':
        return 'En Attente';

      default:
        return 'En attente';
    }
  }

  getStatutClass(statut: string): string {
    const classes: any = {
      'en_cours': 'status-encours',
      'termine': 'status-termine',
      'retard': 'status-retard',
      'en_attente_approbation': 'status-encours'
    };
    return classes[statut] || '';
  }

  getMouvementTypeClass(type: string): string {
    const classes: any = {
      'entree': 'type-entree',
      'sortie': 'type-sortie',
      'retour': 'type-retour',
      'en_attente_approbation': 'status-encours'
    };
    return classes[type] || '';
  }


  // Méthode applyFilters corrigée
  applyFilters() {
    // Vérifier que allMateriaux existe
    if (!this.allMateriaux || this.allMateriaux.length === 0) {
      this.materiaux = [];
      this.totalPages = 0;
      return;
    }

    let filtered = [...this.allMateriaux];

    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(m => {
        // Vérifier que m existe
        if (!m) return false;

        // Vérifier chaque champ avec une valeur par défaut
        const nom = m.nom || '';
        const code = m.code || '';
        const categorie = m.categorieNom || '';

        return nom.toLowerCase().includes(term) ||
          code.toLowerCase().includes(term) ||
          categorie.toLowerCase().includes(term);
      });
    }

    if (this.selectedCategorie) {
      filtered = filtered.filter(m => m && m.categorieId === this.selectedCategorie);
    }

    if (this.selectedType) {
      filtered = filtered.filter(m => m && m.type === this.selectedType);
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);

    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.materiaux = filtered.slice(start, start + this.itemsPerPage);
  }

  // Méthodes de pagination simplifiées
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

  // // Reset des filtres
  resetFilters() {
    this.searchTerm = '';
    this.selectedCategorie = '';
    this.selectedType = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  // resetFilters() {
  //   this.searchTerm = '';
  //   this.selectedCategorie = '';
  //   this.selectedType = '';
  //   this.currentPage = 1;
  //   this.loadData();
  // }

  getMaterielById(id: string): Materiel | undefined {
    return this.materiaux.find(m => m.id === id);
  }

  ouvrirMouvement(type: 'entree' | 'sortie', materiel?: Materiel) {
    this.mouvementForm = {
      type: type,
      materielId: materiel?.id,
      materielCode: materiel?.code,
      materielNom: materiel?.nom,
      quantite: 1,
      date: new Date(),
      utilisateur: 'Admin'
    };
    this.showMouvementModal = true;
  }

  ouvrirLocation(materiel?: Materiel) {
    this.locationForm = {
      materielId: materiel?.id,
      materielCode: materiel?.code,
      materielNom: materiel?.nom,
      quantite: 1,
      dateDebut: new Date(),
      dateFinPrevue: new Date(new Date().setDate(new Date().getDate() + 7)),
      statut: 'en_attente_approbation',
      emprunteur: '',
      emprunteurContact: '',
      motif: '',
      responsable: ''
    };
    this.showLocationModal = true;
  }

  ouvrirMateriel(materiel?: Materiel) {
    if (materiel) {
      this.isEditMode = true;
      this.materielForm = { ...materiel };
    } else {
      this.isEditMode = false;
      this.materielForm = {
        code: this.genererCodeMateriel(),
        nom: '',
        description: '',
        categorieId: '',
        type: 'materiel_travail',
        unite: 'pièce',
        quantiteStock: 0,
        quantiteMinimale: 0,
        emplacement: '',
        fournisseurId: '',
        prixUnitaire: 0,
        dateAjout: new Date(),
        actif: true
      };
    }
    this.showMaterielModal = true;
  }

  genererCodeMateriel(): string {
    const prefix = 'MAT';
    const numero = String(this.materiaux.length + 1).padStart(4, '0');
    return `${prefix}-${numero}`;
  }

  saveMateriel() {
    if (!this.materielForm.nom || !this.materielForm.code) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    // if (this.isEditMode) {
    //   const index = this.materiaux.findIndex(m => m.id === this.materielForm.id);
    //   if (index !== -1) {
    //     this.materiaux[index] = { ...this.materielForm as Materiel };
    //   }
    // } 
    if (this.isEditMode) {
      this.isLoading = true;

      const materielUpdate = { ...this.materielForm as Materiel };

      this.mouvementStockService.updateMateriel(materielUpdate.id, materielUpdate).subscribe({
        next: (updatedMateriel) => {
          const index = this.materiaux.findIndex(m => m.id === updatedMateriel.id);
          if (index !== -1) {
            this.materiaux[index] = updatedMateriel;
          }
          this.isLoading = false;
          this.alert.success('Matériel modifié avec succès');
          this.closeModal();
          // setTimeout(() => this.messageSuccess = '', 3000);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.isLoading = false;
          this.alert.error('Erreur lors de la modification du matériel');
          // setTimeout(() => this.messageError = '', 3000);
        }
      });
    }


    else {
      const newMateriel = {
        ...this.materielForm,
        id: `MAT-${Date.now()}`,
        dateAjout: new Date()
      } as Materiel;
      // this.materiaux.push(newMateriel);
      this.mouvementStockService.addMateriel(newMateriel).subscribe({
        next: (data) => {
          this.alert.success("Materiel ajouter avec success, 'success'");
          console.log("Materiel ajouter");
          this.calculateStats();
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.alert.error("Erreur lors de l'ajout du materiel");
          console.error("erreur d'ajout");

        }
      })
    }


  }
  saveMouvement() {
    if (!this.mouvementForm.materielId || !this.mouvementForm.quantite) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const materiel = this.getMaterielById(this.mouvementForm.materielId);
    if (!materiel) {
      alert('Matériel non trouvé');
      return;
    }

    // Vérification du stock pour les sorties
    if (this.mouvementForm.type === 'sortie') {
      if (materiel.quantiteStock < (this.mouvementForm.quantite || 0)) {
        alert('Stock insuffisant !');
        return;
      }
    }

    // Mettre à jour le stock du matériel
    let stockUpdateObservable;
    if (this.mouvementForm.type === 'sortie') {
      materiel.quantiteStock -= (this.mouvementForm.quantite || 0);
      materiel.dateDerniereSortie = new Date();
    } else {
      materiel.quantiteStock += (this.mouvementForm.quantite || 0);
      materiel.dateDerniereEntree = new Date();
    }

    // Sauvegarder d'abord la mise à jour du stock
    this.mouvementStockService.updateMateriel(materiel.id, materiel).subscribe({
      next: () => {
        // Après mise à jour du stock, ajouter le mouvement
        const newMouvement = {
          ...this.mouvementForm,
          id: `MOV-${Date.now()}`,
          date: new Date()
        } as MouvementStock;

        this.mouvementStockService.addMouvementStock(newMouvement).subscribe({
          next: (data) => {
            this.mouvements.unshift(newMouvement);
            this.alert.success("Mouvement ajouté avec succès");
            console.log("Mouvement et stock mis à jour");
            this.calculateStats();
            this.closeModal();
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.alert.error("Erreur lors de l'ajout du mouvement");
            console.error("erreur d'ajout", err);
            // Optionnel: restaurer le stock si l'ajout du mouvement échoue
          }
        });
      },
      error: (err) => {
        this.alert.error("Erreur lors de la mise à jour du stock");
        console.error("erreur de mise à jour du stock", err);
      }
    });
  }


  saveLocation() {
    if (!this.locationForm.materielId || !this.locationForm.emprunteur || !this.locationForm.dateFinPrevue) {
      this.alert.toast('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const materiel = this.getMaterielById(this.locationForm.materielId);
    if (!materiel) {
      this.alert.error('Matériel non trouvé');
      return;
    }

    const quantiteLocation = this.locationForm.quantite || 1;

    // Vérification du stock
    if (materiel.quantiteStock < quantiteLocation) {
      this.alert.error(`Stock insuffisant ! Stock disponible: ${materiel.quantiteStock}`);
      return;
    }

    // Sauvegarder l'état original du stock pour restauration possible
    const stockOriginal = materiel.quantiteStock;

    // Mettre à jour le stock du matériel
    materiel.quantiteStock -= quantiteLocation;
    materiel.dateDerniereSortie = new Date();

    // Sauvegarder d'abord la mise à jour du stock
    this.mouvementStockService.updateMateriel(materiel.id, materiel).subscribe({
      next: () => {
        // Après mise à jour du stock, ajouter la location
        const newLocation = {
          ...this.locationForm,
          id: `LOC-${Date.now()}`,
          dateDebut: new Date(),
          statut: 'en_attente_approbation'
        } as LocationMateriel;

        this.mouvementStockService.addLocation(newLocation).subscribe({
          next: (data) => {
            this.locations.unshift(newLocation);
            this.alert.success("Location ajoutée avec succès");
            console.log("Location et stock mis à jour");
            this.calculateStats();
            this.closeModalOnOutside('');
            this.cdr.markForCheck();
          },
          error: (err) => {
            // Restaurer le stock en cas d'échec
            materiel.quantiteStock = stockOriginal;
            this.mouvementStockService.updateMateriel(materiel.id, materiel).subscribe({
              next: () => {
                this.alert.error("Erreur lors de l'ajout de la location. Stock restauré.");
              },
              error: () => {
                this.alert.error("Erreur critique : Stock non restauré. Vérifiez manuellement.");
              }
            });
            console.error("Erreur d'ajout de la location", err);
          }
        });
      },
      error: (err) => {
        // Restaurer le stock localement car la mise à jour a échoué
        materiel.quantiteStock = stockOriginal;
        this.alert.error("Erreur lors de la mise à jour du stock");
        console.error("Erreur de mise à jour du stock", err);
      }
    });
  }


  approuverLocation(location: LocationMateriel) {
    if (!confirm(`Approuver la location du matériel "${location.materielNom}" ?`)) {
      return;
    }

    const locationMiseAJour: LocationMateriel = {
      ...location,
      statut: 'en_cours'
    };

    this.mouvementStockService.updateLocation(location.id, locationMiseAJour).subscribe({
      next: () => {
        location.statut = 'en_cours';
        this.alert.success('Location approuvée avec succès');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.alert.error('Erreur lors de l’approbation de la location');
        console.error(err);
      }
    });
  }




  retourLocation(location: LocationMateriel) {
    if (confirm(`Confirmer le retour du matériel "${location.materielNom}" ?`)) {
      const materiel = this.getMaterielById(location.materielId);
      if (!materiel) {
        this.alert.error('Matériel non trouvé');
        return;
      }

      // Sauvegarder l'état original pour restauration possible
      const stockOriginal = materiel.quantiteStock;

      // Mettre à jour le stock localement
      materiel.quantiteStock += location.quantite;
      materiel.dateDerniereEntree = new Date();

      // Sauvegarder d'abord la mise à jour du stock
      this.mouvementStockService.updateMateriel(materiel.id, materiel).subscribe({
        next: () => {
          // Après mise à jour du stock, mettre à jour la location
          location.statut = 'termine';
          location.dateFinReelle = new Date();
          this.cdr.markForCheck();

          // Mettre à jour la location dans la base de données
          this.mouvementStockService.updateLocation(location.id, location).subscribe({
            next: () => {
              // Ajouter un mouvement de retour
              const newMouvement = {
                id: `MOV-${Date.now()}`,
                materielId: location.materielId,
                materielCode: location.materielCode,
                materielNom: location.materielNom,
                type: 'retour',
                quantite: location.quantite,
                date: new Date(),
                motif: `Retour de location - ${location.motif}`,
                destination: 'Magasin',
                utilisateur: location.responsable
              } as MouvementStock;
              this.cdr.markForCheck();


              this.mouvementStockService.addMouvementStock(newMouvement).subscribe({
                next: () => {
                  this.mouvements.unshift(newMouvement);
                  this.alert.success("Retour de location effectué avec succès");
                  console.log("Retour de location et stock mis à jour");
                  this.calculateStats();
                  this.cdr.markForCheck();
                },
                error: (err) => {
                  this.alert.error("Erreur lors de l'ajout du mouvement de retour");
                  console.error("Erreur d'ajout du mouvement", err);
                  // Restaurer le stock si l'ajout du mouvement échoue
                  materiel.quantiteStock = stockOriginal;
                  this.mouvementStockService.updateMateriel(materiel.id, materiel).subscribe();
                }
              });
            },
            error: (err) => {
              this.alert.error("Erreur lors de la mise à jour de la location");
              console.error("Erreur de mise à jour de la location", err);
              // Restaurer le stock si la mise à jour de la location échoue
              materiel.quantiteStock = stockOriginal;
              this.mouvementStockService.updateMateriel(materiel.id, materiel).subscribe();
            }
          });
        },
        error: (err) => {
          this.alert.error("Erreur lors de la mise à jour du stock");
          console.error("Erreur de mise à jour du stock", err);
        }
      });
    }
  }

  // retourLocation(location: LocationMateriel) {
  //   if (confirm(`Confirmer le retour du matériel "${location.materielNom}" ?`)) {
  //     const materiel = this.getMaterielById(location.materielId);
  //     if (materiel) {
  //       materiel.quantiteStock += location.quantite;
  //     }

  //     location.statut = 'termine';
  //     location.dateFinReelle = new Date();

  //     // Ajouter un mouvement de retour
  //     this.mouvements.unshift({
  //       id: `MOV-${Date.now()}`,
  //       materielId: location.materielId,
  //       materielCode: location.materielCode,
  //       materielNom: location.materielNom,
  //       type: 'retour',
  //       quantite: location.quantite,
  //       date: new Date(),
  //       motif: `Retour de location - ${location.motif}`,
  //       destination: 'Magasin',
  //       utilisateur: location.responsable
  //     });

  //     this.calculateStats();
  //     this.cdr.detectChanges();
  //   }
  // }

  deleteMateriel(id: string) {
    if (confirm('Supprimer ce matériel ?')) {
      this.materiaux = this.materiaux.filter(m => m.id !== id);
      this.calculateStats();
      this.cdr.detectChanges();
    }
  }

  closeModal() {
    this.showMaterielModal = false;
    this.showMouvementModal = false;
    this.showLocationModal = false;
    this.materielForm = {};
    this.mouvementForm = {};
    this.locationForm = {};
  }

  getTypeLabel(type: string): string {
    const labels: any = {
      'consommable': 'Consommable',
      'materiel_travail': 'Matériel de travail',
      'equipement': 'Équipement',
      'outillage': 'Outillage'
    };
    return labels[type] || type;
  }


}
