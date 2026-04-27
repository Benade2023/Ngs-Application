import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Pax, Rapport } from '../../../../../core/interfaces/rapport.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { RapportService } from '../../../../../core/services/rapport.service';
import { ProjetsService } from '../../../../../core/services/projet.service';
import { AlertService } from '../../../../../core/services/alert.service';
import { EmployeService } from '../../../../../core/services/employe.service';
import { Employes } from '../../../../../core/interfaces/agents';

@Component({
  selector: 'app-new-rapport',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-rapport.html',
  styleUrl: './new-rapport.css',
})
export class NewRapport implements OnInit {

  rapport: Rapport = this.getEmptyRapport();
  isEditMode = false;
  isLoading = false;
  isBrowser: boolean;
  
  projetId: string = '';
  projetNom: string = '';
  listPersonel: Employes[] = [];
  
  availablePersonnel: Pax[] = [];
  currentProjetId: string = '';
  
  // Pour l'ajout dynamique de personnel
  newPax: Pax = { nom: '', fonction: '' };
  showAddPaxForm = false;
  
  // Pour l'ajout dynamique de travaux
  newTravail = { tache: '', executeurs: [] as string[], avancement: 0 };
  showAddTravailForm = false;
  
  // Pour l'ajout dynamique de photos
  newPhoto = { titre: '', url: '' };
  showAddPhotoForm = false;
  
  // Options
  fonctionsOptions = [
    'Electricien / Instrum',
    'Aide électricien',
    'Chef d\'équipe',
    'Electricien HT',
    'Monteur de lignes',
    'Superviseur',
    'Technicien',
    'Manœuvre'
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private rapportService: RapportService,
    private cdr: ChangeDetectorRef,
    private projetsService: ProjetsService,
    private employeService: EmployeService,
    private alert: AlertService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Récupérer le projet depuis les paramètres de la route
    this.route.params.subscribe(params => {
      this.projetId = params['projetId'];
      this.projetNom = params['projetNom'];
      this.currentProjetId = this.projetId;
      
      if (this.projetNom) {
        this.rapport.projet = decodeURIComponent(this.projetNom);
      } else if (this.projetId) {
        this.loadProjetById(this.projetId);
      }
    });
    
    this.loadPersonnel();
    
    const id = this.route.snapshot.params['projetId'];
    if (id) {
      // this.isEditMode = true;
      this.loadRapport(id);
    }
  }

  getEmptyRapport(): Rapport {
    return {
      id: '',
      projet: '',
      projetId: this.currentProjetId,
      date: new Date(),
      superviseurClient: '',
      chefEquipe: '',
      equipe: {
        pax: [],
        totalPax: 0
      },
      securite: {
        reglesRespectees: true,
        remarques: ''
      },
      travaux: [],
      photos: [],
      logistique: {
        mobilisation: '',
        demobilisation: '',
        personnel: [],
        materiel: []
      },
      validation: {
        nom: '',
        fonction: '',
        signe: false
      }
    };
  }

  loadProjetById(id: string) {
    this.projetsService.getProjetById(id).subscribe({
      next: (projet) => {
        this.projetNom = projet.nom;
        this.rapport.projet = projet.nom;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur chargement projet:', error);
      }
    });
  }

  loadPersonnel() {
    this.employeService.getEmployes().subscribe({
      next: (response) => {
        this.availablePersonnel = response;
        this.listPersonel = response;
        console.log(response);
        
      },
      error: (error) => {
        console.error('Erreur chargement personnel:', error);
      }
    });
  }

  loadRapport(id: string) {
    this.rapportService.getRapportById(id).subscribe({
      next: (response) => {
        this.rapport = response;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Erreur chargement rapport:', error);
      }
    });
  }

  // Gestion de l'équipe
  addPax() {
    if (this.newPax.nom && this.newPax.fonction) {
      this.rapport.equipe.pax.push({ ...this.newPax });
      this.rapport.equipe.totalPax = this.rapport.equipe.pax.length;
      this.newPax = { nom: '', fonction: '' };
      this.showAddPaxForm = false;
    }
  }

  removePax(index: number) {
    this.rapport.equipe.pax.splice(index, 1);
    this.rapport.equipe.totalPax = this.rapport.equipe.pax.length;
  }

  // Gestion des executeurs pour nouveau travail
  addExecuteur(exec: string) {
    if (exec && !this.newTravail.executeurs.includes(exec)) {
      this.newTravail.executeurs.push(exec);
    }
  }

  removeExecuteurByIndex(index: number) {
    this.newTravail.executeurs.splice(index, 1);
  }

  // Gestion des travaux
  addTravail() {
    if (this.newTravail.tache && this.newTravail.executeurs.length > 0) {
      this.rapport.travaux.push({ 
        tache: this.newTravail.tache, 
        executeurs: [...this.newTravail.executeurs], 
        avancement: this.newTravail.avancement 
      });
      this.newTravail = { tache: '', executeurs: [], avancement: 0 };
      this.showAddTravailForm = false;
    } else {
      alert('Veuillez renseigner une tâche et au moins un exécutant');
    }
  }

  removeTravail(index: number) {
    this.rapport.travaux.splice(index, 1);
  }

  updateTravailAvancement(index: number, avancement: number) {
    this.rapport.travaux[index].avancement = avancement;
  }

  // Gestion des photos
  addPhoto() {
    if (this.newPhoto.titre) {
      this.rapport.photos.push({ ...this.newPhoto });
      this.newPhoto = { titre: '', url: '' };
      this.showAddPhotoForm = false;
    }
  }

  removePhoto(index: number) {
    this.rapport.photos.splice(index, 1);
  }

  onFileSelected(event: any, index?: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (index !== undefined) {
          this.rapport.photos[index].url = e.target.result;
        } else {
          this.newPhoto.url = e.target.result;
        }
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  // Gestion de la logistique
  addPersonnelLogistique(personnel: string) {
    if (personnel && !this.rapport.logistique.personnel.includes(personnel)) {
      this.rapport.logistique.personnel.push(personnel);
    }
  }

  removePersonnelLogistique(index: number) {
    this.rapport.logistique.personnel.splice(index, 1);
  }

  addMateriel(materiel: string) {
    if (materiel && !this.rapport.logistique.materiel.includes(materiel)) {
      this.rapport.logistique.materiel.push(materiel);
    }
  }

  removeMateriel(index: number) {
    this.rapport.logistique.materiel.splice(index, 1);
  }

  // Validation du formulaire
  isFormValid(): boolean {
    return !!(this.rapport.projet &&
              this.rapport.superviseurClient &&
              this.rapport.chefEquipe &&
              this.rapport.equipe.pax.length > 0 &&
              this.rapport.travaux.length > 0);
  }

  // Sauvegarde
  saveRapport() {
    if (!this.isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isLoading = true;

    if (this.isEditMode) {
      this.rapportService.updateRapport(this.rapport.id, this.rapport).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Rapport modifié avec succès !');
          this.router.navigate(['/rapports', this.projetId]);
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.isLoading = false;
        }
      });
    } else {
      this.rapportService.addRapport(this.rapport).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Rapport créé avec succès !');
          this.router.navigate(['/rapports', this.projetId]);
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.isLoading = false;
        }
      });
    }
  }

  // Dans votre composant, ajoutez cette méthode
getExecuteurClass(executeur: string): string {
  // Chercher la fonction de l'exécutant
  const pax = this.rapport.equipe.pax.find(p => p.nom === executeur);
  if (!pax) return '';
  
  if (pax.fonction.includes('Electricien')) return 'electricien';
  if (pax.fonction.includes('Aide')) return 'aide';
  if (pax.fonction.includes('Chef')) return 'chef';
  return '';
}

  cancel() {
    this.router.navigate(['/rapports', this.projetId]);
  }
}
