import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../model/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiURL;
  
  // Initialisation à l'état réel du localStorage au démarrage de l'app
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Configuration du Timeout (Exemple : 15 minutes d'inactivité)
  private readonly INACTIVITY_TIMEOUT = 15 * 60 * 1000; 
  private timeoutId: any;
  private eventListeners: (() => void)[] = [];

  constructor(
    private http: HttpClient, 
    private router: Router,
    private ngZone: NgZone // Évite de surcharger les cycles de détection de changements Angular
  ) {
    // Si l'utilisateur est déjà connecté au chargement de la page, lancer la surveillance
    if (this.hasToken()) {
      this.startActivityMonitoring();
    }
  }

  login(username: string, password: string, ecoleId: number): Observable<{ token: string, user: User }> {
    return this.http.post<{ token: string, user: User }>(
      `${this.apiUrl}/api/auth/loginsecond`, 
      { username, password, ecoleId }
    );
  }

  saveUserAndToken(response: any): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedInSubject.next(true);
    
    // Démarrer la surveillance dès que la connexion réussit
    this.startActivityMonitoring();
  }

  saveAdminData(admin: any): void {
    localStorage.setItem('user', JSON.stringify(admin));
  }

  getAdminData(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getEcoleId(): number | null {
    const user = this.getAdminData();
    return user?.administrateur?.ecole?.idEcole ?? null;
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserFromLocalStorage(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {  
      const user = this.getUserFromLocalStorage();
      const userId = user?.administrateur?.id;
      const token = this.getToken(); // On récupère le token AVANT de vider le localStorage
      // 1. Arrêter immédiatement la surveillance de l'activité
      this.stopActivityMonitoring();
    // 2. Si le serveur a besoin d'être informé et qu'on a les données nécessaires
    if (userId && token) {
        // Si vous n'utilisez pas d'intercepteur automatique, passez manuellement le token ici :
        // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        // this.http.post(`${this.apiUrl}/api/auth/logout`, { userId }, { headers }).subscribe(...)

        this.http.post(`${this.apiUrl}/api/auth/logout`, { userId }).subscribe({
          next: () => console.log('Session fermée côté serveur'),
          error: (err) => console.error('Erreur de déconnexion serveur', err),
          complete: () => this.clearClientSession() // Nettoyage local APRÈS la réponse (succès ou erreur)
        });
      } else {
        // Si pas de userId ou pas de token, on nettoie directement en local
        this.clearClientSession();
      }
    }
  /**
   * Centralisation du nettoyage local de la session
   */
  private clearClientSession(): void {
    localStorage.clear();
    this.isLoggedInSubject.next(false);
    this.ngZone.run(() => {
      this.router.navigate(['/login']);
    });
  }
  /**
   * GESTION DE LA DÉCONNEXION AUTOMATIQUE PAR INACTIVITÉ
   */

  private startActivityMonitoring(): void {
    this.stopActivityMonitoring(); // Sécurité : éviter les doublons de minuteurs

    // Exécuter en dehors de la Zone Angular pour ne pas bloquer les performances de rendu
    this.ngZone.runOutsideAngular(() => {
      const resetTimer = () => this.resetInactivityTimeout();

      // Liste des événements déclenchant le renouvellement du temps d'inactivité
      const events = ['mousemove', 'click', 'keypress', 'scroll', 'touchstart'];
      
      events.forEach(event => {
        window.addEventListener(event, resetTimer);
        this.eventListeners.push(() => window.removeEventListener(event, resetTimer));
      });

      this.resetInactivityTimeout();
    });
  }

  private resetInactivityTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      // Revenir dans la Zone Angular pour exécuter la redirection et la mise à jour UI
      this.ngZone.run(() => {
        console.warn('Déconnexion automatique : Inactivité détectée.');
        this.logout();
      });
    }, this.INACTIVITY_TIMEOUT);
  }

  private stopActivityMonitoring(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    // Nettoyer tous les écouteurs d'événements globaux du navigateur
    this.eventListeners.forEach(removeListener => removeListener());
    this.eventListeners = [];
  }
}
