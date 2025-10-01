
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Cercle } from "../model/cercle.model";
@Injectable({
    providedIn: 'root'
  })
  export class CercleService {
    private apiUrl = environment.apiURL+"/cercles";
  
    constructor(private http: HttpClient) {}
  
    getCercles(): Observable<Cercle[]> {
      return this.http.get<Cercle[]>(this.apiUrl);
    }
  
    get(id: number): Observable<Cercle> {
      return this.http.get<Cercle>(`${this.apiUrl}/${id}`);
    }
  
    create(cercle: Cercle): Observable<Cercle> {
      return this.http.post<Cercle>(this.apiUrl, cercle);
    }
  
    update(id: number, cercle: Cercle): Observable<Cercle> {
      return this.http.put<Cercle>(`${this.apiUrl}/${id}`, cercle);
    }
  
    delete(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }