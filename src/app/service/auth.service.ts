// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { User } from '../model/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiURL;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string, user: User }>(
      `${this.apiUrl}/administrateurs/loginsecond`,
      { username, password }
    );
  }

  saveAdminData(admin: any) {
    localStorage.setItem('user', JSON.stringify(admin));
  }

  getAdminData() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getEcoleId(): number | null {
    const user = this.getAdminData();
    return user?.administrateur?.ecole?.idEcole ?? null;
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
