import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SystemConfigDto } from '../dtos/response/SystemConfigDto';

@Injectable({
  providedIn: 'root',
})
export class AdminSystemConfigService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.BASE_URL}/api/v1/admin/system-config`;

  getSystemConfiguration(): Observable<SystemConfigDto> {
    return this.http.get<SystemConfigDto>(this.baseUrl);
  }

  updateSystemConfiguration(dto: SystemConfigDto): Observable<SystemConfigDto> {
    return this.http.put<SystemConfigDto>(this.baseUrl, dto);
  }
}
