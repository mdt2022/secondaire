import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../EtudiantFRONTEND/src/environments/environment';
import { Administrateur } from '../../../../EtudiantFRONTEND/src/app/model/administrateur.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth-token';

  constructor(private http: HttpClient, private router: Router) {}

  getAllAdmin(): Observable<Administrateur[]>{
    return this.http.get<Administrateur[]>(this.apiUrl+"/administrateurs/second");
  }

    
  save(admin: Administrateur): Observable<Administrateur> {
    return this.http.post<Administrateur>(this.apiUrl+"/administrateurs", admin);
  }

  update(id: string, admin: Administrateur): Observable<Administrateur> {
    return this.http.put<Administrateur>(this.apiUrl+"/administrateurs/"+id, admin);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.apiUrl+"/administrateurs"+id);
  }
}