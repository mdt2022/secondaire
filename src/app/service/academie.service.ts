import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Academie } from "../model/academie.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AcademieService {
  
    private apiUrl = environment.apiURL+"/academies";
  
    constructor(private http: HttpClient) {}
  
    getAll(): Observable<Academie[]>{
      return this.http.get<Academie[]>(this.apiUrl);
    }
}