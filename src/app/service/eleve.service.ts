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
  
  private apiUrl = environment.apiURL+"/eleves";
  
  constructor(private http: HttpClient, private router: Router) {}
  //la liste des classes du secondaires
  getEleveClasseEcole(ecoleId: number, classeId: number, anneeId: number): Observable<Eleve[]>{
    return this.http.get<Eleve[]>(this.apiUrl+"/"+ecoleId+"/"+classeId+"/"+anneeId);
  }
}
