import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponseDto } from '../dtos/response/UserResponseDto';

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.BASE_URL}/api/v1/admin/users`;

  getAllUsers(): Observable<UserResponseDto[]> {
    return this.http.get<UserResponseDto[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<UserResponseDto> {
    return this.http.get<UserResponseDto>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, dto: Partial<UserResponseDto>): Observable<UserResponseDto> {
    return this.http.put<UserResponseDto>(`${this.baseUrl}/${id}`, dto);
  }

  activateUser(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/active/${id}`, {});
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
