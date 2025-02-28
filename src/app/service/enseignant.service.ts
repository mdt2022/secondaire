
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Enseignant } from '../model/enseignant.model';
@Injectable({
    providedIn: 'root'
})
export class EnseignantService{
    private apiUrl = environment.apiURL;
    constructor(private http: HttpClient, private router: Router) {}
    getAllEnseignants(): Observable<Enseignant[]>{
        return this.http.get<Enseignant[]>(this.apiUrl+"/enseignants");
    } 
    getEnseignantsByEcole(ecole: number): Observable<Enseignant[]> {
      return this.http.get<Enseignant[]>(this.apiUrl+"/enseignants/ecole/${ecoleId}");
    }
    

}