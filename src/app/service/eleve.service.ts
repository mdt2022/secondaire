
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Eleve } from '../model/eleve';
@Injectable({
  providedIn: 'root'
})
export class EleveService {
  private apiUrl = environment.apiURL+"/eleves";

  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Eleve[]> {
    return this.http.get<Eleve[]>(this.apiUrl);
  }

  getById(id: number): Observable<Eleve> {
    return this.http.get<Eleve>(`${this.apiUrl}/${id}`);
  }

  create(eleve: Eleve): Observable<Eleve> {
    return this.http.post<Eleve>(this.apiUrl, eleve);
  }

  update(id: number, eleve: Eleve): Observable<Eleve> {
    return this.http.put<Eleve>(`${this.apiUrl}/${id}`, eleve);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}