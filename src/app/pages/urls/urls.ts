import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { UrlService } from '../../core/services/urls';
import { PaymentService } from '../../core/services/payment';
import { AuthServices } from '../../core/services/auth.services';
import { UrlResponseDto } from '../../core/dtos/response/UrlResponseDto';
import { PaymentResponseDto } from '../../core/dtos/response/PaymentResponseDto';
import { PageResponse } from '../../core/dtos/response/PageResponse';

@Component({
  selector: 'app-urls',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './urls.html',
  styleUrl: './urls.css',
})
export class Urls implements OnInit {
  private urlService = inject(UrlService);
  private paymentService = inject(PaymentService);
  private authService = inject(AuthServices);
  private cdr = inject(ChangeDetectorRef);

  // URL list state
  urlsList: UrlResponseDto[] = [];
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;
  totalElements = 0;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // New URL Form state
  activeTab: 'standard' | 'custom' = 'standard';
  longUrlInput = '';
  customAliasInput = '';
  isCreating = false;

  // Payment Approval state
  pendingPayment: PaymentResponseDto | null = null;
  isProcessingPayment = false;
  modalErrorMessage = '';
  lastCustomAlias = '';
  lastLongUrl = '';

  // Copy feedback tracking
  copiedId: number | null = null;

  ngOnInit(): void {
    this.loadUserUrls(0);
  }

  getErrorMessage(err: any): string {
    if (err?.status === 0) {
      return 'Cannot connect to backend server at http://localhost:8081. Please ensure your Spring Boot backend is running.';
    }
    if (err?.error?.message) {
      return err.error.message;
    }
    if (err?.error?.error) {
      return err.error.error;
    }
    if (typeof err?.error === 'string') {
      return err.error;
    }
    if (err?.message) {
      return err.message;
    }
    return 'An unexpected error occurred. Please try again.';
  }

  loadUserUrls(page: number = 0): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.urlService.getUserUrls(page, this.pageSize).subscribe({
      next: (res: PageResponse<UrlResponseDto>) => {
        this.isLoading = false;
        this.urlsList = [...(res?.content || [])];
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

  createUrl(): void {
    if (!this.longUrlInput) return;

    this.isCreating = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.modalErrorMessage = '';
    this.cdr.detectChanges();

    if (this.activeTab === 'custom' && this.customAliasInput) {
      this.lastCustomAlias = this.customAliasInput;
      this.lastLongUrl = this.longUrlInput;

      this.urlService.createCustomUrl(this.longUrlInput, this.customAliasInput).subscribe({
        next: (res: PaymentResponseDto) => {
          this.isCreating = false;
          this.pendingPayment = res;
          this.resetForm();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.isCreating = false;
          this.errorMessage = this.getErrorMessage(err);
          this.cdr.detectChanges();
          alert('Error: ' + this.errorMessage);
        },
      });
    } else {
      this.urlService.createShortUrl(this.longUrlInput).subscribe({
        next: () => {
          this.isCreating = false;
          this.successMessage = 'Short URL created successfully!';
          this.resetForm();
          this.loadUserUrls(0);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.isCreating = false;
          this.errorMessage = this.getErrorMessage(err);
          this.cdr.detectChanges();
          alert('Error: ' + this.errorMessage);
        },
      });
    }
  }

  buyExtraSlot(): void {
    const userId = this.authService.getUserId();
    this.isCreating = true;
    this.errorMessage = '';
    this.modalErrorMessage = '';
    this.lastCustomAlias = 'URL Limit Increase (+1 Slot)';
    this.lastLongUrl = 'Grants +1 additional URL creation slot to your account';
    this.cdr.detectChanges();

    this.paymentService.initiatePayment({
      userId: userId || undefined,
      paymentType: 'URL_SLOT_PURCHASE'
    }).subscribe({
      next: (res: PaymentResponseDto) => {
        this.isCreating = false;
        this.pendingPayment = res;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isCreating = false;
        this.errorMessage = this.getErrorMessage(err);
        this.cdr.detectChanges();
        alert('Slot Purchase Error: ' + this.errorMessage);
      }
    });
  }

  approvePayment(): void {
    if (!this.pendingPayment) return;

    this.isProcessingPayment = true;
    this.modalErrorMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.paymentService.processPayment(this.pendingPayment.paymentId).subscribe({
      next: (res: PaymentResponseDto) => {
        this.isProcessingPayment = false;
        const txnId = res.transactionId || 'COMPLETED';
        const msg = `Payment approved successfully! Transaction ID: ${txnId}. Benefit granted to your account.`;
        this.successMessage = msg;
        this.pendingPayment = null;
        this.modalErrorMessage = '';
        this.cdr.detectChanges();
        alert(msg);
        this.loadUserUrls(0);
      },
      error: (err: any) => {
        this.isProcessingPayment = false;
        this.modalErrorMessage = this.getErrorMessage(err);
        this.cdr.detectChanges();
        alert('Payment Approval Error: ' + this.modalErrorMessage);
      },
    });
  }

  payAndActivate(): void {
    this.approvePayment();
  }

  cancelPendingPayment(): void {
    if (!this.pendingPayment) {
      return;
    }

    this.paymentService.cancelPayment(this.pendingPayment.paymentId).subscribe({
      next: () => {
        this.pendingPayment = null;
        this.modalErrorMessage = '';
        this.cdr.detectChanges();
        this.loadUserUrls(0);
      },
      error: (err: any) => {
        this.pendingPayment = null;
        this.modalErrorMessage = '';
        this.errorMessage = this.getErrorMessage(err);
        this.cdr.detectChanges();
        this.loadUserUrls(0);
      },
    });
  }

  resetForm(): void {
    this.longUrlInput = '';
    this.customAliasInput = '';
  }

  getDisplayShortUrl(shortUrl: string): string {
    return this.urlService.getDisplayShortUrl(shortUrl);
  }

  copyToClipboard(url: UrlResponseDto): void {
    const fullUrl = this.getDisplayShortUrl(url.shortUrl);
    if (!fullUrl) return;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.copiedId = url.urlId;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.copiedId = null;
        this.cdr.detectChanges();
      }, 2000);
    });
  }

  activateUrl(url: UrlResponseDto): void {
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.urlService.toggleActiveUrl(url.urlId).subscribe({
      next: () => {
        url.urlStatus = 'ACTIVE';
        this.urlsList = [...this.urlsList];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = this.getErrorMessage(err);
        this.cdr.detectChanges();
        alert('Activation Error: ' + this.errorMessage);
      },
    });
  }

  deleteUrl(url: UrlResponseDto): void {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    this.errorMessage = '';
    this.cdr.detectChanges();

    this.urlService.deleteUrl(url.urlId).subscribe({
      next: () => {
        url.urlStatus = 'DELETED';
        this.urlsList = [...this.urlsList];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = this.getErrorMessage(err);
        this.cdr.detectChanges();
        alert('Delete Error: ' + this.errorMessage);
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadUserUrls(page);
    }
  }
}
