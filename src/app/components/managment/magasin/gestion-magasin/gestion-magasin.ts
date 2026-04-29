import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Categorie, Fournisseur, LocationMateriel, Materiel, MouvementStock } from '../../../../core/interfaces/materiel.interface';
import { Router } from '@angular/router';
import { MouvementStockService } from '../../../../core/services/gestionStock.service';

@Component({
  selector: 'app-gestion-magasin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gestion-magasin.html',
  styleUrl: './gestion-magasin.css',
})
export class GestionMagasin implements OnInit {

  // Données
  materiaux: Materiel[] = [];
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

  // Onglet actif
  activeTab: 'stock' | 'mouvements' | 'locations' = 'stock';

  // Modals
  showMaterielModal = false;
  showMouvementModal = false;
  showLocationModal = false;
  selectedMateriel: Materiel | null = null;

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private mouvementStockService: MouvementStockService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.loadData();
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
        this.materiaux = data;
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

  getStatutClass(statut: string): string {
    const classes: any = {
      'en_cours': 'status-encours',
      'termine': 'status-termine',
      'retard': 'status-retard'
    };
    return classes[statut] || '';
  }

  getMouvementTypeClass(type: string): string {
    const classes: any = {
      'entree': 'type-entree',
      'sortie': 'type-sortie',
      'retour': 'type-retour'
    };
    return classes[type] || '';
  }

  applyFilters() {
    let filtered = [...this.materiaux];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.nom.toLowerCase().includes(term) ||
        m.code.toLowerCase().includes(term) ||
        m.categorieNom.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategorie) {
      filtered = filtered.filter(m => m.categorieId === this.selectedCategorie);
    }

    if (this.selectedType) {
      filtered = filtered.filter(m => m.type === this.selectedType);
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.materiaux = filtered.slice(start, start + this.itemsPerPage);
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategorie = '';
    this.selectedType = '';
    this.currentPage = 1;
    this.loadData();
  }

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
      statut: 'en_cours',
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

    if (this.isEditMode) {
      const index = this.materiaux.findIndex(m => m.id === this.materielForm.id);
      if (index !== -1) {
        this.materiaux[index] = { ...this.materielForm as Materiel };
      }
    } else {
      const newMateriel = {
        ...this.materielForm,
        id: `MAT-${Date.now()}`,
        dateAjout: new Date()
      } as Materiel;
      this.materiaux.push(newMateriel);
    }

    this.calculateStats();
    this.closeModal();
    this.cdr.detectChanges();
  }

  saveMouvement() {
    if (!this.mouvementForm.materielId || !this.mouvementForm.quantite) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const materiel = this.getMaterielById(this.mouvementForm.materielId);
    if (materiel) {
      if (this.mouvementForm.type === 'sortie') {
        if (materiel.quantiteStock < (this.mouvementForm.quantite || 0)) {
          alert('Stock insuffisant !');
          return;
        }
        materiel.quantiteStock -= (this.mouvementForm.quantite || 0);
        materiel.dateDerniereSortie = new Date();
      } else {
        materiel.quantiteStock += (this.mouvementForm.quantite || 0);
        materiel.dateDerniereEntree = new Date();
      }
    }

    const newMouvement = {
      ...this.mouvementForm,
      id: `MOV-${Date.now()}`,
      date: new Date()
    } as MouvementStock;

    this.mouvements.unshift(newMouvement);
    this.calculateStats();
    this.closeModal();
    this.cdr.detectChanges();
  }

  saveLocation() {
    if (!this.locationForm.materielId || !this.locationForm.emprunteur || !this.locationForm.dateFinPrevue) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const materiel = this.getMaterielById(this.locationForm.materielId);
    if (materiel && materiel.quantiteStock < (this.locationForm.quantite || 1)) {
      alert('Stock insuffisant pour la location !');
      return;
    }

    if (materiel) {
      materiel.quantiteStock -= (this.locationForm.quantite || 1);
    }

    const newLocation = {
      ...this.locationForm,
      id: `LOC-${Date.now()}`,
      dateDebut: new Date(),
      statut: 'en_cours'
    } as LocationMateriel;

    this.locations.unshift(newLocation);
    this.calculateStats();
    this.closeModal();
    this.cdr.detectChanges();
  }

  retourLocation(location: LocationMateriel) {
    if (confirm(`Confirmer le retour du matériel "${location.materielNom}" ?`)) {
      const materiel = this.getMaterielById(location.materielId);
      if (materiel) {
        materiel.quantiteStock += location.quantite;
      }

      location.statut = 'termine';
      location.dateFinReelle = new Date();

      // Ajouter un mouvement de retour
      this.mouvements.unshift({
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
      });

      this.calculateStats();
      this.cdr.detectChanges();
    }
  }

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
