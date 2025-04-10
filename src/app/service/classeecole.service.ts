import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe } from '../model/classe.model';
import { Classeecole } from '../model/classeecole.model';

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class ClasseEcoleService {

  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getAllClasseEcoles(): Observable<Classeecole[]> {
    return this.http.get<Classeecole[]>(`${this.apiUrl}/classeecoles`);
  }

  getClassesByEcole(ecoleId: number): Observable<Classe[]> {
    return this.http.get<Classe[]>(`${this.apiUrl}/classeecoles/classeparecole/${ecoleId}`);
  }

  getClasseEcoleById(id: number): Observable<Classeecole> {
    return this.http.get<Classeecole>(`${this.apiUrl}/classeecoles/${id}`);
  }

  createClasseEcole(classeEcole: Classeecole): Observable<Classeecole> {
    return this.http.post<Classeecole>(`${this.apiUrl}/classeecoles`, classeEcole);
  }

  updateClasseEcole(id: number, classeEcole: Classeecole): Observable<Classeecole> {
    return this.http.put<Classeecole>(`${this.apiUrl}/classeecoles/${id}`, classeEcole);
  }

  deleteClasseEcole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/classeecoles/${id}`);
  }
}
