import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Administrateur } from '../model/admin.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = environment.apiURL;
  private tokenKey = 'auth-token';

  constructor(private http: HttpClient, private router: Router) {}

  getAllAdmin(): Observable<Administrateur[]>{
    return this.http.get<Administrateur[]>(this.apiUrl+"/administrateurs/second");
  }


  save(admin: Administrateur): Observable<Administrateur> {
    return this.http.post<Administrateur>(this.apiUrl+"/administrateurs", admin);
  }

  update(admin: Administrateur): Observable<Administrateur> {
    return this.http.put<Administrateur>(this.apiUrl+"/administrateurs/"+admin.id, admin);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl+"/administrateurs"+id);
  }
}
