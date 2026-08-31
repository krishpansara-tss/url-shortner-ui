import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UrlResponseDto } from '../dtos/response/UrlResponseDto';
import { PageResponse } from '../dtos/response/PageResponse';

@Injectable({
  providedIn: 'root',
})
export class AdminUrlService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.BASE_URL}/api/v1/admin/urls`;

  getAllUrls(page: number = 0, size: number = 10): Observable<PageResponse<UrlResponseDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<UrlResponseDto>>(this.baseUrl, { params });
  }

  getUrlById(id: number): Observable<UrlResponseDto> {
    return this.http.get<UrlResponseDto>(`${this.baseUrl}/${id}`);
  }

  updateUrlStatus(id: number, status: string): Observable<UrlResponseDto> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<UrlResponseDto>(`${this.baseUrl}/${id}/status`, {}, { params });
  }
}
