import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UrlRequestDto } from '../dtos/request/UrlRequestDto';
import { CustomUrlRequestDto } from '../dtos/request/CustomUrlRequestDto';
import { UrlResponseDto } from '../dtos/response/UrlResponseDto';
import { PaymentResponseDto } from '../dtos/response/PaymentResponseDto';
import { PageResponse } from '../dtos/response/PageResponse';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private http = inject(HttpClient);

  // Create a standard short URL
  createShortUrl(longUrl: string): Observable<UrlResponseDto> {
    const dto: UrlRequestDto = { longUrl };
    return this.http.post<UrlResponseDto>(`${environment.BASE_URL}/api/v1/urls`, dto);
  }

  // Create a custom URL alias (returns PaymentResponseDto for checkout)
  createCustomUrl(longUrl: string, customAlias: string): Observable<PaymentResponseDto> {
    const dto: CustomUrlRequestDto = { longUrl, alias: customAlias };
    return this.http.post<PaymentResponseDto>(`${environment.BASE_URL}/api/v1/urls/custom`, dto);
  }

  // Get paginated URLs for current user
  getUserUrls(page: number = 0, size: number = 10): Observable<PageResponse<UrlResponseDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<UrlResponseDto>>(`${environment.BASE_URL}/api/v1/urls`, { params });
  }

  // Get single URL by ID
  getUrlById(id: number): Observable<UrlResponseDto> {
    return this.http.get<UrlResponseDto>(`${environment.BASE_URL}/api/v1/urls/${id}`);
  }

  // Delete a URL
  deleteUrl(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.BASE_URL}/api/v1/urls/delete/${id}`);
  }

  // Toggle active/inactive status of a URL
  toggleActiveUrl(id: number): Observable<void> {
    return this.http.patch<void>(`${environment.BASE_URL}/api/v1/urls/active/${id}`, {});
  }

  // Helper method to resolve full clickable short URL
  getDisplayShortUrl(shortUrl: string): string {
    if (!shortUrl) return '';
    if (shortUrl.startsWith('http://') || shortUrl.startsWith('https://')) {
      return shortUrl;
    }
    return `${environment.BASE_URL}/api/v1/urls/redirect/${shortUrl}`;
  }
}

// Alias for backward compatibility
export const Urls = UrlService;
