import { Emploidutemp } from './../model/emploidutemp.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmploidutempService{
    private apiUrl = environment.apiURL+"/emploidutemps";
    constructor(private http: HttpClient, private router: Router) {}
    //par jour
    getEmploiDuTempsParJour(anneeId: string, jour: string): Observable<Emploidutemp[]> {
      return this.http.get<Emploidutemp[]>(this.apiUrl+"/"+anneeId+"/"+jour);
    } 
    //total
    getAllemploidutemps(): Observable<Emploidutemp[]>{
        return this.http.get<Emploidutemp[]>(this.apiUrl);
    }
    //par prof
    getEmploiByProf(ecole:number, prof: string, jour: string, an: string): Observable<Emploidutemp[]>{
      return this.http.get<Emploidutemp[]>(this.apiUrl+"/"+ecole+"/"+prof+"/"+jour+"/"+an);
    }
    getByClasseAnneeEcole(classe: any, annee:any,ecole:any): Observable<any>{
      return this.http.get(this.apiUrl);
    }
    getByJourAnneeEcole(jour: string, annnee: number, ecole: number):Observable<any>{
      return this.http.get(this.apiUrl);
    }
    createEmploi(emploi: Emploidutemp): Observable<any>{
      return this.http.get(this.apiUrl);
    }
    getByAnneeEcole(annee: any, ecole: any): Observable<any>{
      return this.http.get(this.apiUrl);
    }
}
