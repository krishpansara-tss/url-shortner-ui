import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequestDto } from '../dtos/request/RegisterRequestDto';
import { RegisterResponseDto } from '../dtos/response/RegisterResponseDto';
import { LoginResponseDto } from '../dtos/response/LoginResponseDto';
import { LoginRequestDto } from '../dtos/request/LoginRequestDto';
import { environment } from '../../../environments/environment';
import { MessageResponseDto } from '../dtos/response/MessageResponseDto';

@Service()
export class AuthServices {
  http = inject(HttpClient);

  constructor() {}

  register(registerRequestObj: RegisterRequestDto): Observable<RegisterResponseDto> {
    return this.http.post<RegisterResponseDto>(
      environment.BASE_URL + environment.AUTH.REGISTER,
      registerRequestObj,
    );
  }

  login(loginRequestObj: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      environment.BASE_URL + environment.AUTH.LOGIN,
      loginRequestObj,
    );
  }

  loggout() : Observable<MessageResponseDto> {
    const token = localStorage.getItem('authToken');

    return this.http.post<MessageResponseDto>(
      environment.BASE_URL + environment.AUTH.LOGOUT,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  removeToken(){
     localStorage.removeItem('authToken');
     localStorage.removeItem('userRole');
     localStorage.removeItem('email');
  }


  saveToken(token: string) {
    localStorage.setItem('authToken', token);
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    const role = payload.role;
    localStorage.setItem('userRole', role);

    const email = payload.sub;
    localStorage.setItem('email', email);
  }

  getLoggedInUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  getLoggedInRole(): string | null {
    return localStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
