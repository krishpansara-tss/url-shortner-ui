import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginRequestDto } from '../../../core/dtos/request/LoginRequestDto';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthServices } from '../../../core/services/auth.services';
import { LoginResponseDto } from '../../../core/dtos/response/LoginResponseDto';
import { routes } from '../../../app.routes';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-login-page',
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPage {
  loginRequestObj: LoginRequestDto = {
    email: '',
    password: '',
  };

  router = inject(Router);
  authService = inject(AuthServices);

  login(form: NgForm) {

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    
    this.authService.login(this.loginRequestObj).subscribe({
      next: (response: LoginResponseDto) => {
        if (!response) {
          console.error('Some error occurred.');
          return;
        }

        this.authService.saveToken(response.token);
        this.router.navigate(['']);
      },

      error: (error: any) => {
        console.error(error);
        alert(error.error.message);
      },
    });
  }
}
