import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Enseigner } from '../model/enseigner';
import { Matiere } from '../model/matiere';
@Injectable({ providedIn: 'root' })
export class EnseignerService {
  private apiUrl = environment.apiURL+"/enseigners";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Enseigner[]> {
    return this.http.get<Enseigner[]>(this.apiUrl);
  }

  getById(id: number): Observable<Enseigner> {
    return this.http.get<Enseigner>(`${this.apiUrl}/${id}`);
  }

  create(data: Enseigner): Observable<Enseigner> {
    return this.http.post<Enseigner>(this.apiUrl, data);
  }

  update(id: number, data: Enseigner): Observable<Enseigner> {
    return this.http.put<Enseigner>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  //matieres enseigner pour cette ecole
  getAllForEcole(idecole: number): Observable<Enseigner[]>{
    return this.http.get<Enseigner[]>(this.apiUrl+"/ecole/"+idecole)
  }
  //get matieres enseigner par classe
  getMatiereEcoleClasse(donnees: number[]): Observable<Matiere[]>{
    return this.http.post<Matiere[]>(this.apiUrl+"/matieres", donnees)
  }
}