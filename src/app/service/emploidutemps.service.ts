import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Emploidutemps } from '../model/emploidutemps';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmploidutempsService {
  createEmploi: any;
  updateEmploi(id: any, payload: { id: any; jour: any; heuredebut: any; heurefin: any; matiere: { id: any; }; professeur: { id: any; }; classe: { id: any; }; anneeuv: { id: any; }; }) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = environment.apiURL + '/emploidutemps';


  constructor(private http: HttpClient) {}

  getAll(): Observable<Emploidutemps[]> {
    return this.http.get<Emploidutemps[]>(this.apiUrl);
  }

  getById(id: number): Observable<Emploidutemps> {
    return this.http.get<Emploidutemps>(`${this.apiUrl}/${id}`);
  }

  create(emploi: Emploidutemps): Observable<Emploidutemps> {
    return this.http.post<Emploidutemps>(this.apiUrl, emploi);
  }

  update(id: number, emploi: Emploidutemps): Observable<Emploidutemps> {
    return this.http.put<Emploidutemps>(`${this.apiUrl}/${id}`, emploi);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
