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

    // Obtenir tous les emplois du temps
    getAllemploidutemps(): Observable<Emploidutemp[]> {
      return this.http.get<Emploidutemp[]>(`${this.apiUrl}`);
    }

    // Obtenir un emploi du temps par ID
    getEmploiById(id: number): Observable<Emploidutemp> {
      return this.http.get<Emploidutemp>(`${this.apiUrl}/${id}`);
    }

    // Créer un emploi du temps
    createEmploi(emploi: Emploidutemp): Observable<Emploidutemp> {
      return this.http.post<Emploidutemp>(`${this.apiUrl}`, emploi);
    }

    // Mettre à jour un emploi du temps
    updateEmploi(id: number, emploi: Emploidutemp): Observable<Emploidutemp> {
      return this.http.put<Emploidutemp>(`${this.apiUrl}/${id}`, emploi);
    }

    // Supprimer un emploi du temps
    deleteEmploi(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Obtenir par classe, année, école
    getByClasseAnneeEcole(classeId: number, anneeuvId: number, ecoleId: number): Observable<Emploidutemp[]> {
      return this.http.get<Emploidutemp[]>(`${this.apiUrl}/classe/${classeId}/annee/${anneeuvId}/ecole/${ecoleId}`);
    }

    // Obtenir par professeur, année, école
    getByProfesseurAnneeEcole(professeurId: number, anneeuvId: number, ecoleId: number): Observable<Emploidutemp[]> {
      return this.http.get<Emploidutemp[]>(`${this.apiUrl}/professeur/${professeurId}/annee/${anneeuvId}/ecole/${ecoleId}`);
    }

    // Obtenir par année, école
    getByAnneeEcole(anneeuvId: number, ecoleId: number): Observable<Emploidutemp[]> {
      return this.http.get<Emploidutemp[]>(`${this.apiUrl}/annee/${anneeuvId}/ecole/${ecoleId}`);
    }

    // Obtenir par jour, professeur, année, école
    getByJourProfesseurAnneeEcole(jour: string, professeurId: number, anneeuvId: number, ecoleId: number): Observable<Emploidutemp[]> {
      return this.http.get<Emploidutemp[]>(`${this.apiUrl}/jour/${jour}/professeur/${professeurId}/annee/${anneeuvId}/ecole/${ecoleId}`);
    }

    // Obtenir par jour, année, école
    getByJourAnneeEcole(jour: string, anneeuvId: number, ecoleId: number): Observable<Emploidutemp[]> {
      return this.http.get<Emploidutemp[]>(`${this.apiUrl}/jour/${jour}/annee/${anneeuvId}/ecole/${ecoleId}`);
    }

    // Emploi par semaine d'un prof
  getByProfesseurAnneeEcoleSemaine(professeurId: number, anneeuvId: number, ecoleId: number): Observable<Emploidutemp[]> {
    return this.http.get<Emploidutemp[]>(`${this.apiUrl}/professeur/${professeurId}/annee/${anneeuvId}/ecole/${ecoleId}`);
  }
  }



