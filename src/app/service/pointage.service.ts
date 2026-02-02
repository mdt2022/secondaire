import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pointage, RecherchePointage, ResultatSimulation, SimulationPaiement } from '../model/pointage';

@Injectable({
  providedIn: 'root'
})
export class PointageService {
  private apiUrl = 'http://localhost:8080/pointages';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Pointage[]> {
    return this.http.get<Pointage[]>(this.apiUrl);
  }

  getById(id: number): Observable<Pointage> {
    return this.http.get<Pointage>(`${this.apiUrl}/${id}`);
  }

  create(pointage: Pointage): Observable<Pointage> {
    return this.http.post<Pointage>(this.apiUrl, pointage);
  }

  update(id: number, pointage: Pointage): Observable<Pointage> {
    return this.http.put<Pointage>(`${this.apiUrl}/${id}`, pointage);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  rechercher(recherche: RecherchePointage): Observable<Pointage[]> {
    return this.http.post<Pointage[]>(`${this.apiUrl}/recherche`, recherche);
  }

  simulerPaiement(simulation: SimulationPaiement): Observable<ResultatSimulation> {
    return this.http.post<ResultatSimulation>(`${this.apiUrl}/simuler`, simulation);
  }

  calculerHonoraires(dateDebut: string, dateFin: string): Observable<any> {
    let params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);
    return this.http.get<any>(`${this.apiUrl}/honoraires`, { params });
  }

  supprimerMultiple(ids: number[]): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/supprimer-multiple`, ids);
  }

  getFicheValidee(dateDebut: string, dateFin: string): Observable<any[]> {
    let params = new HttpParams()
      .set('dateDebut', dateDebut)
      .set('dateFin', dateFin);
    return this.http.get<any[]>(`${this.apiUrl}/fiche-validee`, { params });
  }
}