import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiURL;
  private tokenKey = 'auth-token';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }) {
    const donnees = [credentials.username, credentials.password]
    return this.http.post<any>(this.apiUrl+"/administrateurs/loginsecond", donnees);
  }
    saveUserToLocalStorage(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromLocalStorage(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

}
