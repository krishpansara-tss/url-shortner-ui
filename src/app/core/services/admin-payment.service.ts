import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentResponseDto } from '../dtos/response/PaymentResponseDto';
import { PageResponse } from '../dtos/response/PageResponse';

@Injectable({
  providedIn: 'root',
})
export class AdminPaymentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.BASE_URL}/api/v1/admin/payments`;

  getPaymentStats(): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`${this.baseUrl}/stats`);
  }

  getAllPayments(status?: string, page: number = 0, size: number = 10): Observable<PageResponse<PaymentResponseDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status && status !== 'ALL') {
      params = params.set('status', status);
    }

    return this.http.get<PageResponse<PaymentResponseDto>>(this.baseUrl, { params });
  }

  getPaymentById(id: number): Observable<PaymentResponseDto> {
    return this.http.get<PaymentResponseDto>(`${this.baseUrl}/${id}`);
  }
}
