import { Component } from '@angular/core';
import { Header } from "../../../layout/header/header";
import { Footer } from "../../../layout/footer/footer";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginData = {
    email: '',
    password: ''
  };
  
  rememberMe = false;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  /**
   *
   */
  constructor(private router: Router) {
    
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Simuler une requête API
    setTimeout(() => {
      // Exemple de vérification
      if (this.loginData.email === 'benadelessaya@ngservices.info' && 
          this.loginData.password === 'NgService@1011') {
        console.log('Connexion réussie', this.loginData);
        // Rediriger vers la page d'accueil
         this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect';
        alert(this.errorMessage);
      }
      this.isLoading = false;
    }, 1500);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  
}
