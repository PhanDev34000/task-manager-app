import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id:       string;
  username: string;
  email:    string;
}

export interface AuthResponse {
  token: string;
  user:  AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey   = 'task_manager_token';
  private userKey    = 'task_manager_user';

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http:   HttpClient,
    private router: Router
  ) {}

  // --- Inscription ---
  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { username, email, password })
      .pipe(tap(response => this.handleAuth(response)));
  }

  // --- Connexion ---
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(response => this.handleAuth(response)));
  }

  // --- Déconnexion ---
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // --- Récupérer le token ---
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // --- Vérifier si connecté ---
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // --- Récupérer l'utilisateur connecté ---
  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.getValue();
  }

  // --- Stocker token et user ---
  private handleAuth(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  // --- Récupérer user depuis localStorage ---
  private getStoredUser(): AuthUser | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }
}