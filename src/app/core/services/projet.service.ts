import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Employes } from "../interfaces/agents";
import { Projets } from "../interfaces/projet.interface";
import { EnvironmentProduction } from "../../../environment/environment.production";

@Injectable({
    providedIn: 'root'
})
export class ProjetsService {
    // apiUrl = "http://localhost:3000/projets";
    apiUrl = EnvironmentProduction.apiUrlExtern + '/projets';


    constructor(private http: HttpClient) { }

    //Get all projects//
    getProjets(): Observable<Projets[]> {
        return this.http.get<Projets[]>(this.apiUrl);
    }

    //add new project//
    addProjet(projet: Projets): Observable<Projets> {
        return this.http.post<Projets>(this.apiUrl, projet);
    }

    //get project by id//
    getProjetById(id: string): Observable<Projets> {
        return this.http.get<Projets>(`${this.apiUrl}/${id}`);
    }

    //update project//
    updateProjet(id: string, projet: Projets): Observable<Projets> {
        return this.http.put<Projets>(`${this.apiUrl}/${id}`, projet);
    }

    //delete project//
    deleteProjet(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}