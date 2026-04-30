import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Rapport } from "../interfaces/rapport.interface";
import { Observable } from "rxjs";
import { EnvironmentProduction } from "../../../environment/environment.production";

@Injectable({
    providedIn: 'root'
})
export class RapportService {
    // apiUrl = "http://localhost:3000/rapports";
    apiUrl = EnvironmentProduction.apiUrlExtern + '/rapports';


    constructor(private http: HttpClient) { }

    //Get all employees
    getRapports(): Observable<Rapport[]> {
        return this.http.get<Rapport[]>(this.apiUrl);
    }

    //add new employee//
    addRapport(rapport: Rapport): Observable<Rapport> {
        return this.http.post<Rapport>(this.apiUrl, rapport);
    }

    //get employee by id//
    getRapportById(id: string): Observable<Rapport> {
        return this.http.get<Rapport>(`${this.apiUrl}/${id}`);
    }

    //update employee//
    updateRapport(id: string, rapport: Rapport): Observable<Rapport> {
        return this.http.put<Rapport>(`${this.apiUrl}/${id}`, rapport);
    }

    //delete employe//
    deleteRapport(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}