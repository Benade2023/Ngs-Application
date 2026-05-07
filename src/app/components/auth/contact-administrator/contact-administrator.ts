import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-administrator',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact-administrator.html',
  styleUrl: './contact-administrator.css',
})
export class ContactAdministrator {
 contactForm: FormGroup;
  isLoading = false;
  isBrowser: boolean;
  isSuccess = false;
  
  // Informations de l'administrateur
  adminInfo = {
    nom: 'Administrateur',
    email: 'admin@entreprise.com',
    telephone: '+241 01 23 45 67',
    horaires: 'Lundi - Vendredi: 08h00 - 17h00'
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    this.contactForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.pattern('^[0-9]{9,12}$')]],
      sujet: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      urgent: [false]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Simuler l'envoi du message
    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
      
      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        this.contactForm.reset();
        this.isSuccess = false;
        this.router.navigate(['/login']);
      }, 3000);
    }, 1500);
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
