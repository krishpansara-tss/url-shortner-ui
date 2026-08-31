import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequestDto } from '../dtos/request/RegisterRequestDto';
import { RegisterResponseDto } from '../dtos/response/RegisterResponseDto';
import { LoginResponseDto } from '../dtos/response/LoginResponseDto';
import { LoginRequestDto } from '../dtos/request/LoginRequestDto';
import { MessageResponseDto } from '../dtos/response/MessageResponseDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthServices {
  private http = inject(HttpClient);

  register(registerRequestObj: RegisterRequestDto): Observable<RegisterResponseDto> {
    return this.http.post<RegisterResponseDto>(
      environment.BASE_URL + environment.AUTH.REGISTER,
      registerRequestObj
    );
  }

  login(loginRequestObj: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      environment.BASE_URL + environment.AUTH.LOGIN,
      loginRequestObj
    );
  }

  logout(): Observable<MessageResponseDto> {
    const token = this.getToken();
    return this.http.post<MessageResponseDto>(
      environment.BASE_URL + environment.AUTH.LOGOUT,
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
  }

  loggout(): Observable<MessageResponseDto> {
    return this.logout();
  }

  saveToken(token: string, role?: string) {
    localStorage.setItem('authToken', token);
    if (role) {
      localStorage.setItem('userRole', role);
    }
    try {
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const payload = JSON.parse(atob(payloadBase64));
        const extractedRole = role || payload.role || payload.roles?.[0] || payload.authorities?.[0];
        if (extractedRole) {
          localStorage.setItem('userRole', extractedRole);
        }
        if (payload.sub) {
          localStorage.setItem('email', payload.sub);
        }
        if (payload.id || payload.userId) {
          localStorage.setItem('userId', (payload.id || payload.userId).toString());
        }
      }
    } catch (e) {
      console.error('Error parsing token payload:', e);
    }
  }

  saveAuthData(loginResponse: LoginResponseDto) {
    if (loginResponse.token) {
      this.saveToken(loginResponse.token, loginResponse.role);
    }
    if (loginResponse.email) {
      localStorage.setItem('email', loginResponse.email);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserId(): number {
    const savedId = localStorage.getItem('userId');
    if (savedId) return parseInt(savedId, 10);
    const token = this.getToken();
    if (!token) return 0;
    try {
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const payload = JSON.parse(atob(payloadBase64));
        return payload.id || payload.userId || 0;
      }
    } catch {
      return 0;
    }
    return 0;
  }

  removeToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
  }

  getLoggedInUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  getLoggedInRole(): string | null {
    let role = localStorage.getItem('userRole');
    if (!role) {
      const token = this.getToken();
      if (token) {
        try {
          const payloadBase64 = token.split('.')[1];
          if (payloadBase64) {
            const payload = JSON.parse(atob(payloadBase64));
            role = payload.role || payload.roles?.[0] || payload.authorities?.[0] || null;
            if (role) {
              localStorage.setItem('userRole', role);
            }
          }
        } catch {
          role = null;
        }
      }
    }
    return role;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const role = this.getLoggedInRole();
    if (!role) return false;
    const r = role.toUpperCase();
    return r === 'ADMIN' || r === 'ROLE_ADMIN';
  }
}
