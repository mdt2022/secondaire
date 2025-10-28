import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fraiscolaire } from '../model/fraiscolaire';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FraiscolaireService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Fraiscolaire[]> {
    return this.http.get<Fraiscolaire[]>(this.apiUrl);
  }

  getById(id: number): Observable<Fraiscolaire> {
    return this.http.get<Fraiscolaire>(`${this.apiUrl}/${id}`);
  }

  create(frais: Fraiscolaire): Observable<Fraiscolaire> {
    return this.http.post<Fraiscolaire>(this.apiUrl, frais);
  }

  update(id: number, frais: Fraiscolaire): Observable<Fraiscolaire> {
    return this.http.put<Fraiscolaire>(`${this.apiUrl}/${id}`, frais);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
