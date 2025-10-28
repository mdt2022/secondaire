// src/app/services/role.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../model/role';
import { environment } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = environment.apiURL+"/roles"; // adapte l'URL

  constructor(private http: HttpClient) { }

  getAll(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl+"/categorie/2");
  }

  getById(id: number) {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  create(role: Role) {
    return this.http.post<Role>(this.apiUrl, role);
  }

  update(id: number, role: Role) {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, role);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
