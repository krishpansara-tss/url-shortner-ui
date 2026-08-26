import { Component, inject } from '@angular/core';
import { AuthServices } from '../../../core/services/auth.services';
import { MessageResponseDto } from '../../../core/dtos/response/MessageResponseDto';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-dasboard-page',
  styleUrl: './dasboard-page.css',
  templateUrl: './dasboard-page.html',
})
export class DasboardPage {
  authService = inject(AuthServices)
  router = inject(Router);

  email = '';
  role = '';

  ngOnInit(){
    this.getUserDetails()
  }
  getUserDetails() {
    this.email = this.authService.getLoggedInUserEmail() ?? 'nothing';
    this.role = this.authService.getLoggedInRole() ?? 'kai nay';
  }

  logoutButton(){
    this.authService.loggout().subscribe({
      next: (response: MessageResponseDto) => {
        this.authService.removeToken();
        alert(response.message);
        this.router.navigate([''])
      },

      error: (error: any) => {
        alert(error.error.message);
        console.error(error);
      }
    })
  }
}
