import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Rotation } from "../interfaces/mobDemob.interface";
import { EnvironmentProduction } from "../../../environment/environment.production";

@Injectable({
    providedIn: 'root'
})
export class RotationService {
    // apiUrl = "http://localhost:3000/rotations";
    apiUrl = EnvironmentProduction.apiUrlExtern + '/rotations';


    constructor(private http: HttpClient) { }

    //Get all Rotationes
    getRotation(): Observable<Rotation[]> {
        return this.http.get<Rotation[]>(this.apiUrl);
    }

    //add new Rotatione//
    addRotation(Rotatione: Rotation): Observable<Rotation> {
        return this.http.post<Rotation>(this.apiUrl, Rotatione);
    }

    //get Rotatione by id//
    getRotationByEmployeId(employeId: string): Observable<Rotation> {
        return this.http.get<Rotation>(`${this.apiUrl}/${employeId}`);
    }

    //update Rotatione//
    updateRotation(id: string, Rotatione: Rotation): Observable<Rotation> {
        return this.http.put<Rotation>(`${this.apiUrl}/${id}`, Rotatione);
    }

    //delete Rotation//
    deleteRotation(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}