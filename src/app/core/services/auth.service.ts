import { Injectable } from "@angular/core";
import { EnvironmentProduction } from "../../../environment/environment.production";
import { HttpClient } from "@angular/common/http";
import { EmployeService } from "./employe.service";
import { map, Observable } from "rxjs";
import { Employes } from "../interfaces/agents";
import { Login } from "../../components/auth/login/login";
import { LoginRequest } from "../interfaces/login";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    apiUrl: string = EnvironmentProduction.apiUrlExtern + '/login';
    /**
     *
     */
    constructor(
        private http: HttpClient,
        private agentService: EmployeService
    ) {       
        
    }

    //Login//
    login(authData: LoginRequest): Observable<LoginRequest> {
        return this.http.post<LoginRequest>(this.apiUrl, authData);
    } 

    logout(): void {
        // Nettoyer tous les éléments du localStorage
        localStorage.removeItem('user_ngs');
    }
}