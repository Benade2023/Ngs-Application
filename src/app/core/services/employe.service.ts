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

    //update induction//
    // employe.service.ts
    updateInduction(employeId: string, inductionData: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${employeId}`, {
            induction: {
                dateEmission: inductionData.dateEmission,
                dateExpiration: inductionData.dateExpiration,
                document: inductionData.document
            }
        });
    }
    //update habilitation//
    // employe.service.ts
    updateHabilitation(employeId: string, habilitationData: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${employeId}`, {
            habilitation: {
                type: habilitationData.type,
                dateObtention: habilitationData.dateObtention,
                dateExpiration: habilitationData.dateExpiration,
                document: habilitationData.document
            }
        });
    }
    //update certificat//
    // employe.service.ts
    updateCertificat(employeId: string, certificatData: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${employeId}`, {
            certificatMedical: {
                dateEmission: certificatData.dateEmission,
                dateExpiration: certificatData.dateExpiration,
                document: certificatData.document,
                medecin: certificatData.medecin
            }
        });
    }
    //update carte marine//
    // employe.service.ts
    updateCarteMarine(employeId: string, carteMarineData: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${employeId}`, {
            carteMarine: {
                dateDelivrance: carteMarineData.dateDelivrance,
                numero: carteMarineData.numero,
                dateExpiration: carteMarineData.dateExpiration,
                document: carteMarineData.document
            }
        });
    }
 

    // Dans employe.service.ts
    changePassword(id: string, passwordData: { currentPassword: string; newPassword: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/change-password`, passwordData);
    }

    //delete employe//
    deleteEmploye(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}