import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EleveEcole } from '../model/eleveecole.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EleveEcoleService {

  private apiUrl = environment.apiURL + "/eleveecoles";

  constructor(private http: HttpClient, private router: Router) {}
  getAllEleveecole(an: string, ecole: string, classe: string): Observable<EleveEcole[]> {
    const donnees = [an, ecole, classe];
    return this.http.post<EleveEcole[]>(`${this.apiUrl}/eleveparclasse`, donnees);
  }
}
