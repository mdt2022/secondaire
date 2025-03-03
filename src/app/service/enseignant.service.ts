
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
    private apiUrl = environment.apiURL+"/enseignants";
    constructor(private http: HttpClient, private router: Router) {}
    getAllEnseignants(): Observable<Enseignant[]>{
        return this.http.get<Enseignant[]>(this.apiUrl);
    }
    getEnseignantsByEcole(ecoleId: number): Observable<Enseignant[]> {
      return this.http.get<Enseignant[]>(this.apiUrl+"/ecole/${ecoleId}");
    }

    getEnseignantById(id: number): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.apiUrl}/${id}`);
    }

    createEnseignant(enseignant: Enseignant): Observable<Enseignant> {
    return this.http.post<Enseignant>(this.apiUrl, enseignant);
    }

    updateEnseignant(id: number, enseignant: Enseignant): Observable<Enseignant> {
    return this.http.put<Enseignant>(`${this.apiUrl}/${id}`, enseignant);
    }

    deleteEnseignant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
