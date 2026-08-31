import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPaymentService } from '../../../core/services/admin-payment.service';
import { PaymentResponseDto } from '../../../core/dtos/response/PaymentResponseDto';
import { PageResponse } from '../../../core/dtos/response/PageResponse';

@Component({
  selector: 'app-manage-payment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-payment-page.html',
  styleUrl: './manage-payment-page.css',
})
export class ManagePaymentPage implements OnInit {
  private adminPaymentService = inject(AdminPaymentService);
  private cdr = inject(ChangeDetectorRef);

  // Stats state
  stats: Record<string, any> = {};
  isLoadingStats = false;

  // Payments table state
  paymentsList: PaymentResponseDto[] = [];
  selectedStatus: string = 'ALL';
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadStats();
    this.loadPayments(0);
  }

  getErrorMessage(err: any): string {
    if (err?.status === 0) {
      return 'Cannot connect to backend server.';
    }
    return err?.error?.message || err?.message || 'Failed to load payments.';
  }

  loadStats(): void {
    this.isLoadingStats = true;
    this.adminPaymentService.getPaymentStats().subscribe({
      next: (res: Record<string, any>) => {
        this.isLoadingStats = false;
        this.stats = res || {};
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoadingStats = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadPayments(page: number = 0): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.adminPaymentService.getAllPayments(this.selectedStatus, page, this.pageSize).subscribe({
      next: (res: PageResponse<PaymentResponseDto>) => {
        this.isLoading = false;
        this.paymentsList = res?.content || [];
        this.currentPage = res?.page ?? 0;
        this.totalPages = res?.totalPages ?? 0;
        this.totalElements = res?.totalElements ?? 0;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }

  filterByStatus(status: string): void {
    if (this.selectedStatus === status) return;
    this.selectedStatus = status;
    this.loadPayments(0);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadPayments(page);
    }
  }
}
