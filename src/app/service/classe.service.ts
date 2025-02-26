import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Classe } from '../model/classe.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {

  private apiUrl = environment.apiURL;
  
  constructor(private http: HttpClient, private router: Router) {}
  //la liste des classes du secondaires
  getAllClasse(): Observable<Classe[]>{
    return this.http.get<Classe[]>(this.apiUrl+"/classes");
  }
  //la liste des classes de l'ecole
  getClasseEcole(ecoleId: number): Observable<any>{
    return this.http.get<any>(this.apiUrl+"/classeecoles/"+ecoleId);
  }

}
