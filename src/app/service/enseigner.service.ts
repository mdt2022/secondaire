import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Enseigner } from '../model/enseigner.model';
import { Matiere } from '../model/matiere.model';

@Injectable({
  providedIn: 'root'
})

export class EnseignerService{
    private apiUrl = environment.apiURL+ "/enseigners";

    constructor(private http: HttpClient, private router: Router) {}

    getAllEnseigners(): Observable<Enseigner[]> {
      return this.http.get<Enseigner[]>(`${this.apiUrl}`);
    }
  
    // Récupérer un enseignant par ID
    getEnseignerById(id: number): Observable<Enseigner> {
      return this.http.get<Enseigner>(`${this.apiUrl}/${id}`);
    }
  
    // Créer un nouvel enseignant
    createEnseigner(enseigner: Enseigner): Observable<Enseigner> {
      return this.http.post<Enseigner>(`${this.apiUrl}`, enseigner);
    }
  
    // Mettre à jour un enseignant
    updateEnseigner(id: number, enseigner: Enseigner): Observable<Enseigner> {
      return this.http.put<Enseigner>(`${this.apiUrl}/${id}`, enseigner);
    }
  
    // Supprimer un enseignant
    deleteEnseigner(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  
    // Récupérer les matières par école et année
    getMatieresParEcoleEtAnnee(ecoleId: number, anneeId: number): Observable<Enseigner[]> {
      return this.http.get<Enseigner[]>(`${this.apiUrl}/enseigners?ecoleId=${ecoleId}&anneeId=${anneeId}`);
    }    
}