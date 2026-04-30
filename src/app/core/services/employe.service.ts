import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Employes } from "../interfaces/agents";
import { EnvironmentProduction } from "../../../environment/environment.production";

@Injectable({
    providedIn: 'root'
})
export class EmployeService {
    // apiUrl = "http://localhost:3000/agents";
    apiUrl = EnvironmentProduction.apiUrlExtern + '/agents';

    constructor(private http: HttpClient) { }

    //Get all employees
    getEmployes(): Observable<Employes[]> {
        return this.http.get<Employes[]>(this.apiUrl);
    }

    //add new employee//
    addEmploye(employee: Employes): Observable<Employes> {
        return this.http.post<Employes>(this.apiUrl, employee);
    }

    //get employee by id//
    getEmployeById(id: string): Observable<Employes> {
        return this.http.get<Employes>(`${this.apiUrl}/${id}`);
    }

    //update employee//
    updateEmploye(id: string, employee: Employes): Observable<Employes> {
        return this.http.put<Employes>(`${this.apiUrl}/${id}`, employee);
    }

    //delete employe//
    deleteEmploye(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}