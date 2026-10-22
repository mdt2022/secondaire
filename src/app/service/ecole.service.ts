import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Ecole, EcolePayload } from "../model/ecole";

@Injectable({
  providedIn: 'root'  // ✅ c’est essentiel
})

export class EcoleService{
    private apiUrl = environment.apiURL+"/ecoles";

    constructor(private http: HttpClient) {}

    getAll(): Observable<Ecole[]>{
        return this.http.get<Ecole[]>(this.apiUrl+"/secondaires")
    }

    create(ecole: EcolePayload): Observable<Ecole> {
        return this.http.post<Ecole>(this.apiUrl, ecole);
    }

    update(id: number, ecole: EcolePayload): Observable<Ecole> {
        return this.http.put<Ecole>(`${this.apiUrl}/${id}`, ecole);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}