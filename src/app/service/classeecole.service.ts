import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { Classe } from "../model/classe.model";

@Injectable({
    providedIn: 'root'
  })
export class ClasseecoleService{
    private apiUrl = environment.apiURL+"/classeecoles";
    //constructeur
    constructor(private http: HttpClient) {}
    //la liste des classes de l'ecole
    getClasseEcole(ecoleId: number): Observable<Classe[]>{
        return this.http.get<Classe[]>(this.apiUrl+"/ecole/"+ecoleId);
    }
   
}