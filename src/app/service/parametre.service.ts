import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Parametre } from '../model/parametre.model';


@Injectable({
  providedIn: 'root',
})
export class ParametreService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Parametre[]> {
    return this.http.get<Parametre[]>(this.apiUrl);
  }

  getById(id: number): Observable<Parametre> {
    return this.http.get<Parametre>(`${this.apiUrl}/${id}`);
  }

  create(parametre: Parametre): Observable<Parametre> {
    return this.http.post<Parametre>(this.apiUrl, parametre);
  }

  update(id: number, parametre: Parametre): Observable<Parametre> {
    return this.http.put<Parametre>(`${this.apiUrl}/${id}`, parametre);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
