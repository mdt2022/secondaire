import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Paiement } from '../model/paiement';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private apiUrl = environment.apiURL + "/paiementsecondaires";

  constructor(private http: HttpClient) {}

  // Récupérer tous les paiements
  getAll(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(this.apiUrl);
  }

  // Recherche avec filtres
  search(
    ecoleId: number,
    classeId: number,
    anneeId: number,
    eleveId?: number,
    numerorecu?: string
  ): Observable<Paiement[]> {

    let params = new HttpParams()
      .set('ecoleId', ecoleId)
      .set('classeId', classeId)
      .set('anneeId', anneeId);

    if (eleveId != null) params = params.set('eleveId', eleveId);
    if (numerorecu && numerorecu.trim() !== '') params = params.set('numerorecu', numerorecu);

    return this.http.get<Paiement[]>(`${this.apiUrl}/search`, { params });
  }

  // Création
  create(data: Paiement): Observable<Paiement> {
    return this.http.post<Paiement>(this.apiUrl, data);
  }

  // Modification
  update(id: number, data: Paiement): Observable<Paiement> {
    return this.http.put<Paiement>(`${this.apiUrl}/${id}`, data);
  }

  // Suppression
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
