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
  getEmploiDuTempsParJour(anneeId: string, jour: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?annee=${anneeId}&jour=${jour}`);
  }
  
    private apiUrl = environment.apiURL;

    constructor(private http: HttpClient, private router: Router) {}

    getAllemploidutemps(): Observable<Emploidutemp[]>{
        return this.http.get<Emploidutemp[]>(this.apiUrl+"/emploidutemps");
    }

    getEmploiByProf(prof: string): Observable<Emploidutemp[]>{
      return this.http.get<Emploidutemp[]>(this.apiUrl+"/emploidutemps/${prof}");
  }
}
