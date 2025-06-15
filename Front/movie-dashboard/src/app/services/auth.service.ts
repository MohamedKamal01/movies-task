import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { TokenService } from './token.service';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = '/api/auth';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(username: string, password: string): Observable<string> {
    
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { username, password }).pipe(
      tap(res => this.tokenService.setToken(res.token)),
      map(res => res.token)
    );
  }

  register(username: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { username, password, role });
  }

  logout() {
    this.tokenService.removeToken();
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }

  getToken(): string | null {
    return this.tokenService.getToken();
  }
}
