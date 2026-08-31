import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Navbar } from '../../navbar/navbar';
import { AuthServices } from '../../../core/services/auth.services';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, FormsModule, Navbar],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  loginObj = { email: '', password: '' };
  errorMessage = '';
  isLoading = false;

  authService = inject(AuthServices);
  router = inject(Router);

  getErrorMessage(err: any): string {
    if (err?.status === 0) {
      return 'Cannot connect to backend server at http://localhost:8081. Please ensure your Spring Boot backend is running.';
    }
    if (err?.error?.message) return err.error.message;
    if (err?.error?.error) return err.error.error;
    if (typeof err?.error === 'string') return err.error;
    return err?.message || 'Invalid email or password.';
  }

  login(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginObj).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && res.token) {
          this.authService.saveAuthData(res);
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin/manage-urls']);
          } else {
            this.router.navigate(['/users/urls']);
          }
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
        alert('Login Error: ' + this.errorMessage);
      },
    });
  }
}
