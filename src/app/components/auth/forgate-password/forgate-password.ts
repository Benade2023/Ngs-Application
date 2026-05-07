import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgate-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgate-password.html',
  styleUrl: './forgate-password.css',
})
export class ForgatePassword {
  emailForm: FormGroup;
  resetForm: FormGroup;
  step: 'email' | 'code' | 'password' = 'email';
  isLoading = false;
  isBrowser: boolean;
  
  // Données temporaires
  tempEmail = '';
  tempCode = '';
  countdown = 60;
  countdownInterval: any;
  showResend = false;
  
  // Messages
  errorMessage = '';
  successMessage = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    
    this.resetForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmitEmail() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.tempEmail = this.emailForm.get('email')?.value;

    // Simuler l'envoi du code
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Un code de réinitialisation a été envoyé à votre adresse email.';
      this.step = 'code';
      this.startCountdown();
      
      // Générer un code temporaire (dans une vraie application, ce code vient du backend)
      this.tempCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Code de réinitialisation:', this.tempCode);
      
      // Simuler l'envoi d'email
      alert(`Code de vérification: ${this.tempCode}\n\nDans une vraie application, ce code vous serait envoyé par email.`);
    }, 1500);
  }

  startCountdown() {
    this.countdown = 60;
    this.showResend = false;
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);
        this.showResend = true;
      }
    }, 1000);
  }

  resendCode() {
    this.startCountdown();
    this.showResend = false;
    
    // Régénérer un nouveau code
    this.tempCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Nouveau code:', this.tempCode);
    alert(`Nouveau code: ${this.tempCode}`);
  }

  verifyCode() {
    const enteredCode = this.resetForm.get('code')?.value;
    
    if (!enteredCode || enteredCode.length !== 6) {
      this.errorMessage = 'Veuillez entrer un code valide à 6 chiffres.';
      return;
    }
    
    if (enteredCode !== this.tempCode) {
      this.errorMessage = 'Code invalide. Veuillez réessayer.';
      return;
    }
    
    this.errorMessage = '';
    this.step = 'password';
  }

  onSubmitPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simuler la réinitialisation du mot de passe
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Votre mot de passe a été réinitialisé avec succès !';
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        this.router.navigate(['/connexion']);
      }, 2000);
    }, 1500);
  }

  goBack() {
    if (this.step === 'email') {
      this.router.navigate(['/login']);
    } else if (this.step === 'code') {
      this.step = 'email';
      this.errorMessage = '';
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
    } else if (this.step === 'password') {
      this.step = 'code';
      this.resetForm.patchValue({ newPassword: '', confirmPassword: '' });
    }
  }
  

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

}
