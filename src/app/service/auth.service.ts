import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { BehaviorSubject } from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiURL+"/administrateurs";
  private tokenKey = 'auth-token';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string; password: string }) {
    return this.http.post<any>(this.apiUrl+"/loginsecond", credentials);
  }
  saveUserAndToken(response: any): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedInSubject.next(true);
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
