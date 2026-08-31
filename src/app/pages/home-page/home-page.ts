import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { AuthServices } from '../../core/services/auth.services';
import { UrlService } from '../../core/services/urls';
import { Router, RouterLink } from '@angular/router';
import { UrlResponseDto } from '../../core/dtos/response/UrlResponseDto';

@Component({
  imports: [FormsModule, Navbar, RouterLink],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {
  longUrl = '';
  createdUrl: UrlResponseDto | null = null;
  copied = false;
  isLoading = false;
  errorMessage = '';

  authService = inject(AuthServices);
  urlService = inject(UrlService);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  getErrorMessage(err: any): string {
    if (err?.status === 0) {
      return 'Cannot connect to backend server at http://localhost:8081. Please ensure your Spring Boot backend is running.';
    }
    if (err?.error?.message) return err.error.message;
    if (err?.error?.error) return err.error.error;
    if (typeof err?.error === 'string') return err.error;
    return err?.message || 'Failed to shorten URL. Please try again.';
  }

  shortenUrl(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.authService.isLoggedIn()) {
      alert('Please login first to shorten links.');
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.copied = false;
    this.cdr.detectChanges();

    this.urlService.createShortUrl(this.longUrl).subscribe({
      next: (res: UrlResponseDto) => {
        this.isLoading = false;
        this.createdUrl = res;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
        this.cdr.detectChanges();
        alert('Error: ' + this.errorMessage);
      }
    });
  }

  getDisplayShortUrl(shortUrl: string): string {
    return this.urlService.getDisplayShortUrl(shortUrl);
  }

  copyToClipboard(text: string) {
    const fullUrl = this.getDisplayShortUrl(text);
    if (!fullUrl) return;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.copied = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.copied = false;
        this.cdr.detectChanges();
      }, 2500);
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
