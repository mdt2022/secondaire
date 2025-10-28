import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Administrateur } from "../model/administrateur";
import { Injectable } from "@angular/core";
import { Role } from "../model/role";
import { Academie } from "../model/academie";

@Injectable({
  providedIn: 'root'  // ✅ c’est essentiel
})

export class AcademieService{
    private apiUrl = environment.apiURL+"/academies";

    constructor(private http: HttpClient) {}

    getAll(): Observable<Academie[]>{
        return this.http.get<Academie[]>(this.apiUrl);
    }
}