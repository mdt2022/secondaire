// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../model/user';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiURL;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string, user: User }>(
      `${this.apiUrl}/api/auth/login`, 
      { username, password }
    );
  }
  saveUserAndToken(response: any): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedInSubject.next(true);
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
  getUserFromLocalStorage(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    const user = this.getUserFromLocalStorage();
    const userId = user.administrateur.id; // Vérifie si c'est .id ou .administrateur.id chez toi

    // 1. On nettoie TOUT de suite le client pour une UI réactive
    localStorage.clear();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);

    // 2. On informe le serveur (si l'utilisateur a encore un token valide)
    if (userId) {
      this.http.post(`${this.apiUrl}/api/auth/logout`, { userId }).subscribe({
        next: () => console.log('Session fermée côté serveur'),
        error: (err) => console.error('Le token était déjà expiré ou invalide', err)
      });
    }
  }
}
