import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL: string = `${environment.apiUrl}/auth`;
  private TOKEN: string = '';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.API_URL + '/login', request).pipe(
      tap((response) => {
        if (response?.token) {
          this.saveToken(response.token);
        }
      }),
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.API_URL + '/register', request).pipe(
      tap((response) => {
        if (response?.token) {
          this.saveToken(response.token);
        }
      }),
    );
  }

  isLoggedIn(): boolean {
    return this.getToken() != null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN);
  }

  removeToken() {
    localStorage.removeItem(this.TOKEN);
  }

  private saveToken(token: string) {
    localStorage.setItem(this.TOKEN, token);
  }
}
