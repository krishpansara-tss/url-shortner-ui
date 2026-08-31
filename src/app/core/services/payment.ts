import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentResponseDto } from '../dtos/response/PaymentResponseDto';
import { PageResponse } from '../dtos/response/PageResponse';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);

  // Initiate a new payment (e.g. for URL_SLOT_PURCHASE or URL_RENEWAL)
  initiatePayment(dto: { userId?: number; urlId?: number; paymentType: string }): Observable<PaymentResponseDto> {
    return this.http.post<PaymentResponseDto>(
      `${environment.BASE_URL}/api/v1/payments`,
      dto
    );
  }

  // Process a pending payment
  processPayment(paymentId: number): Observable<PaymentResponseDto> {
    return this.http.post<PaymentResponseDto>(
      `${environment.BASE_URL}/api/v1/payments/${paymentId}/process`,
      {}
    );
  }

  // Cancel a pending payment
  cancelPayment(paymentId: number): Observable<PaymentResponseDto> {
    return this.http.post<PaymentResponseDto>(
      `${environment.BASE_URL}/api/v1/payments/${paymentId}/cancel`,
      {}
    );
  }

  // Get user payments list
  getUserPayments(page: number = 0, size: number = 10): Observable<PageResponse<PaymentResponseDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<PaymentResponseDto>>(
      `${environment.BASE_URL}/api/v1/payments`,
      { params }
    );
  }

  // Get single payment details by ID
  getPaymentById(paymentId: number): Observable<PaymentResponseDto> {
    return this.http.get<PaymentResponseDto>(
      `${environment.BASE_URL}/api/v1/payments/${paymentId}`
    );
  }
}
