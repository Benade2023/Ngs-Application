import { Component } from '@angular/core';
import { Header } from "../../../layout/header/header";
import { Footer } from "../../../layout/footer/footer";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/interfaces/login';
import { EmployeService } from '../../../core/services/employe.service';
import { Employes } from '../../../core/interfaces/agents';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginData = {
    email: '',
    password: ''
  };
  currentAgent: Employes | undefined;

  rememberMe = false;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  /**
   *
   */
  constructor(
    private router: Router,
    private authService: AuthService,
    private agentService: EmployeService,
    private alert: AlertService
  ) {

  }

  onSubmit() {
    this.isLoading = true;
    let emailUser = this.loginData.email;
    let passwordUser = this.loginData.password;
    const authData: LoginRequest = {
      email: emailUser,
      password: passwordUser,
      date: new Date().toISOString().split('T')[0]
    }
    this.authService.login(authData).subscribe({
      next: (data) => {

        this.agentService.getEmployes().subscribe({
          next: response => {
            this.currentAgent = response.find(x => x.email === data.email && x.password === data.password)
            if (this.currentAgent != undefined) {
              localStorage.setItem('user_ngs', JSON.stringify({
                nom: this.currentAgent.nom,
                prenom: this.currentAgent.prenom,
                email: this.currentAgent.email,
                fonction: this.currentAgent.fonction
              }));
              this.router.navigate(['/dashboard'])
            } else {
              this.alert.error('Email ou mot de passe incorrect !')
            }
          }
        })
      },
      error: (err) => {
        this.alert.error("Email ou mot de passe incorrect !");
        this.isLoading = false;
      }
    })
  }

 

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
