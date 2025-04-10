import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Fraiscolaire } from '../model/fraiscolaire.model';

@Injectable({
  providedIn: 'root'
})
export class FraiscolaireService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient, private router: Router) {}

  getAllFrai(): Observable<Fraiscolaire[]> {
    return this.http.get<Fraiscolaire[]>(this.apiUrl + '/fraiscolaires');
  }

  getFraiById(id: number): Observable<Fraiscolaire> {
    return this.http.get<Fraiscolaire>(this.apiUrl + '/fraiscolaires/' + id);
  }

  createFraiscolaire(fraiscolaire: Fraiscolaire): Observable<Fraiscolaire> {
    return this.http.post<Fraiscolaire>(this.apiUrl + '/fraiscolaires', fraiscolaire);
  }

  updateFrai(id: number, frais: Fraiscolaire): Observable<Fraiscolaire> {
    return this.http.put<Fraiscolaire>(this.apiUrl + '/fraiscolaires/' + id, frais);
  }

  deleteFrai(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/fraiscolaires/' + id);
  }
}
