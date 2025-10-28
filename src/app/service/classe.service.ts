import { Injectable } from "@angular/core";
import { Classe } from "../model/classe";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = environment.apiURL+"/classes";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl);
  }

  getById(id: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.apiUrl}/${id}`);
  }

  create(classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(this.apiUrl, classe);
  }

  update(id: number, classe: Classe): Observable<Classe> {
    return this.http.put<Classe>(`${this.apiUrl}/${id}`, classe);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}