import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Eleve } from '../model/eleve.model';

@Injectable({
  providedIn: 'root'
})
export class EleveService {

  private apiUrl = environment.apiURL + "/eleveecoles";

  constructor(private http: HttpClient, private router: Router) {}
  getAllEleve(an: string, ecole: string, classe: string): Observable<Eleve[]> {
    const donnees = [an, ecole, classe];
    return this.http.post<Eleve[]>(`${this.apiUrl}/eleveparclasse`, donnees);
  }
}
