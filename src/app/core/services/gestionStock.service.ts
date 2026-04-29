import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Categorie, Fournisseur, LocationMateriel, Materiel, MouvementStock } from "../interfaces/materiel.interface";

@Injectable({
    providedIn: 'root'
})
export class MouvementStockService {
    apiUrlCategorie = "http://localhost:3000/categories";
    apiUrlFournisseur = "http://localhost:3000/fournisseurs";
    apiUrlMouvement = "http://localhost:3000/mouvementsMateriel";
    apiUrlLocation = "http://localhost:3000/locations";
    apiUrlMateriel = "http://localhost:3000/materiels";


    constructor(private http: HttpClient) {}

    //Get all MouvementStockes
    getMouvementStocks(): Observable<MouvementStock[]> {
        return this.http.get<MouvementStock[]>(this.apiUrlMouvement);
    }
    //Add new stock movement//
    addMouvementStock(mouvementStock: MouvementStock): Observable<MouvementStock> {
        return this.http.post<MouvementStock>(this.apiUrlMouvement, mouvementStock);
    }
    //get stock movement by id//
    getMouvementStockById(id: string): Observable<MouvementStock>{
        return this.http.get<MouvementStock>(`${this.apiUrlMouvement}/${id}`);
    }
    //update stock movement//
    updateMouvementStock(id: string, mouvementStock: MouvementStock): Observable<MouvementStock> {  
        return this.http.put<MouvementStock>(`${this.apiUrlMouvement}/${id}`, mouvementStock);
    }
    //delete stock movement//
    deleteMouvementStock(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrlMouvement}/${id}`);
    }

    //get all categories//
    getCategories(): Observable<Categorie[]> {
        return this.http.get<Categorie[]>(this.apiUrlCategorie);
    }

    //add new category//
    addCategory(categorie: Categorie): Observable<Categorie> {
        return this.http.post<Categorie>(this.apiUrlCategorie, categorie);
    }

    //get category by id//
  getCategoryById(id: string): Observable<Categorie>{
    return this.http.get<Categorie>(`${this.apiUrlCategorie}/${id}`);
  }

  //update Category//
    updateCategory(id: string, categorie: Categorie): Observable<Categorie> {  
        return this.http.put<Categorie>(`${this.apiUrlCategorie}/${id}`, categorie);
    }

    //delete Category//
    deleteCategory(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrlCategorie}/${id}`);
    }

    //get all fournisseurs//
    getFournisseurs(): Observable<Fournisseur[]> {
        return this.http.get<Fournisseur[]>(this.apiUrlFournisseur);
    }
    //add new fournisseur//
    addFournisseur(fournisseur: Fournisseur): Observable<Fournisseur> {
        return this.http.post<Fournisseur>(this.apiUrlFournisseur, fournisseur);
    }
    //get fournisseur by id//
    getFournisseurById(id: string): Observable<Fournisseur>{
        return this.http.get<Fournisseur>(`${this.apiUrlFournisseur}/${id}`);
    }
    //update fournisseur//
    updateFournisseur(id: string, fournisseur: Fournisseur): Observable<Fournisseur> {  
        return this.http.put<Fournisseur>(`${this.apiUrlFournisseur}/${id}`, fournisseur);
    }
    //delete fournisseur//
    deleteFournisseur(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrlFournisseur}/${id}`);
    }

    //get all locations//
    getLocations(): Observable<LocationMateriel[]> {
        return this.http.get<LocationMateriel[]>(this.apiUrlLocation);
    }
    //add new location//
    addLocation(location: LocationMateriel): Observable<LocationMateriel> {
        return this.http.post<LocationMateriel>(this.apiUrlLocation, location);
    }
    //get location by id//
    getLocationById(id: string): Observable<LocationMateriel>{
        return this.http.get<LocationMateriel>(`${this.apiUrlLocation}/${id}`);
    }
    //update location//
    updateLocation(id: string, location: LocationMateriel): Observable<LocationMateriel> {  
        return this.http.put<LocationMateriel>(`${this.apiUrlLocation}/${id}`, location);
    }
    //delete location//
    deleteLocation(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrlLocation}/${id}`);
    }
    // get all matereiels by category id//
    getMaterielsByCategoryId(categoryId: string): Observable<Materiel[]> {
        return this.http.get<Materiel[]>(`${this.apiUrlMateriel}?categorieId=${categoryId}`);
    }
    // get all matereiels by fournisseur id//
    getMaterielsByFournisseurId(fournisseurId: string): Observable<Materiel[]> {
        return this.http.get<Materiel[]>(`${this.apiUrlMateriel}?fournisseurId=${fournisseurId}`);
    }
    // get all matereiels by location id//
    getMaterielsByLocationId(locationId: string): Observable<Materiel[]> {
        return this.http.get<Materiel[]>(`${this.apiUrlMateriel}?locationId=${locationId}`);
    }
    // get all matereiels by mouvement type//
    getMaterielsByMouvementType(type: string): Observable<Materiel[]> {
        return this.http.get<Materiel[]>(`${this.apiUrlMateriel}?type=${type}`);
    }
    // get all matereiels by mouvement date//
    getMaterielsByMouvementDate(date: string): Observable<Materiel[]> {
        return this.http.get<Materiel[]>(`${this.apiUrlMateriel}?date=${date}`);
    }
    // get all matereiels by mouvement motif//
    getMaterielsByMouvementMotif(motif: string): Observable<Materiel[]> {
        return this.http.get<Materiel[]>(`${this.apiUrlMateriel}?motif=${motif}`);
    }
    // get all matereiels by mouvement utilisateur//
    getMaterielsByMouvementUtilisateur(utilisateur: string): Observable<Materiel[]> {
        return this.http.get<Materiel[]>(`${this.apiUrlMateriel}?utilisateur=${utilisateur}`);
    }
    // get all matereiels by mouvement projet id//
    getMaterielsByMouvementProjetId(projetId: string): Observable<Materiel[]> {
        return this.http.get<Materiel[]>(`${this.apiUrlMateriel}?projetId=${projetId}`);
    }
    // get all matereiels by mouvement projet nom//
    getMaterielsByMouvementProjetNom(projetNom: string): Observable<Materiel[]> {
        return this.http.get<Materiel[]>(`${this.apiUrlMateriel}?projetNom=${projetNom}`);
    }
    // get all materieels//
    getAllMateriels(): Observable<Materiel[]> {
        return this.http.get<Materiel[]>(this.apiUrlMateriel);
    }
    // add new materiel//
    addMateriel(materiel: Materiel): Observable<Materiel> {
        return this.http.post<Materiel>(this.apiUrlMateriel, materiel);
    }
    // get materiel by id//
    getMaterielById(id: string): Observable<Materiel>{
        return this.http.get<Materiel>(`${this.apiUrlMateriel}/${id}`);
    }
    // update materiel//
    updateMateriel(id: string, materiel: Materiel): Observable<Materiel> {  
        return this.http.put<Materiel>(`${this.apiUrlMateriel}/${id}`, materiel);
    }
    // delete materiel//
    deleteMateriel(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrlMateriel}/${id}`);
    }

    // get all locations by materiel id//
    getLocationsByMaterielId(materielId: string): Observable<LocationMateriel[]> {
        return this.http.get<LocationMateriel[]>(`${this.apiUrlLocation}?materielId=${materielId}`);
    }

}