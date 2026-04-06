import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { Administrateur } from "../model/administrateur";
import { Injectable } from "@angular/core";
import { Role } from "../model/role";

@Injectable({
  providedIn: 'root'  // ✅ c’est essentiel
})

export class AdministrateurService{
    private apiUrl = environment.apiURL;

    constructor(private http: HttpClient) {}

    getRoles(): Observable<Role[]>{
        return this.http.get<Role[]>(this.apiUrl+"/roles/categorie/2");
    }

    getAll(): Observable<Administrateur[]>{
        return this.http.get<Administrateur[]>(this.apiUrl+"/administrateurs/second");
    }
    update(id: number, admin: Administrateur): Observable<Administrateur>{
        return this.http.put<Administrateur>(this.apiUrl+"/administrateurs/"+id, admin);
    }
    create(admin: Administrateur): Observable<Administrateur>{
        return this.http.post<Administrateur>(this.apiUrl+"/administrateurs", admin);
    }
    getById(id: number): Observable<Administrateur>{
        return this.http.get<Administrateur>(this.apiUrl+"/administrateurs/"+id)
    }
delete(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/administrateurs/${id}`);
}
}
