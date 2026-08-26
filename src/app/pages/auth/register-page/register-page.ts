import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RegisterRequestDto } from '../../../core/dtos/request/RegisterRequestDto';
import { FormsModule } from '@angular/forms';
import { AuthServices } from '../../../core/services/auth.services';
import { RegisterResponseDto } from '../../../core/dtos/response/RegisterResponseDto';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-register-page',
  styleUrl: './register-page.css',
  templateUrl: './register-page.html',
})
export class RegisterPage {
  
  registerRequestObj: RegisterRequestDto = {
    name: '',
    email: '',
    password: ''
  }

  authService = inject(AuthServices);

  register(){
    this.authService.register(this.registerRequestObj).subscribe({
      next: (response: RegisterResponseDto) => {
        
      },

      error: (error: any) => {
        console.error(error);
      }
    })
  }
}
