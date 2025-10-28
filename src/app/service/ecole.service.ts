import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Ecole } from "../model/ecole";

@Injectable({
  providedIn: 'root'  // ✅ c’est essentiel
})

export class EcoleService{
    private apiUrl = environment.apiURL+"/ecoles";

    constructor(private http: HttpClient) {}

    getAll(): Observable<Ecole[]>{
        return this.http.get<Ecole[]>(this.apiUrl+"/secondaires")
    }
}