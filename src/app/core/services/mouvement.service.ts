import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MouvementPersonnel } from "../interfaces/mobDemob.interface";

@Injectable({
    providedIn: 'root'
})
export class MouvementService {
    apiUrl = "http://localhost:3000/mouvements";

    constructor(private http: HttpClient) {}

    //Get all MouvementPersonneles
    getMouvementPersonnel(): Observable<MouvementPersonnel[]> {
        return this.http.get<MouvementPersonnel[]>(this.apiUrl);
    }

    //add new MouvementPersonnele//
    addMouvementPersonnel(MouvementPersonnele: MouvementPersonnel): Observable<MouvementPersonnel> {
        return this.http.post<MouvementPersonnel>(this.apiUrl, MouvementPersonnele);
    }

    //get MouvementPersonnele by id//
  getMouvementPersonnelById(id: string): Observable<MouvementPersonnel>{
    return this.http.get<MouvementPersonnel>(`${this.apiUrl}/${id}`);
  }

  //update MouvementPersonnele//
    updateMouvementPersonnel(id: string, MouvementPersonnele: MouvementPersonnel): Observable<MouvementPersonnel> {  
        return this.http.put<MouvementPersonnel>(`${this.apiUrl}/${id}`, MouvementPersonnele);
    }

    //delete MouvementPersonnel//
    deleteMouvementPersonnel(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

}