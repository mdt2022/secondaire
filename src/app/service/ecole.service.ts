import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Ecole } from '../model/ecole.model';

@Injectable({
  providedIn: 'root'
})
export class EcoleService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient, private router: Router) {}
  //la liste des ecoles du secondaires
  getAllEcole(): Observable<Ecole[]>{
    return this.http.get<Ecole[]>(this.apiUrl+"/ecoles/secondaires");
  }
}
