import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClasseEcole } from '../model/classeecole';

@Injectable({
  providedIn: 'root'
})
export class ClasseEcoleService {
  private apiUrl = environment.apiURL+"/classeecoles";

  constructor(private http: HttpClient) {}

  getAll(): Observable<ClasseEcole[]> {
    return this.http.get<ClasseEcole[]>(this.apiUrl);
  }

  getById(id: number): Observable<ClasseEcole> {
    return this.http.get<ClasseEcole>(`${this.apiUrl}/${id}`);
  }

  create(classeEcole: ClasseEcole): Observable<ClasseEcole> {
    return this.http.post<ClasseEcole>(this.apiUrl, classeEcole);
  }

  update(id: number, classeEcole: ClasseEcole): Observable<ClasseEcole> {
    return this.http.put<ClasseEcole>(`${this.apiUrl}/${id}`, classeEcole);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}