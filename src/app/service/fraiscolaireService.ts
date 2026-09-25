import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fraiscolaire } from '../model/fraiscolaire';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FraiscolaireService {
  private apiUrl = `${environment.apiURL}/fraiscolaires`;

  constructor(private http: HttpClient) {}

  create(frais: Fraiscolaire): Observable<Fraiscolaire> {
    return this.http.post<Fraiscolaire>(this.apiUrl, frais);
  }

  update(id: number, frais: Fraiscolaire): Observable<Fraiscolaire> {
    return this.http.put<Fraiscolaire>(`${this.apiUrl}/${id}`, frais);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(ecoleId: number, classeId: number, anneeId: number): Observable<Fraiscolaire[]> {
    return this.http.post<Fraiscolaire[]>(`${this.apiUrl}/search`, { ecoleId, classeId, anneeId });
  }
}
