import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../model/role.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  readonly apiUrl = environment.apiURL

  constructor(private http: HttpClient) {}

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl+"/roles", role);
  }

  getRoleById(id: number): Observable<Role> {
    return this.http.get<Role>(this.apiUrl+"/roles/"+id);
  }

  updateRole(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(this.apiUrl+"/roles/"+id, role);
  }
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl+"/roles");
  }
  // Supprimer un rôle
  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl+"/roles/"+id);
  }
  
  updateRolePermissions(roleId: number, permissionIds: number[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${roleId}/roles/permissions`, permissionIds);
  }
}
