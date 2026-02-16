import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Eleveecole } from '../model/eleveecole';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class EleveecoleService {
  private apiUrl = environment.apiURL+"/eleveecoles";
  constructor(private http: HttpClient) {}
  getAll(): Observable<Eleveecole[]> {
    return this.http.get<Eleveecole[]>(this.apiUrl);
  }
  getByClasseAndAnnee(donnees: string[]): Observable<Eleveecole[]> {
    return this.http.post<Eleveecole[]>(`${this.apiUrl}/eleveparclasse`, donnees);
  }
  promouvoir(eleveIds: number[], classeSuivanteId: number, anneeSuivanteId: number): Observable<any> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/promotion`, {
      eleveIds,
      classeSuivanteId,
      anneeSuivanteId
    });
  }
  redoubler(eleveIds: number[], classeSuivanteId: number, anneeSuivanteId: number): Observable<any> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/redoubler`, {
      eleveIds,
      classeSuivanteId,
      anneeSuivanteId
    });
  }
  getById(id: number): Observable<Eleveecole> {
    return this.http.get<Eleveecole>(`${this.apiUrl}/${id}`);
  }
  create(data: Eleveecole): Observable<Eleveecole> {
    return this.http.post<Eleveecole>(this.apiUrl, data);
  }
  update(id: number, data: Eleveecole): Observable<Eleveecole> {
    return this.http.put<Eleveecole>(`${this.apiUrl}/${id}`, data);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
