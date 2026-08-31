import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUrlService } from '../../../core/services/admin-url.service';
import { UrlService } from '../../../core/services/urls';
import { UrlResponseDto } from '../../../core/dtos/response/UrlResponseDto';
import { PageResponse } from '../../../core/dtos/response/PageResponse';

@Component({
  selector: 'app-manage-urls-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-urls-page.html',
  styleUrl: './manage-urls-page.css',
})
export class ManageUrlsPage implements OnInit {
  private adminUrlService = inject(AdminUrlService);
  private urlService = inject(UrlService);
  private cdr = inject(ChangeDetectorRef);

  urlsList: UrlResponseDto[] = [];
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  copiedId: number | null = null;

  ngOnInit(): void {
    this.loadAllUrls(0);
  }

  getErrorMessage(err: any): string {
    if (err?.status === 0) {
      return 'Cannot connect to backend server.';
    }
    return err?.error?.message || err?.message || 'Failed to load URLs.';
  }

  loadAllUrls(page: number = 0): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.adminUrlService.getAllUrls(page, this.pageSize).subscribe({
      next: (res: PageResponse<UrlResponseDto>) => {
        this.isLoading = false;
        this.urlsList = res?.content || [];
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

  changeStatus(url: UrlResponseDto, event: Event): void {
    const newStatus = (event.target as HTMLSelectElement).value;
    if (!newStatus || newStatus === url.urlStatus) return;

    this.errorMessage = '';
    this.cdr.detectChanges();

    this.adminUrlService.updateUrlStatus(url.urlId, newStatus).subscribe({
      next: (updated: UrlResponseDto) => {
        url.urlStatus = updated.urlStatus || newStatus;
        this.successMessage = `URL #${url.urlId} status changed to ${newStatus}`;
        this.urlsList = [...this.urlsList];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        const msg = this.getErrorMessage(err);
        alert('Status Change Error: ' + msg);
        this.cdr.detectChanges();
      },
    });
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

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadAllUrls(page);
    }
  }
}
