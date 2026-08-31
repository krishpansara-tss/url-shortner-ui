import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Navbar } from '../../navbar/navbar';
import { AuthServices } from '../../../core/services/auth.services';
import { RegisterRequestDto } from '../../../core/dtos/request/RegisterRequestDto';

@Component({
  selector: 'app-register-page',
  imports: [RouterLink, FormsModule, Navbar],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  registerRequestObj: RegisterRequestDto = {
    name: '',
    email: '',
    password: ''
  };

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
    return err?.message || 'Registration failed. Please try again.';
  }

  register(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerRequestObj).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.token) {
          this.authService.saveAuthData(response);
          this.router.navigate(['/users/urls']);
        } else {
          alert('Registration successful! Please login.');
          this.router.navigate(['/login']);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(err);
        alert('Registration Error: ' + this.errorMessage);
      }
    });
  }
}
