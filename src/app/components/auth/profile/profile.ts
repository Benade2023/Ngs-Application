import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employes } from '../../../core/interfaces/agents';
import { Router } from '@angular/router';
import { EmployeService } from '../../../core/services/employe.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  user: Employes = {} as Employes;
  profileForm: FormGroup;
  passwordForm: FormGroup;

  activeTab: 'profil' | 'securite' | 'preferences' | 'activite' = 'profil';

  isLoading = false;
  isBrowser: boolean;
  showPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  messageSuccess = '';
  messageError = '';
  currentUser: any;

  // Upload avatar
  selectedFile: File | null = null;
  avatarPreview: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private router: Router,
    private employeService: EmployeService,
    private alert: AlertService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern('^[0-9]{9,12}$')]],
      poste: [''],
      service: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user_ngs') || '{}');
    this.loadUserData();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  loadUserData() {
    this.employeService.getEmployeById(this.currentUser.matricule).subscribe({
      next: (data) => {
        this.user = data;
        // Remplir le formulaire
        this.profileForm.patchValue({
          nom: this.user.nom,
          prenom: this.user.prenom,
          email: this.user.email,
          telephone: this.user.telephone,
          poste: this.user.fonction,
          service: this.user.service
        });
      }
    })

  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadAvatar() {
    if (this.selectedFile) {
      // Simuler l'upload
      setTimeout(() => {
        this.user.avatar = this.avatarPreview || '';
        this.messageSuccess = 'Photo de profil mise à jour';
        setTimeout(() => this.messageSuccess = '', 3000);
      }, 500);
    }
  }

  // saveProfile() {
  //   if (this.profileForm.invalid) {
  //     this.profileForm.markAllAsTouched();
  //     return;
  //   }

  //   this.isLoading = true;

  //   // Simuler la sauvegarde
  //   setTimeout(() => {
  //     this.user = {
  //       ...this.user,
  //       nom: this.profileForm.value.nom,
  //       prenom: this.profileForm.value.prenom,
  //       email: this.profileForm.value.email,
  //       telephone: this.profileForm.value.telephone,
  //       fonction: this.profileForm.value.poste,
  //       service: this.profileForm.value.service
  //     };

  //     this.isLoading = false;
  //     this.messageSuccess = 'Profil mis à jour avec succès';
  //     setTimeout(() => this.messageSuccess = '', 3000);
  //   }, 1000);
  // }
  saveProfile() {
  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  this.messageError = '';

  const userId = this.user.id;

  // Vérification des champs obligatoires
  const requiredFields = ['nom', 'prenom', 'email'];
  const missingFields = requiredFields.filter(field => !this.profileForm.value[field]);

  if (missingFields.length > 0) {
    this.isLoading = false;
    this.alert.error(`Les champs suivants sont requis: ${missingFields.join(', ')}`);
    // setTimeout(() => this.messageError = '', 3000);
    return;
  }

  // Créer l'objet employé mis à jour
  const updatedEmployee = {
    ...this.user,
    nom: this.profileForm.value.nom,
    prenom: this.profileForm.value.prenom,
    email: this.profileForm.value.email,
    telephone: this.profileForm.value.telephone || '',
    fonction: this.profileForm.value.poste || '',
    service: this.profileForm.value.service || ''
  };

  this.employeService.updateEmploye(userId, updatedEmployee).subscribe({
    next: (response) => {
      this.user = response;
      this.isLoading = false;
      this.alert.success('Profil mis à jour avec succès');
      
      // Mettre à jour le formulaire avec les nouvelles valeurs
      this.profileForm.patchValue({
        nom: response.nom,
        prenom: response.prenom,
        email: response.email,
        telephone: response.telephone,
        poste: response.fonction,
        service: response.service
      });
      
      // setTimeout(() => this.messageSuccess = '', 3000);
    },
    error: (error) => {
      this.isLoading = false;
      
      // Gestion des différents codes d'erreur
      if (error.status === 400) {
        this.alert.error('Données invalides. Vérifiez les champs saisis.');
      } else if (error.status === 404) {
        this.alert.error('Utilisateur non trouvé.');
      } else if (error.status === 409) {
        this.alert.error('Cet email est déjà utilisé par un autre utilisateur.');
      } else {
        this.alert.error('Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer.');
      }
      
      // setTimeout(() => this.messageError = '', 3000);
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  });
}

  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.messageError = '';

    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const userId = this.user.id;

    // Vérification locale du mot de passe actuel (optionnel)
    // À remplacer par une vraie vérification backend
    if (currentPassword !== this.user.password) { // Simulation
      this.isLoading = false;
      this.alert.error("Mot de passe actuel incorrect");
      // setTimeout(() => this.messageError = '', 3000);
      return;
    }

    // Créer une copie de l'utilisateur avec le nouveau mot de passe
    const updatedUser = {
      ...this.user,
      motDePasse: newPassword
    };

    this.employeService.updateEmploye(userId, updatedUser).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.alert.success('Mot de passe modifié avec succès');
        this.passwordForm.reset();
        // setTimeout(() => this.messageSuccess = '', 3000);
      },
      error: (error) => {
        this.isLoading = false;
        this.alert.error('Une erreur est survenue. Veuillez réessayer.');
        // setTimeout(() => this.messageError = '', 3000);
      }
    });
  }

  updatePreferences() {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.messageSuccess = 'Préférences mises à jour';
      setTimeout(() => this.messageSuccess = '', 3000);
    }, 500);
  }

  toggleDeuxFacteurs() {
    this.user.deuxFacteurs = !this.user.deuxFacteurs;
    this.messageSuccess = this.user.deuxFacteurs ? 'Authentification à deux facteurs activée' : 'Authentification à deux facteurs désactivée';
    setTimeout(() => this.messageSuccess = '', 3000);
  }

  logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
      this.router.navigate(['/connexion']);
    }
  }

  getStatutClass(statut: boolean): string {
    return statut ? 'actif' : 'inactif';
  }

  getDateFormatLabel(format: string): string {
    const labels: any = {
      'DD/MM/YYYY': 'JJ/MM/AAAA',
      'MM/DD/YYYY': 'MM/JJ/AAAA',
      'YYYY-MM-DD': 'AAAA-MM-JJ'
    };
    return labels[format] || format;
  }

}
